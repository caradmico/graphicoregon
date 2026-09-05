#!/usr/bin/env python3
"""North Coast map desk — invite-only admin.

Run:  python3 app.py
First user: set ADMIN_EMAIL and ADMIN_PASSWORD in the environment, then start once.
Nobody can sign themselves up. Only an existing admin can add another person.
"""
from __future__ import annotations

import os
import re
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path

from flask import (
    Flask,
    abort,
    flash,
    redirect,
    render_template,
    request,
    send_from_directory,
    session,
    url_for,
)
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

ROOT = Path(__file__).resolve().parent
REPO_NCCWP = ROOT.parent if ROOT.name == "admin" else ROOT
DATA_DIR = Path(os.environ.get("NCCWP_DATA", str(REPO_NCCWP / "data")))
UPLOAD_DIR = DATA_DIR / "uploads"
VAR_DIR = ROOT / "var"
DB_PATH = Path(os.environ.get("NCCWP_DB", str(VAR_DIR / "desk.db")))

ALLOWED_EXT = {
    ".geojson",
    ".json",
    ".csv",
    ".zip",
    ".kml",
    ".gpkg",
    ".md",
    ".txt",
}
MAX_BYTES = 40 * 1024 * 1024

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-only-change-me")
app.config["MAX_CONTENT_LENGTH"] = MAX_BYTES


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def db() -> sqlite3.Connection:
    VAR_DIR.mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    con.execute("PRAGMA foreign_keys = ON")
    return con


def init_db() -> None:
    con = db()
    con.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL DEFAULT '',
            password_hash TEXT NOT NULL,
            is_admin INTEGER NOT NULL DEFAULT 1,
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            created_by TEXT
        );
        CREATE TABLE IF NOT EXISTS resets (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL UNIQUE,
            expires_at TEXT NOT NULL,
            used INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """
    )
    email = (os.environ.get("ADMIN_EMAIL") or "").strip().lower()
    password = os.environ.get("ADMIN_PASSWORD") or ""
    if email and password:
        row = con.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if not row:
            con.execute(
                "INSERT INTO users (email, name, password_hash, is_admin, active, created_at, created_by) VALUES (?,?,?,?,1,?,?)",
                (
                    email,
                    os.environ.get("ADMIN_NAME", "Desk admin"),
                    generate_password_hash(password),
                    1,
                    utcnow().isoformat(),
                    "env",
                ),
            )
    con.commit()
    con.close()


def current_user():
    uid = session.get("uid")
    if not uid:
        return None
    con = db()
    row = con.execute(
        "SELECT * FROM users WHERE id = ? AND active = 1", (uid,)
    ).fetchone()
    con.close()
    return row


def login_required(fn):
    @wraps(fn)
    def wrap(*args, **kwargs):
        user = current_user()
        if not user:
            return redirect(url_for("login", next=request.path))
        return fn(*args, **kwargs)

    return wrap


def clean_email(raw: str) -> str:
    return (raw or "").strip().lower()


def valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


@app.context_processor
def inject_user():
    return {"me": current_user()}


@app.route("/")
def home():
    if current_user():
        return redirect(url_for("files"))
    return redirect(url_for("login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user():
        return redirect(url_for("files"))
    if request.method == "POST":
        email = clean_email(request.form.get("email"))
        password = request.form.get("password") or ""
        con = db()
        row = con.execute(
            "SELECT * FROM users WHERE email = ? AND active = 1", (email,)
        ).fetchone()
        con.close()
        if row and check_password_hash(row["password_hash"], password):
            session.clear()
            session["uid"] = row["id"]
            session.permanent = True
            dest = request.args.get("next") or url_for("files")
            if not dest.startswith("/"):
                dest = url_for("files")
            return redirect(dest)
        flash("That email or password did not match.")
    return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/forgot", methods=["GET", "POST"])
def forgot():
    if request.method == "POST":
        email = clean_email(request.form.get("email"))
        con = db()
        row = con.execute(
            "SELECT * FROM users WHERE email = ? AND active = 1", (email,)
        ).fetchone()
        token = None
        if row:
            token = secrets.token_urlsafe(32)
            expires = (utcnow() + timedelta(hours=2)).isoformat()
            con.execute(
                "INSERT INTO resets (user_id, token, expires_at, used) VALUES (?,?,?,0)",
                (row["id"], token, expires),
            )
            con.commit()
        con.close()
        link = url_for("reset_password", token=token, _external=True) if token else None
        if link:
            app.logger.info("Password reset for %s: %s", email, link)
            if os.environ.get("MAIL_FROM"):
                try_send_mail(email, link)
        flash("If that account exists, a reset link is ready. Ask another admin if it did not arrive — they can set a new password.")
        return redirect(url_for("login"))
    return render_template("forgot.html")


def try_send_mail(to_email: str, link: str) -> None:
    host = os.environ.get("SMTP_HOST")
    if not host:
        return
    import smtplib
    from email.message import EmailMessage

    msg = EmailMessage()
    msg["Subject"] = "North Coast map — reset your password"
    msg["From"] = os.environ.get("MAIL_FROM", "noreply@localhost")
    msg["To"] = to_email
    msg.set_content(
        "Use this link in the next two hours to set a new password:\n\n" + link + "\n"
    )
    with smtplib.SMTP(host, int(os.environ.get("SMTP_PORT", "587"))) as s:
        s.starttls()
        user = os.environ.get("SMTP_USER")
        if user:
            s.login(user, os.environ.get("SMTP_PASSWORD", ""))
        s.send_message(msg)


@app.route("/reset/<token>", methods=["GET", "POST"])
def reset_password(token):
    con = db()
    row = con.execute(
        """
        SELECT resets.*, users.email
        FROM resets JOIN users ON users.id = resets.user_id
        WHERE resets.token = ? AND resets.used = 0 AND users.active = 1
        """,
        (token,),
    ).fetchone()
    if not row or row["expires_at"] < utcnow().isoformat():
        con.close()
        flash("That reset link is expired or already used.")
        return redirect(url_for("forgot"))
    if request.method == "POST":
        pw = request.form.get("password") or ""
        if len(pw) < 10:
            flash("Use at least ten characters.")
            con.close()
            return render_template("reset.html", email=row["email"])
        con.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            (generate_password_hash(pw), row["user_id"]),
        )
        con.execute("UPDATE resets SET used = 1 WHERE id = ?", (row["id"],))
        con.commit()
        con.close()
        flash("Password saved. Sign in.")
        return redirect(url_for("login"))
    con.close()
    return render_template("reset.html", email=row["email"])


def list_files():
    items = []
    if not DATA_DIR.exists():
        return items
    for path in sorted(DATA_DIR.rglob("*")):
        if not path.is_file():
            continue
        if path.name.startswith("."):
            continue
        rel = path.relative_to(DATA_DIR).as_posix()
        items.append(
            {
                "name": rel,
                "size": path.stat().st_size,
                "mtime": datetime.fromtimestamp(path.stat().st_mtime).strftime(
                    "%Y-%m-%d %H:%M"
                ),
                "deletable": rel.startswith("uploads/"),
            }
        )
    return items


@app.route("/files")
@login_required
def files():
    return render_template("files.html", files=list_files(), data_dir=str(DATA_DIR))


@app.route("/files/upload", methods=["POST"])
@login_required
def files_upload():
    incoming = request.files.get("file")
    if not incoming or not incoming.filename:
        flash("Choose a file.")
        return redirect(url_for("files"))
    name = secure_filename(incoming.filename)
    ext = Path(name).suffix.lower()
    if ext not in ALLOWED_EXT:
        flash("That file type is not allowed.")
        return redirect(url_for("files"))
    dest = UPLOAD_DIR / name
    if dest.exists():
        stem = Path(name).stem
        dest = UPLOAD_DIR / f"{stem}-{secrets.token_hex(3)}{ext}"
    incoming.save(dest)
    flash(f"Saved {dest.relative_to(DATA_DIR).as_posix()}")
    return redirect(url_for("files"))


@app.route("/files/delete", methods=["POST"])
@login_required
def files_delete():
    rel = (request.form.get("name") or "").replace("\\", "/")
    if not rel.startswith("uploads/") or ".." in rel:
        abort(400)
    path = (DATA_DIR / rel).resolve()
    try:
        path.relative_to(UPLOAD_DIR.resolve())
    except ValueError:
        abort(400)
    if path.is_file():
        path.unlink()
        flash(f"Removed {rel}")
    return redirect(url_for("files"))


@app.route("/files/download/<path:name>")
@login_required
def files_download(name):
    path = (DATA_DIR / name).resolve()
    try:
        path.relative_to(DATA_DIR.resolve())
    except ValueError:
        abort(400)
    if not path.is_file():
        abort(404)
    return send_from_directory(path.parent, path.name, as_attachment=True)


@app.route("/people")
@login_required
def people():
    con = db()
    rows = con.execute(
        "SELECT id, email, name, active, created_at, created_by FROM users ORDER BY email"
    ).fetchall()
    con.close()
    return render_template("people.html", people=rows)


@app.route("/people/add", methods=["POST"])
@login_required
def people_add():
    email = clean_email(request.form.get("email"))
    name = (request.form.get("name") or "").strip()
    password = request.form.get("password") or ""
    if not valid_email(email):
        flash("Need a real email.")
        return redirect(url_for("people"))
    if len(password) < 10:
        flash("Give them a temporary password of at least ten characters.")
        return redirect(url_for("people"))
    me = current_user()
    con = db()
    try:
        con.execute(
            "INSERT INTO users (email, name, password_hash, is_admin, active, created_at, created_by) VALUES (?,?,?,?,1,?,?)",
            (
                email,
                name or email,
                generate_password_hash(password),
                1,
                utcnow().isoformat(),
                me["email"],
            ),
        )
        con.commit()
        flash(f"Added {email}. Tell them the temporary password and ask them to change it.")
    except sqlite3.IntegrityError:
        flash("That email is already on the list.")
    finally:
        con.close()
    return redirect(url_for("people"))


@app.route("/people/password", methods=["POST"])
@login_required
def people_password():
    uid = int(request.form.get("id") or 0)
    password = request.form.get("password") or ""
    if len(password) < 10:
        flash("Use at least ten characters.")
        return redirect(url_for("people"))
    con = db()
    con.execute(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        (generate_password_hash(password), uid),
    )
    con.commit()
    con.close()
    flash("Password replaced.")
    return redirect(url_for("people"))


@app.route("/people/toggle", methods=["POST"])
@login_required
def people_toggle():
    uid = int(request.form.get("id") or 0)
    me = current_user()
    if uid == me["id"]:
        flash("You cannot turn off your own account.")
        return redirect(url_for("people"))
    con = db()
    row = con.execute("SELECT active FROM users WHERE id = ?", (uid,)).fetchone()
    if row:
        con.execute(
            "UPDATE users SET active = ? WHERE id = ?",
            (0 if row["active"] else 1, uid),
        )
        con.commit()
    con.close()
    return redirect(url_for("people"))


init_db()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5055")), debug=False)

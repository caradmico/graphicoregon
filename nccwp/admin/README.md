# North Coast map desk

Small sign-in for people who keep the map. It is not the public map. The public map stays a static page.

## What it does

- Sign in with email and password
- Reset a password (email if the host has SMTP; otherwise another person on the list types a new one)
- Add or turn off people — no public signup
- See every file under `nccwp/data`
- Upload a layer into `nccwp/data/uploads`
- Delete only files that were uploaded (not the original creek map)

## First start

From this folder:

```
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
export SECRET_KEY='pick-a-long-random-string'
export ADMIN_EMAIL='you@example.com'
export ADMIN_PASSWORD='at-least-ten-characters'
.venv/bin/python app.py
```

Open http://127.0.0.1:5055

`ADMIN_EMAIL` is created only if that address is not already in the database. After the first run you can leave those two variables off.

## Mail (optional)

If the host can send mail:

```
export SMTP_HOST=smtp.example.com
export SMTP_PORT=587
export SMTP_USER=...
export SMTP_PASSWORD=...
export MAIL_FROM=desk@example.com
```

Without mail, use **People → Set password**.

## Where things live

| Thing | Place |
| --- | --- |
| Accounts | `admin/var/desk.db` (not for git) |
| Creek map data | `nccwp/data/` |
| New uploads | `nccwp/data/uploads/` |

This process does not run on GitHub Pages. Put it on a small host (Fly, Railway, a county box) when you leave the laptop.

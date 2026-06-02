# The Stage — Django API

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

Default DB: **SQLite** (`USE_SQLITE=True` in `.env`). For PostgreSQL set `USE_SQLITE=False` and configure `POSTGRES_*` vars.

## API map

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/v1/auth/register/` | No |
| POST | `/api/v1/auth/token/` | No |
| POST | `/api/v1/auth/token/refresh/` | No |
| POST | `/api/v1/auth/otp/verify/` | No |
| GET | `/api/v1/discover/feed/` | JWT |
| POST | `/api/v1/discover/swipe/` | JWT |
| GET | `/api/v1/profiles/<id>/` | JWT |
| PATCH | `/api/v1/profiles/me/` | JWT |

## Swipe body

```json
{
  "receiver_id": 42,
  "action_type": "like"
}
```

`receiver_id` is the **user PK**, not the profile PK. The mobile app sends `artist.uuid` from the feed card.

Mutual `like` creates a `Match` row automatically.

## Media rules

- Max **7** `MediaAsset` rows per profile (`order_index` 0–6)
- Videos validated for extension (`mp4`, `mov`, `webm`) and max size (`MEDIA_MAX_VIDEO_MB`, default 50)
- Set `USE_S3=True` in `.env` to switch uploads to AWS S3 via `django-storages`

# Proje1

OBD-II diagnostics app with FastAPI backend and Expo frontend.

## Quick start

Backend:

1. Copy env example and set values.
2. Install deps and run the server.

```bash
cd backend
copy .env.example .env
pip install -r requirements.txt
uvicorn server:app --reload
```

Frontend:

1. Copy env example and set backend URL.
2. Install deps and start Expo.

```bash
cd frontend
copy .env.example .env
npm install
npx expo start
```

## Environment variables

Backend (.env):

- MONGO_URL
- DB_NAME
- SECRET_KEY (required; at least 32 random bytes, keep it secret, changing it invalidates all tokens)
- ALLOWED_ORIGINS (comma-separated)
- ADMIN_BOOTSTRAP_ENABLED (true/false)
- ADMIN_BOOTSTRAP_USERNAME
- ADMIN_BOOTSTRAP_PASSWORD
- ADMIN_BOOTSTRAP_EMAIL
- ADMIN_BOOTSTRAP_FORCE_RESET (true/false)
- VERIFICATION_CODE_LENGTH
- VERIFICATION_CODE_TTL_MINUTES
- DEBUG_VERIFICATION_CODES (true/false, dev only)

Frontend (.env):

- EXPO_PUBLIC_BACKEND_URL

source .venv/bin/activate
alembic upgrade head
uvicorn backend_cri_ere.main:app --host 0.0.0.0 --port 8000
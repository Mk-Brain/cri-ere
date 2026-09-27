
FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY pyproject.toml uv.lock ./
# Installer les dependances avant le code pour profiter du cache Docker.
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-install-project

COPY . .
RUN uv sync --locked

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "backend_cri_ere.main:app", "--host", "0.0.0.0", "--port", "8000"]


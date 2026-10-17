
FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:0.12 /uv /uvx /bin/

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && uv sync --no-install-project --no-dev --locked \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml uv.lock ./
# Installer les dependances avant le code pour profiter du cache Docker.
RUN uv sync --locked --no-install-project

COPY . .

RUN useradd -m -u 1000 appuser \
    && mkdir -p /data/uploads \
    && chown -R appuser:appuser /app /data/uploads

RUN chmod +x start.sh

USER appuser

EXPOSE 8000

CMD ["bash", "start.sh"]


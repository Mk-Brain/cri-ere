## Variables d'environnement

Le fichier `.env` est lu par deux composants differents :

- FastAPI lit `PROJECT_NAME`, `BACKEND_CORS_ORIGINS` et les variables `DB_*`
  necessaires a sa connexion SQLAlchemy.
- Docker Compose lit aussi `DB_ROOT_PASSWORD` et `PMA_PORT`. Ces variables ne
  sont pas utilisees par le code FastAPI.

Le fichier `.env` reste local et n'est pas versionne. Utiliser `.env.example`
comme modele pour creer un fichier `.env` sur une nouvelle machine.

Quand l'application est lancee depuis la machine hote, `DB_HOST=localhost` et
`DB_PORT` doit correspondre au port expose par Compose. Si le backend est ajoute
dans Compose plus tard, il devra utiliser `DB_HOST=db` et le port interne
`DB_PORT=3306`.

## Base de donnees

La base MySQL est lancee dans Docker. Le fichier `.env` contient les parametres
utilises par l'application et par Compose.

```bash
docker compose up -d db
```

Cette commande cree uniquement la base MySQL vide et conserve ses donnees dans
le volume `mysql_data`. Les tables sont gerees exclusivement par Alembic.

Pour creer la premiere migration apres modification des modeles :

```bash
uv run alembic revision --autogenerate -m "initial schema"
uv run alembic upgrade head
```

Pour appliquer les migrations suivantes :

```bash
uv run alembic upgrade head
```

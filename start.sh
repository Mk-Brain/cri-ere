ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo -e "___________demarrage_________\n"


# Vérifie les dossiers
for dir in Backend_cri_ere dashboard frontend; do
    if [ ! -d "$ROOT_DIR/$dir" ]; then
        echo "❌ Dossier introuvable : $ROOT_DIR/$dir"
        exit 1
    fi
done

# Fonction qui génère le "bash -c ..." proprement
run_in_tab() {
    local title="$1"
    local dir="$2"
    local cmd="$3"

    gnome-terminal --tab --title="$title" -- bash -c "
        cd '$dir' || { echo 'cd échoué'; exec bash; }
        $cmd
        code=\$?
        echo \"--- $title terminé (code \$code) ---\"
        exec bash
    "
}

run_in_tab "⚙️ Backend"       "$ROOT_DIR/Backend_cri_ere"       "source .venv/bin/activate && uv run dev"
run_in_tab "🖥️ Dashboard"     "$ROOT_DIR/dashboard"     "npm run dev"
run_in_tab "🌐 Frontend"      "$ROOT_DIR/frontend"      "npm run dev"


echo -e "____________Démarrage terminé____________\n"
echo "👉 Ctrl+PageUp / Ctrl+PageDown pour naviguer entre les onglets"
import "../css/formulaire.css";

import FormBg from "../assets/images/portail.jpg";

export const Formulaire = () => {
  return (
    <div
      className="form-page"
      style={{
        backgroundImage: `linear-gradient(rgba(12, 35, 27, 0.45), rgba(12, 35, 27, 0.45)), url(${FormBg})`,
      }}
    >
      <div className="form-page-shell">
        <form className="reservation-form" method="post" action="">
          <h2>Formulaire de réservation</h2>

          <div className="form-row">
            <input type="text" name="nom" placeholder="Votre nom" />
            <input type="text" name="prenom" placeholder="Votre prénom" />
          </div>

          <label className="field">
            <span className="field-label">Type de visite</span>
            <select name="type-visite">
              <option>Visite guidée</option>
              <option>Atelier éducatif</option>
              <option>Visite thématique</option>
            </select>
          </label>

          <label className="field">
            <span className="field-label">Adresse e-mail</span>
            <input
              type="email"
              name="email"
              placeholder="Votre adresse e-mail"
            />
          </label>

          <label className="field">
            <span className="field-label">Téléphone</span>
            <input
              type="tel"
              name="telephone"
              placeholder="Numéro de téléphone"
            />
          </label>

          <div className="form-row">
            <label className="field">
              <span className="field-label">Date de visite</span>
              <input type="date" name="date" />
            </label>

            <label className="field">
              <span className="field-label">Heure de visite</span>
              <input type="time" name="time" />
            </label>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" name="verification" />
            <span>J’ai lu et vérifié mes informations.</span>
          </label>

          <button type="submit" className="submit-btn">
            Enregistrer
          </button>
        </form>

        <a href="/" className="back-home-btn" title="Retour à l’accueil">
          <span>▲</span>
          <span>Accueil</span>
        </a>
      </div>
    </div>
  );
};

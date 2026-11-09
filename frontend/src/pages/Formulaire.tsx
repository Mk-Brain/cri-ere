import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import "../css/formulaire.css";
import { useDebounce } from "../hooks/useDebounce";

import FormBg from "../assets/images/portail.jpg";
import {
  createVisitReservation,
  getPublicOptions,
} from "../services/reservation";
import type {
  FormOptions,
  ReservationFormData,
  ReservationResult,
} from "../types/DomainTypes";

function getTodayDate(): string {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

export const Formulaire = () => {
  const [options, setOptions] = useState<FormOptions | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [retryOptions, setRetryOptions] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<ReservationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationDate, setReservationDate] = useState("")
  const debouncedReservationDate = useDebounce(reservationDate);


  useEffect(() => {
     console.log("Debounced reservation date:", debouncedReservationDate);
    let isMounted = true;
    setOptionsError(null);
    if (debouncedReservationDate) {
      getPublicOptions(debouncedReservationDate)
        .then((loadedOptions) => {
          if (isMounted) setOptions(loadedOptions);
        })
        .catch((error: unknown) => {
          if (isMounted) {
            setOptionsError(
              error instanceof Error
                ? error.message
                : "Impossible de charger les options de visite.",
            );
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [debouncedReservationDate, retryOptions]);

  const handleSubmit = async (
    event: JSX.TargetedEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSubmitError(null);
    setReservation(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const reservationData: ReservationFormData = {
      visiteur: {
        nom: String(formData.get("nom") ?? "").trim(),
        prenom: String(formData.get("prenom") ?? "").trim() || undefined,
        email: String(formData.get("email") ?? "").trim(),
        telephone: String(formData.get("telephone") ?? "").trim(),
      },
      visite: {
        date_visite: String(formData.get("date_visite") ?? ""),
        nombre_personnes: Number(formData.get("nombre_personnes")),
        id_parcours: Number(formData.get("id_parcours")),
        id_creneau: Number(formData.get("id_creneau")),
        id_guide: Number(formData.get("id_guide")),
      },
    };

    try {
      const result = await createVisitReservation(reservationData);
      setReservation(result);
      formElement.reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "La réservation n’a pas pu être enregistrée. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const optionsUnavailable =
    !options ||
    options.parcours.length === 0 ||
    options.creneaux.length === 0 ||
    options.guides.length === 0;
  const submitLabel = isSubmitting
    ? "Enregistrement…"
    : !options && !optionsError
      ? "Chargement des options…"
      : optionsUnavailable
        ? "Options indisponibles"
        : "Envoyer ma demande";

  return (
    <div
      className="form-page"
      style={{
        backgroundImage: `linear-gradient(rgba(12, 35, 27, 0.45), rgba(12, 35, 27, 0.45)), url(${FormBg})`,
      }}
    >
      <div className="form-page-shell">
        <form className="reservation-form" onSubmit={handleSubmit}>
          <h2>Formulaire de réservation</h2>
          <p className="form-description">
            Renseignez vos coordonnées et choisissez les détails de votre visite.
          </p>

          {optionsError && (
            <div className="form-feedback form-feedback--error" role="alert">
              <span>{optionsError}</span>
              <button
                type="button"
                className="retry-btn"
                onClick={() => {
                  setOptions(null);
                  setRetryOptions((current) => current + 1);
                }}
              >
                Réessayer
              </button>
            </div>
          )}

          {!options && !optionsError && debouncedReservationDate && (
            <p className="form-feedback" role="status">
              Chargement des parcours, créneaux et guides…
            </p>
          )}


          {reservation && (
            <p className="form-feedback form-feedback--success" role="status">
              Votre demande a bien été enregistrée. Votre référence est le{" "}
              <strong>#{reservation.id_visite}</strong>.
            </p>
          )}

          {submitError && (
            <p className="form-feedback form-feedback--error" role="alert">
              {submitError}
            </p>
          )}

          <fieldset disabled={isSubmitting}>
            <legend>Vos coordonnées</legend>
            <div className="form-row">
              <label className="field">
                <span className="field-label">Nom</span>
                <input
                  type="text"
                  name="nom"
                  placeholder="Votre nom"
                  autoComplete="family-name"
                  maxLength={255}
                  required
                />
              </label>
              <label className="field">
                <span className="field-label">Prénom (facultatif)</span>
                <input
                  type="text"
                  name="prenom"
                  placeholder="Votre prénom"
                  autoComplete="given-name"
                  maxLength={255}
                />
              </label>
            </div>

            <div className="form-row">
              <label className="field">
                <span className="field-label">Adresse e-mail</span>
                <input
                  type="email"
                  name="email"
                  placeholder="nom@exemple.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>
              <label className="field">
                <span className="field-label">Téléphone</span>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Votre numéro de téléphone"
                  autoComplete="tel"
                  maxLength={50}
                  required
                />
              </label>
            </div>

            <legend className="visit-legend">Détails de la visite</legend>
            <label className="field">
                <span className="field-label">Date de visite</span>
                <input
                  type="date"
                  name="date_visite"
                  min={getTodayDate()}
                  required
                  onChange={(event) => {
                    setReservationDate(event.currentTarget.value);
                  }}
                />
              </label>
            <fieldset disabled={optionsUnavailable}>
              {options && optionsUnavailable && (
            <p className="form-feedback" role="status">
              Certains éléments de visite ne sont pas disponibles pour cette date
            . Veuillez réessayer ultérieurement ou choisissez une autre date.
            </p>
          )}
            <div className="form-row">
              <label className="field">
              <span className="field-label">Parcours ou type de visite</span>
              <select name="id_parcours" required defaultValue="">
                <option value="" disabled>
                  Choisissez un parcours
                </option>
                {options?.parcours.map((parcours) => (
                  <option
                    key={parcours.id_parcours}
                    value={parcours.id_parcours}
                  >
                    {parcours.nom}
                  </option>
                ))}
              </select>
            </label>
              <label className="field">
                <span className="field-label">Nombre de visiteurs</span>
                <input
                  type="number"
                  name="nombre_personnes"
                  min={1}
                  step={1}
                  defaultValue={1}
                  required
                />
              </label>
            </div>

            <div className="form-row">
              <label className="field">
                <span className="field-label">Créneau horaire</span>
                <select name="id_creneau" required defaultValue="">
                  <option value="" disabled>
                    Choisissez un créneau
                  </option>
                  {options?.creneaux.map((creneau) => (
                    <option
                      key={creneau.id_creneau}
                      value={creneau.id_creneau}
                    >
                      {creneau.heure_debut} – {creneau.heure_fin}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Guide</span>
                <select name="id_guide" required defaultValue="">
                  <option value="" disabled>
                    Choisissez un guide
                  </option>
                  {options?.guides.map((guide) => (
                    <option key={guide.id_guide} value={guide.id_guide}>
                      {guide.prenom ? `${guide.prenom} ` : ""}
                      {guide.nom}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || optionsUnavailable}
            >
              {submitLabel}
            </button>
            </fieldset>
          </fieldset>
        </form>

        <a href="/" className="back-home-btn" title="Retour à l’accueil">
          <span>▲</span>
          <span>Accueil</span>
        </a>
      </div>
    </div>
  );
};

import type { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import "../css/formulaire.css";
import { useDebounce } from "../hooks/useDebounce";

import FormBg from "../assets/images/portail.jpg";
import {
  checkVisitorByPhone,
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
  const [reservationDate, setReservationDate] = useState("");
  const debouncedReservationDate = useDebounce(reservationDate);
  const [phoneLookup, setPhoneLookup] = useState("");
  const debouncedPhoneLookup = useDebounce(phoneLookup);
  const [emailValue, setEmailValue] = useState("");
  const [nomValue, setNomValue] = useState("");
  const [prenomValue, setPrenomValue] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const contactStepRef = useRef<HTMLFieldSetElement>(null);
  const dateStepRef = useRef<HTMLFieldSetElement>(null);
  const editedVisitorFieldsRef = useRef({
    email: false,
    nom: false,
    prenom: false,
  });

  useEffect(() => {
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

  useEffect(() => {
    const phone = debouncedPhoneLookup.trim();
    if (phone.length < 6) {
      if (!editedVisitorFieldsRef.current.email) setEmailValue("");
      if (!editedVisitorFieldsRef.current.nom) setNomValue("");
      if (!editedVisitorFieldsRef.current.prenom) setPrenomValue("");
      return;
    }

    let isCurrent = true;
    checkVisitorByPhone(phone)
      .then((visitor) => {
        if (!isCurrent) return;
        if (!visitor) {
          if (!editedVisitorFieldsRef.current.email) setEmailValue("");
          if (!editedVisitorFieldsRef.current.nom) setNomValue("");
          if (!editedVisitorFieldsRef.current.prenom) setPrenomValue("");
          return;
        }
        if (!editedVisitorFieldsRef.current.email)
          setEmailValue(visitor.email);
        if (!editedVisitorFieldsRef.current.nom)
          setNomValue(visitor.nom);
        if (!editedVisitorFieldsRef.current.prenom)
          setPrenomValue(visitor.prenom ?? "");
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          console.error("Échec de la vérification du visiteur.", error);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [debouncedPhoneLookup]);

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
      setCurrentStep(1);
      setReservationDate("");
      setOptions(null);
      setPhoneLookup("");
      setEmailValue("");
      setNomValue("");
      setPrenomValue("");
      editedVisitorFieldsRef.current = {
        email: false,
        nom: false,
        prenom: false,
      };
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

  const advanceStep = (
    fieldset: HTMLFieldSetElement | null,
    nextStep: number,
  ) => {
    if (fieldset?.reportValidity()) {
      setCurrentStep(nextStep);
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
        <form className="reservation-form" autoComplete="off" onSubmit={handleSubmit}>
          <h2>Formulaire de réservation</h2>
          <p className="form-description">
            Complétez les étapes pour préparer votre demande de réservation.
          </p>

          <ol className="form-progress" aria-label="Étapes du formulaire">
            {["Vos coordonnées", "Date de visite", "Détails de la visite"].map(
              (label, index) => {
                const step = index + 1;
                return (
                  <li
                    key={label}
                    className={currentStep === step ? "is-current" : ""}
                    aria-current={currentStep === step ? "step" : undefined}
                  >
                    <span className="form-progress-number">{step}</span>
                    <span>{label}</span>
                  </li>
                );
              },
            )}
          </ol>

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

          <fieldset
            ref={contactStepRef}
            className="form-step"
            hidden={currentStep !== 1}
            disabled={isSubmitting}
          >
            <legend>Vos coordonnées</legend>
            <div className="form-row">
              <label className="field">
                <span className="field-label">Téléphone</span>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Votre numéro de téléphone"
                  autoComplete="tel"
                  maxLength={50}
                  required
                  value={phoneLookup}
                  onInput={(event) => {
                    const value = event.currentTarget.value.trim();
                    setPhoneLookup(value);
                  }}
                />
              </label>
              <label className="field">
                <span className="field-label">Adresse e-mail</span>
                <input
                  type="email"
                  name="email"
                  placeholder="nom@exemple.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={emailValue}
                  onInput={(event) => {
                    const input = event.currentTarget;
                    editedVisitorFieldsRef.current.email = true;
                    setEmailValue(input.value);
                  }}
                />
              </label>
              
            </div>
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
                  value={nomValue}
                  onInput={(event) => {
                    editedVisitorFieldsRef.current.nom = true;
                    setNomValue(event.currentTarget.value);
                  }}
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
                  value={prenomValue}
                  onInput={(event) => {
                    editedVisitorFieldsRef.current.prenom = true;
                    setPrenomValue(event.currentTarget.value);
                  }}
                />
              </label>
            </div>

            <button
              type="button"
              className="submit-btn"
              onClick={() => advanceStep(contactStepRef.current, 2)}
              disabled={isSubmitting}
            >
              Continuer
            </button>
          </fieldset>

          <fieldset
            ref={dateStepRef}
            className="form-step"
            hidden={currentStep !== 2}
            disabled={isSubmitting}
          >
            <legend>Date de visite</legend>
            <label className="field">
              <span className="field-label">Choisissez une date</span>
              <input
                type="date"
                name="date_visite"
                min={getTodayDate()}
                required
                onChange={(event) => {
                  setOptions(null);
                  setOptionsError(null);
                  setReservationDate(event.currentTarget.value);
                }}
              />
            </label>

            <div className="form-step-actions">
              <button
                type="button"
                className="form-secondary-btn"
                onClick={() => setCurrentStep(1)}
                disabled={isSubmitting}
              >
                Précédent
              </button>
              <button
                type="button"
                className="submit-btn"
                onClick={() => advanceStep(dateStepRef.current, 3)}
                disabled={isSubmitting}
              >
                Continuer
              </button>
            </div>
          </fieldset>

          <fieldset
            className="form-step"
            hidden={currentStep !== 3}
            disabled={isSubmitting}
          >
            <legend>Détails de la visite</legend>
            {options && optionsUnavailable && (
              <p className="form-feedback" role="status">
                Certains éléments de visite ne sont pas disponibles pour cette
                date. Veuillez réessayer ultérieurement ou choisir une autre
                date.
              </p>
            )}
            <div className="form-row">
              <label className="field">
                <span className="field-label">Parcours ou type de visite</span>
                <select
                  name="id_parcours"
                  required
                  defaultValue=""
                  disabled={optionsUnavailable}
                >
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
                <select
                  name="id_creneau"
                  required
                  defaultValue=""
                  disabled={optionsUnavailable}
                >
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
                <select
                  name="id_guide"
                  required
                  defaultValue=""
                  disabled={optionsUnavailable}
                >
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

            <div className="form-step-actions">
              <button
                type="button"
                className="form-secondary-btn"
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
              >
                Précédent
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting || optionsUnavailable}
              >
                {submitLabel}
              </button>
            </div>
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

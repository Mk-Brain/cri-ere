import type {
  FormOptions,
  ReservationFormData,
  ReservationResult,
  VisitorMessage,
} from "../types/DomainTypes";

const configuredApiUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");
const API_PREFIX = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL
  : `${API_BASE_URL}/api`;

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const errorData: unknown = await response.json().catch(() => null);
  if (
    typeof errorData === "object" &&
    errorData !== null &&
    "detail" in errorData &&
    typeof errorData.detail === "string"
  ) {
    return errorData.detail;
  }
  if (
    typeof errorData === "object" &&
    errorData !== null &&
    "message" in errorData &&
    typeof errorData.message === "string"
  ) {
    return errorData.message;
  }
  return fallback;
}

// 1. Récupérer les options publiques (créneaux, parcours, guides disponibles)
export const getPublicOptions = async (date:string): Promise<FormOptions> => {
  const params = new URLSearchParams({ reservationDate: date });
  const response = await fetch(
    `${API_PREFIX}/reservation/options?${params.toString()}`,
  );
  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Impossible de charger les options de visite.",
      ),
    );
  }

  const data = (await response.json()) as Partial<FormOptions> | null;
  if (
    !data ||
    !Array.isArray(data.parcours) ||
    !Array.isArray(data.creneaux) ||
    !Array.isArray(data.guides)
  ) {
    throw new Error("La réponse du serveur contient des options invalides.");
  }
  return {
    parcours: data.parcours,
    creneaux: data.creneaux,
    guides: data.guides,
  };
};

// 2. Soumettre une réservation de visite
export const createVisitReservation = async (
  visitData: ReservationFormData,
): Promise<ReservationResult> => {
  const response = await fetch(`${API_PREFIX}/reservation/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(visitData),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Erreur lors de la création de la réservation.",
      ),
    );
  }
  return (await response.json()) as ReservationResult;
};

// 3. Envoyer un message de contact
export const sendContactMessage = async (messageData: VisitorMessage) => {
  const response = await fetch(`${API_PREFIX}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(messageData),
  });
  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Échec de l'envoi du message."));
  }
  return await response.json();
};

// 4. S'inscrire à la newsletter
export const subscribeNewsletter = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) throw new Error("Échec de l'inscription à la newsletter");
  return await response.json();
};

//TODO : Ajouter un espace client pour que les visiteurs puissent consulter leurs réservations et messages, et éventuellement annuler ou modifier leurs réservations.

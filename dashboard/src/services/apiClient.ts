import { getAuth } from "firebase/auth";
import { app } from "./firebaseAuth";

export class APIClient {
    static API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "/api"
).replace(/\/+$/, "");

static async request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const user = getAuth(app).currentUser;
  if (!user) {
    throw new Error("Connecte-toi pour accéder aux messages.");
  }

  const token = await user.getIdToken();
  const response = await fetch(`${APIClient.API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText;
    try {
      const payload: { detail?: string } = JSON.parse(responseText);
      message = payload.detail ?? responseText;
    } catch {
      // Keep the response body as the error message when it is not JSON.
    }
    throw new Error(
      message || `Erreur API (${response.status} ${response.statusText})`,
    );
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}
}
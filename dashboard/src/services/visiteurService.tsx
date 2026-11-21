import type { CollectionQuery, CollectionPage } from "../types/CollectionTypes";
import type { Visiteur } from "../types/DomainTypes";
import { APIClient } from "./apiClient";


export async function getMany(
  query: CollectionQuery,
): Promise<CollectionPage<Visiteur>> {
  const params = new URLSearchParams({
    page: String(query.paginationModel.page),
    pageSize: String(query.paginationModel.pageSize),
    sort: JSON.stringify(query.sortModel),
    filter: JSON.stringify(query.filterModel),
  });

  return APIClient.request<CollectionPage<Visiteur>>(`/visiteurs/?${params.toString()}`);
}

export async function getAll(): Promise<Visiteur[]> {
  const params = new URLSearchParams({ page: "0", pageSize: "1000" });
  const result = await APIClient.request<CollectionPage<Visiteur>>(
    `/visiteurs/?${params.toString()}`,
  );
  return result.items;
}

export function getOne(id: number): Promise<Visiteur> {
  return APIClient.request<Visiteur>(`/visiteurs/${id}`);
}

export interface VisitorLookupResult {
  nom: string;
  prenom: string | null;
  email: string;
}

export async function checkByPhone(
  phone: string,
): Promise<VisitorLookupResult | null> {
  const normalizedPhone = phone.trim();
  if (!normalizedPhone) return null;

  const params = new URLSearchParams({ phone: normalizedPhone });
  try {
    return await APIClient.request<VisitorLookupResult>(
      `/visiteurs/check?${params.toString()}`,
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("introuvable")
    ) {
      return null;
    }
    throw error;
  }
}

export function createOne(data: Omit<Visiteur, "id_visiteur">): Promise<Visiteur> {
  return APIClient.request<Visiteur>("/visiteurs/new", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOne(
  id: number,
  data: Partial<Omit<Visiteur, "id_visiteur">>,
): Promise<Visiteur> {
  return APIClient.request<Visiteur>(`/visiteurs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOne(id: number): Promise<void> {
  await APIClient.request<void>(`/visiteurs/${id}`, { method: "DELETE" });
}


export function sendVisitEmail(
  visitorId: number,
  sujet: string,
  contenu: string,
): Promise<{ message: string }> {
  return APIClient.request<{ message: string }>(`/visiteurs/${visitorId}/email`, {
    method: "POST",
    body: JSON.stringify({ sujet, contenu }),
  });
}

import type { CollectionQuery, CollectionPage } from "../types/CollectionTypes";
import type { StatutVisite, Visite } from "../types/DomainTypes";
import { APIClient } from "./apiClient";

export interface VisitCreationData {
  visiteur: {
    nom: string;
    prenom?: string;
    email: string;
    telephone: string;
  };
  visite: {
    date_visite: string;
    nombre_personnes: number;
    id_parcours: number;
    id_creneau: number;
    id_guide: number;
  };
}

export interface VisitAvailabilityOptions {
  parcours: Array<{ id_parcours: number; nom: string; description?: string }>;
  creneaux: Array<{
    id_creneau: number;
    heure_debut: string;
    heure_fin: string;
  }>;
  guides: Array<{
    id_guide: number;
    nom: string;
    prenom?: string;
  }>;
}

export function getAvailabilityOptions(
  date: string,
): Promise<VisitAvailabilityOptions> {
  const params = new URLSearchParams({ reservationDate: date });
  return APIClient.request<VisitAvailabilityOptions>(
    `/reservation/options?${params.toString()}`,
  );
}

export async function getMany(
  query: CollectionQuery,
): Promise<CollectionPage<Visite>> {
  const params = new URLSearchParams({
    page: String(query.paginationModel.page),
    pageSize: String(query.paginationModel.pageSize),
    sort: JSON.stringify(query.sortModel),
    filter: JSON.stringify(query.filterModel),
  });

  return APIClient.request<CollectionPage<Visite>>(
    `/visites/?${params.toString()}`,
  );
}

export async function getAll(): Promise<Visite[]> {
  const params = new URLSearchParams({ page: "0", pageSize: "1000" });
  const result = await APIClient.request<CollectionPage<Visite>>(
    `/visites/?${params.toString()}`,
  );
  return result.items;
}

export function getOne(id: number): Promise<Visite> {
  return APIClient.request<Visite>(`/visites/${id}`);
}

export function createOne(data: VisitCreationData): Promise<Visite> {
  return APIClient.request<Visite>("/visites/new", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOne(
  id: number,
  data: Partial<Omit<Visite, "id_visite">>,
): Promise<Visite> {
  return APIClient.request<Visite>(`/visites/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function updateStatus(
  id: number,
  status: StatutVisite,
): Promise<Visite> {
  return APIClient.request<Visite>(`/visites/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}



export async function deleteOne(id: number): Promise<void> {
  await APIClient.request<void>(`/visites/delete/${id}`, { method: "DELETE" });
}

// TODO: revoir l'ajout et la mise à jour des visite dans le dashbord (les end point)
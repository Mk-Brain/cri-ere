import type { CollectionQuery, CollectionPage } from "../types/CollectionTypes";
import type { CreneauHoraire } from "../types/DomainTypes";
import { APIClient } from "./apiClient";




export async function getMany(
  query: CollectionQuery,
): Promise<CollectionPage<CreneauHoraire>> {
  const params = new URLSearchParams({
    page: String(query.paginationModel.page),
    pageSize: String(query.paginationModel.pageSize),
    sort: JSON.stringify(query.sortModel),
    filter: JSON.stringify(query.filterModel),
  });

  return APIClient.request<CollectionPage<CreneauHoraire>>(
    `/creneaux/?${params.toString()}`,
  );
}

export async function getAll(): Promise<CreneauHoraire[]> {
  const params = new URLSearchParams({ page: "0", pageSize: "1000" });
  const result = await APIClient.request<CollectionPage<CreneauHoraire>>(
    `/creneaux/?${params.toString()}`,
  );
  return result.items;
}

export function getOne(id: number): Promise<CreneauHoraire> {
  return APIClient.request<CreneauHoraire>(`/creneaux/${id}`);
}

export function createOne(
  data: Omit<CreneauHoraire, "id_creneau">,
): Promise<CreneauHoraire> {
  console.log(data);
  
  return APIClient.request<CreneauHoraire>("/creneaux/new", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOne(
  id: number,
  data: Partial<Omit<CreneauHoraire, "id_creneau">>,
): Promise<CreneauHoraire> {
  return APIClient.request<CreneauHoraire>(`/creneaux/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOne(id: number): Promise<void> {
  await APIClient.request<void>(`/creneaux/delete/${id}`, { method: "DELETE" });
}
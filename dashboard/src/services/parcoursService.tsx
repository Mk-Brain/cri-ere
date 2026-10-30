import type { CollectionQuery, CollectionPage } from "../types/CollectionTypes";
import type { Parcours } from "../types/DomainTypes";
import { APIClient } from "./apiClient";




export async function getMany(
  query: CollectionQuery,
): Promise<CollectionPage<Parcours>> {
  const params = new URLSearchParams({
    page: String(query.paginationModel.page),
    pageSize: String(query.paginationModel.pageSize),
    sort: JSON.stringify(query.sortModel),
    filter: JSON.stringify(query.filterModel),
  });

  return APIClient.request<CollectionPage<Parcours>>(`/parcours/?${params.toString()}`);
}

export async function getAll(): Promise<Parcours[]> {
  const params = new URLSearchParams({ page: "0", pageSize: "1000" });
  const result = await APIClient.request<CollectionPage<Parcours>>(
    `/parcours/?${params.toString()}`,
  );
  return result.items;
}

export function getOne(id: number): Promise<Parcours> {
  return APIClient.request<Parcours>(`/parcours/${id}`);
}

export function createOne(data: Omit<Parcours, "id_parcours">): Promise<Parcours> {
  return APIClient.request<Parcours>("/parcours/new", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOne(
  id: number,
  data: Partial<Omit<Parcours, "id_parcours">>,
): Promise<Parcours> {
  return APIClient.request<Parcours>(`/parcours/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOne(id: number): Promise<void> {
  await APIClient.request<void>(`/parcours/delete/${id}`, { method: "DELETE" });
}
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
  return APIClient.request<Visiteur>(`/visiteurs/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOne(id: number): Promise<void> {
  await APIClient.request<void>(`/visiteurs/delete/${id}`, { method: "DELETE" });
}
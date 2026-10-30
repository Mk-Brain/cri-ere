import type { CollectionQuery, CollectionPage } from "../types/CollectionTypes";
import type { Visite } from "../types/DomainTypes";
import { APIClient } from "./apiClient";

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

export function createOne(data: Omit<Visite, "id_visite">): Promise<Visite> {
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

export async function deleteOne(id: number): Promise<void> {
  await APIClient.request<void>(`/visites/delete/${id}`, { method: "DELETE" });
}

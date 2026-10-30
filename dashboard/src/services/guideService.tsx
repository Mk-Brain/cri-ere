import type { CollectionQuery, CollectionPage } from "../types/CollectionTypes";
import type { Guide } from "../types/DomainTypes";
import { APIClient } from "./apiClient";


export async function getMany(
  query: CollectionQuery,
): Promise<CollectionPage<Guide>> {
  const params = new URLSearchParams({
    page: String(query.paginationModel.page),
    pageSize: String(query.paginationModel.pageSize),
    sort: JSON.stringify(query.sortModel),
    filter: JSON.stringify(query.filterModel),
  });

  return APIClient.request<CollectionPage<Guide>>(`/guides/?${params.toString()}`);
}

export async function getAll(): Promise<Guide[]> {
  const params = new URLSearchParams({ page: "0", pageSize: "1000" });
  const result = await APIClient.request<CollectionPage<Guide>>(
    `/guides/?${params.toString()}`,
  );
  return result.items;
}

export function getOne(id: number): Promise<Guide> {
  return APIClient.request<Guide>(`/guides/${id}`);
}

export function createOne(data: Omit<Guide, "id_guide">): Promise<Guide> {
  return APIClient.request<Guide>("/guides/new", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOne(
  id: number,
  data: Partial<Omit<Guide, "id_guide">>,
): Promise<Guide> {
  return APIClient.request<Guide>(`/guides/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOne(id: number): Promise<void> {
  await APIClient.request<void>(`/guides/delete/${id}`, { method: "DELETE" });
}
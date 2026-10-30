import type { CollectionQuery, CollectionPage } from "../types/CollectionTypes";
import type { VisitorMessage } from "../types/DomainTypes";
import { APIClient } from "./apiClient";




export async function getMany(
  query: CollectionQuery,
): Promise<CollectionPage<VisitorMessage>> {
  const params = new URLSearchParams({
    page: String(query.paginationModel.page),
    pageSize: String(query.paginationModel.pageSize),
    sort: JSON.stringify(query.sortModel),
    filter: JSON.stringify(query.filterModel),
  });

  return APIClient.request<CollectionPage<VisitorMessage>>(
    `/messages/?${params.toString()}`,
  );
}

export async function getAll(): Promise<VisitorMessage[]> {
  const params = new URLSearchParams({ page: "0", pageSize: "1000" });
  const result = await APIClient.request<CollectionPage<VisitorMessage>>(
    `/messages/?${params.toString()}`,
  );
  return result.items;
}

export function getOne(id: number): Promise<VisitorMessage> {
  return APIClient.request<VisitorMessage>(`/messages/${id}`);
}

export function createOne(
  data: Omit<VisitorMessage, "id_message">,
): Promise<VisitorMessage> {
  return APIClient.request<VisitorMessage>("/messages/new", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOne(
  id: number,
  data: Partial<Omit<VisitorMessage, "id_message">>,
): Promise<VisitorMessage> {
  return APIClient.request<VisitorMessage>(`/messages/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteOne(id: number): Promise<void> {
  await APIClient.request<void>(`/messages/delete/${id}`, { method: "DELETE" });
}
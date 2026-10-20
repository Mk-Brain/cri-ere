import type { Visite } from "../types/DomainTypes";
import { StatutVisite } from "../types/DomainTypes";



  const visits = [
    {
      id_visite: 1,
      date_visite: "2023-06-01",
      statut: StatutVisite.EFFECTUEE,
      nombre_personnes: 5,
      id_visiteur: 1,
      id_parcours: 1,
      id_creneau: 1,
      id_guide: 1,
    },
    {
      id_visite: 2,
      date_visite: "2023-06-02",
      statut: StatutVisite.EFFECTUEE,
      nombre_personnes: 3,
      id_visiteur: 2,
      id_parcours: 2,
      id_creneau: 1,
      id_guide: 1,
    },
    {
      id_visite: 3,
      date_visite: "2023-06-01",
      statut: StatutVisite.NON_EFFECTUEE,
      nombre_personnes: 5,
      id_visiteur: 1,
      id_parcours: 1,
      id_creneau: 1,
      id_guide: 1,
    },
  ]


import type { CollectionQuery, CollectionPage } from "../types/CollectionTypes";

// URL de base de ton API FastAPI
const API_BASE_URL = "http://localhost:8000/api";

/**
 * 1. READ (GET MANY) - Récupération paginée, triée et filtrée
 */
export const getMany = async (
  query: CollectionQuery
): Promise<CollectionPage<Visite>> => {
  const { paginationModel, sortModel, filterModel } = query;

  // Construction des paramètres de requête HTTP
  const params = new URLSearchParams({
    page: String(paginationModel.page),
    pageSize: String(paginationModel.pageSize),
  });

  if (sortModel.length > 0) {
    params.set("sort", JSON.stringify(sortModel));
  }

  if (filterModel.items.length > 0 || filterModel.quickFilterValues?.length) {
    params.set("filter", JSON.stringify(filterModel));
  }

  const response = await fetch(`${API_BASE_URL}/visites?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des visites (${response.status})`);
  }

  // FastAPI doit renvoyer un objet { items: Visite[], itemCount: number }
  return await response.json();
};

/**
 * 2. READ (GET ONE) - Récupération d'une seule visite par son ID
 */
export const getOne = async (id: number): Promise<Visite> => {
  const response = await fetch(`${API_BASE_URL}/visites/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Visite introuvable avec l'ID ${id}`);
  }

  return await response.json();
};

/**
 * 3. CREATE (POST) - Création d'une nouvelle visite
 */
export const createOne = async (data: Omit<Visite, "id_visite">): Promise<Visite> => {
  const response = await fetch(`${API_BASE_URL}/visites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la visite");
  }

  return await response.json();
};

/**
 * 4. UPDATE (PUT/PATCH) - Modification d'une visite existante
 */
export const updateOne = async (
  id: number,
  data: Partial<Omit<Visite, "id_visite">>
): Promise<Visite> => {
  const response = await fetch(`${API_BASE_URL}/visites/${id}`, {
    method: "PUT", // ou "PATCH" selon le routeur FastAPI
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la mise à jour de la visite ${id}`);
  }

  return await response.json();
};

/**
 * 5. DELETE (DELETE) - Suppression d'une visite
 */
export const deleteOne = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/visites/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la suppression de la visite ${id}`);
  }
};

import type { Parcours } from "../types/DomainTypes";
import { createLocalCollection } from "./localCollection";

const collection = createLocalCollection<Parcours, "id_parcours">(
  [
    {
      id_parcours: 1,
      nom: "Parcours de démonstration",
      description: "Données locales temporaires, en attente de l’API.",
    },
  ],
  "id_parcours",
);

export const getMany = collection.getMany;
export const getAll = collection.getAll;
export const getOne = collection.getOne;
export const createOne = collection.createOne;
export const updateOne = collection.updateOne;
export const deleteOne = collection.deleteOne;

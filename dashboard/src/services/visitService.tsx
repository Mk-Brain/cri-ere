import type { Visite } from "../types/DomainTypes";
import { StatutVisite } from "../types/DomainTypes";
import { createLocalCollection } from "./localCollection";

const collection = createLocalCollection<Visite, "id_visite">(
  [
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
  ],
  "id_visite",
);

export const getVisiteStore = collection.getAll;
export const setVisiteStore = collection.setAll;
export const getMany = collection.getMany;
export const getOne = collection.getOne;
export const createOne = collection.createOne;
export const updateOne = collection.updateOne;
export const deleteOne = collection.deleteOne;

import type { CreneauHoraire } from "../types/DomainTypes";
import { createLocalCollection } from "./localCollection";

const collection = createLocalCollection<CreneauHoraire, "id_creneau">(
  [
    {
      id_creneau: 1,
      heure_debut: "09:00:00",
      heure_fin: "10:00:00",
    },
  ],
  "id_creneau",
);

export const getMany = collection.getMany;
export const getAll = collection.getAll;
export const getOne = collection.getOne;
export const createOne = collection.createOne;
export const updateOne = collection.updateOne;
export const deleteOne = collection.deleteOne;

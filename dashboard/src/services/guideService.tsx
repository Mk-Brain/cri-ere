import type { Guide } from "../types/DomainTypes";
import { createLocalCollection } from "./localCollection";

const collection = createLocalCollection<Guide, "id_guide">(
  [
    {
      id_guide: 1,
      nom: "Guide de démonstration",
      prenom: "Camille",
      telephone: "0000000000",
    },
  ],
  "id_guide",
);

export const getMany = collection.getMany;
export const getAll = collection.getAll;
export const getOne = collection.getOne;
export const createOne = collection.createOne;
export const updateOne = collection.updateOne;
export const deleteOne = collection.deleteOne;

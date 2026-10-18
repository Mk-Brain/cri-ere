import { type Visiteur } from "../types/DomainTypes";
import { createLocalCollection } from "./localCollection";

const collection = createLocalCollection<Visiteur, "id_visiteur">(
  [
    {
      id_visiteur: 1,
      nom: "morand",
      prenom: "morand",
      email: "5morand@exemple.com",
      telephone: "145 542 145",
    },
  ],
  "id_visiteur",
);

export const getVisiteStore = collection.getAll;
export const setVisiteStore = collection.setAll;
export const getMany = collection.getMany;
export const getAll = collection.getAll;
export const getOne = collection.getOne;
export const createOne = collection.createOne;
export const updateOne = collection.updateOne;
export const deleteOne = collection.deleteOne;

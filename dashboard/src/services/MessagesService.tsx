import { StatutMessage, type VisitorMessage } from "../types/DomainTypes";
import { createLocalCollection } from "./localCollection";

const collection = createLocalCollection<VisitorMessage, "id_message">(
  [
    {
      id_message: 1,
      contenu: "Parcours de démonstration",
      date_envoi: "Données locales temporaires, en attente de l’API.",
      statut: StatutMessage.NON_LU,
      id_visiteur: 2
    },
  ],
  "id_message",
);

export const getMany = collection.getMany;
export const getOne = collection.getOne;
export const createOne = collection.createOne;
export const updateOne = collection.updateOne;
export const deleteOne = collection.deleteOne;

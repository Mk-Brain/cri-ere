export const StatutVisite = {
  EN_ATTENTE: "EN_ATTENTE",
  EFFECTUEE: "EFFECTUEE",
  NON_EFFECTUEE: "NON_EFFECTUEE",
} as const;

export type StatutVisite = (typeof StatutVisite)[keyof typeof StatutVisite];

export const StatutMessage = {
  NON_LU: "NON_LU",
  LU: "LU",
  REPONDU: "REPONDU",
} as const;

export type StatutMessage = (typeof StatutMessage)[keyof typeof StatutMessage];

export interface Visite {
  date_visite: string;
  nombre_personnes: number;
  id_parcours: number;
  id_creneau: number;
  id_guide: number;

}

export interface Visiteur {
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;

}

export interface Guide {
  id_guide: number;
  nom: string;
  prenom?: string;
  telephone: string;
}

export interface Parcours {
  id_parcours: number;
  nom: string;
  description?: string;
}

export interface CreneauHoraire {
  id_creneau: number;
  heure_debut: string;
  heure_fin: string;
}

export interface VisitorMessage {
  nom: string;
  email: string;
  contenu: string;
}



export interface FormOptions {
  parcours: Parcours[];
  creneaux: CreneauHoraire[];
  guides: Guide[];
}

export interface ReservationFormData {
  visiteur: Visiteur;
  visite: Visite;
}

export interface ReservationResult {
  id_visite: number;
  date_visite: string;
  statut: StatutVisite;
  nombre_personnes: number;
  id_visiteur: number;
  id_parcours: number;
  id_creneau: number;
  id_guide: number;
  visiteur: Visiteur & { id_visiteur: number };
}
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
  id_visite: number;
  date_visite: string;
  statut: StatutVisite;
  nombre_personnes: number;
  id_visiteur: number;
  id_parcours: number;
  id_creneau: number;
  id_guide: number;
  visiteur?: Visiteur;
  parcours?: Parcours;
  creneau?: CreneauHoraire;
  guide?: Guide;
}

export interface Visiteur {
  id_visiteur?: number;
  nom: string;
  prenom?: string;
  email: string;
  telephone: string;
  visites?: Visite[];
  messages?: VisitorMessage[];
}

export interface Guide {
  id_guide: number;
  nom: string;
  prenom?: string;
  telephone: string;
  visites?: Visite[];
}

export interface Parcours {
  id_parcours: number;
  nom: string;
  description?: string;
  visites?: Visite[];
}

export interface CreneauHoraire {
  id_creneau: number;
  heure_debut: string;
  heure_fin: string;
  visites?: Visite[];
}

export interface VisitorMessage {
  id_message?: number;
  contenu: string;
  date_envoi: string | Date;
  statut: StatutMessage;
  id_visiteur: number;
  visiteur?: Visiteur;
  reponse?: Reponse;
}

export interface Reponse {
  id_reponse?: number;
  contenu: string;
  date_envoi: string | Date;
  id_message: number;
  id_administrateur: number;
  message?: VisitorMessage;
  administrateur?: Administrateur;
}

export interface Administrateur {
  id_administrateur?: number;
  nom: string;
  prenom?: string;
  email: string;
  password: string;
  reponses?: Reponse[];
}

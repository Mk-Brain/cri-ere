import type { Dayjs } from "dayjs";

export interface VisitFormValues {
  date_visite: Dayjs | null;
  nombre_personnes: number | "";
  id_parcours: number | "";
  id_creneau: number | "";
  id_guide: number | "";
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

export interface VisitFormState {
  values: Partial<VisitFormValues>;
  errors: Partial<Record<keyof VisitFormValues, string>>;
}

export type FormFieldValue = string | number | boolean | Dayjs | null;

export interface OptionItem {
  id: number;
  label: string;
}

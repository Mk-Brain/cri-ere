import * as React from "react";
import { useParams } from "react-router";
import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../EntityForm";
import { getOne, updateOne } from "../../services/visiteurService";

const fields: EntityFormField[] = [
  { name: "nom", label: "Nom", required: true },
  { name: "prenom", label: "Prénom", required: true },
  { name: "email", label: "Email", required: true },
  { name: "telephone", label: "Téléphone", required: true },
];

export default function EditVisiteurPage() {
  const { id } = useParams();
  const visiteurId = Number(id);

  const loadInitialValues = React.useCallback(async () => {
    if (!Number.isInteger(visiteurId) || visiteurId <= 0) {
      throw new Error("Identifiant de visiteur invalide.");
    }
    const visiteur = await getOne(visiteurId);
    return {
      nom: visiteur.nom,
      prenom: visiteur.prenom ?? "",
      email: visiteur.email,
      telephone: visiteur.telephone,
    };
  }, [visiteurId]);

  const handleSubmit = async (values: EntityFormValues) => {
    await updateOne(visiteurId, {
      nom: values.nom.trim(),
      prenom: values.prenom.trim() || undefined,
      email: values.email.trim(),
      telephone: values.telephone.trim(),
    });
  };

  return (
    <EntityForm
      title="Modifier un visiteur"
      parentTitle="Visiteurs"
      backPath="/visiteurs"
      fields={fields}
      initialValues={{ nom: "", prenom: "", email: "", telephone: "" }}
      submitLabel="Enregistrer les modifications"
      loadInitialValues={loadInitialValues}
      onSubmit={handleSubmit}
    />
  );
}

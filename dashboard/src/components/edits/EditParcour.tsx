import * as React from "react";
import { useParams } from "react-router";
import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../EntityForm";
import { getOne, updateOne } from "../../services/parcoursService";

const fields: EntityFormField[] = [
  { name: "nom", label: "Nom", required: true },
  { name: "description", label: "Description", multiline: true, minRows: 3 },
];

export default function EditParcoursPage() {
  const { id } = useParams();
  const parcoursId = Number(id);

  const loadInitialValues = React.useCallback(async () => {
    if (!Number.isInteger(parcoursId) || parcoursId <= 0) {
      throw new Error("Identifiant de parcours invalide.");
    }
    const parcours = await getOne(parcoursId);
    return {
      nom: parcours.nom,
      description: parcours.description ?? "",
    };
  }, [parcoursId]);

  const handleSubmit = async (values: EntityFormValues) => {
    await updateOne(parcoursId, {
      nom: values.nom.trim(),
      description: values.description.trim() || undefined,
    });
  };

  return (
    <EntityForm
      title="Modifier un parcours"
      parentTitle="Parcours"
      backPath="/parcours"
      fields={fields}
      initialValues={{ nom: "", description: "" }}
      submitLabel="Enregistrer les modifications"
      loadInitialValues={loadInitialValues}
      onSubmit={handleSubmit}
    />
  );
}

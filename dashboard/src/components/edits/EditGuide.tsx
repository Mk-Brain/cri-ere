import * as React from "react";
import { useParams } from "react-router";
import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../EntityForm";
import { getOne, updateOne } from "../../services/guideService";

const fields: EntityFormField[] = [
  { name: "nom", label: "Nom", required: true },
  { name: "prenom", label: "Prénom" },
  { name: "telephone", label: "Téléphone", type: "tel", required: true },
];

export default function EditGuidePage() {
  const { id } = useParams();
  const guideId = Number(id);

  const loadInitialValues = React.useCallback(async () => {
    if (!Number.isInteger(guideId) || guideId <= 0) {
      throw new Error("Identifiant de guide invalide.");
    }
    const guide = await getOne(guideId);
    return {
      nom: guide.nom,
      prenom: guide.prenom ?? "",
      telephone: guide.telephone,
    };
  }, [guideId]);

  const handleSubmit = async (values: EntityFormValues) => {
    await updateOne(guideId, {
      nom: values.nom.trim(),
      prenom: values.prenom.trim() || undefined,
      telephone: values.telephone.trim(),
    });
  };

  return (
    <EntityForm
      title="Modifier un guide"
      parentTitle="Guides"
      backPath="/guides"
      fields={fields}
      initialValues={{ nom: "", prenom: "", telephone: "" }}
      submitLabel="Enregistrer les modifications"
      loadInitialValues={loadInitialValues}
      onSubmit={handleSubmit}
    />
  );
}

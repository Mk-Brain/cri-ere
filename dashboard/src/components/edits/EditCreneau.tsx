import * as React from "react";
import { useParams } from "react-router";
import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../EntityForm";
import { getOne, updateOne } from "../../services/creneauService";

const fields: EntityFormField[] = [
  {
    name: "heure_debut",
    label: "Heure de début",
    type: "time",
    required: true,
  },
  { name: "heure_fin", label: "Heure de fin", type: "time", required: true },
];

export default function EditCreneauPage() {
  const { id } = useParams();
  const creneauId = Number(id);

  const loadInitialValues = React.useCallback(async () => {
    if (!Number.isInteger(creneauId) || creneauId <= 0) {
      throw new Error("Identifiant de créneau invalide.");
    }
    const creneau = await getOne(creneauId);
    return {
      heure_debut: creneau.heure_debut.slice(0, 5),
      heure_fin: creneau.heure_fin.slice(0, 5),
    };
  }, [creneauId]);

  const handleSubmit = async (values: EntityFormValues) => {
    await updateOne(creneauId, {
      heure_debut: `${values.heure_debut}:00`,
      heure_fin: `${values.heure_fin}:00`,
    });
  };

  return (
    <EntityForm
      title="Modifier un créneau"
      parentTitle="Créneaux"
      backPath="/crenaux"
      fields={fields}
      initialValues={{ heure_debut: "", heure_fin: "" }}
      submitLabel="Enregistrer les modifications"
      loadInitialValues={loadInitialValues}
      onSubmit={handleSubmit}
    />
  );
}

import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../EntityForm";
import { createOne } from "../../services/parcoursService";

const fields: EntityFormField[] = [
  { name: "nom", label: "Nom", required: true },
  { name: "description", label: "Description", multiline: true, minRows: 3 },
];

export default function NewParcoursPage() {
  const handleSubmit = async (values: EntityFormValues) => {
    await createOne({
      nom: values.nom.trim(),
      description: values.description.trim() || undefined,
    });
  };

  return (
    <EntityForm
      title="Créer un parcours"
      parentTitle="Parcours"
      backPath="/parcours"
      fields={fields}
      initialValues={{ nom: "", description: "" }}
      onSubmit={handleSubmit}
    />
  );
}

import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../../components/EntityForm";
import { createOne } from "../../services/parcoursService";

const fields: EntityFormField[] = [
  { name: "nom", label: "Nom", required: true },
  { name: "prenom", label: "Prénom", required: true },
  { name: "email", label: "Email", required: true },
  { name: "telephone", label: "Téléphone", required: true },
];

export default function NewVisiteurPage() {
  const handleSubmit = async (values: EntityFormValues) => {
    await createOne({
      nom: values.nom.trim(),
      description: values.description.trim() || undefined,
    });
  };

  return (
    <EntityForm
      title="Créer un visiteur"
      parentTitle="Visiteurs"
      backPath="/visiteurs"
      fields={fields}
      initialValues={{ nom: "", prenom: "", email: "", telephone: "" }}
      onSubmit={handleSubmit}
    />
  );
}

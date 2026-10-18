import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../EntityForm";
import { createOne } from "../../services/visiteurService";

const fields: EntityFormField[] = [
  { name: "nom", label: "Nom", required: true },
  { name: "prenom", label: "Prénom", required: true },
  { name: "email", label: "Email", required: true },
  { name: "telephone", label: "Téléphone", type: "tel", required: true },
];

export default function NewVisiteurPage() {
  const handleSubmit = async (values: EntityFormValues) => {
    await createOne({
      nom: values.nom.trim(),
      prenom: values.prenom.trim() || undefined,
      email: values.email.trim(),
      telephone: values.telephone.trim(),
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

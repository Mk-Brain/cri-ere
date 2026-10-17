import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../../components/EntityForm";
import { createOne } from "../../services/guideService";

const fields: EntityFormField[] = [
  { name: "nom", label: "Nom", required: true },
  { name: "prenom", label: "Prénom" },
  { name: "telephone", label: "Téléphone", type: "tel", required: true },
];

export default function NewGuidePage() {
  const handleSubmit = async (values: EntityFormValues) => {
    await createOne({
      nom: values.nom.trim(),
      prenom: values.prenom.trim() || undefined,
      telephone: values.telephone.trim(),
    });
  };

  return (
    <EntityForm
      title="Créer un guide"
      parentTitle="Guides"
      backPath="/guides"
      fields={fields}
      initialValues={{ nom: "", prenom: "", telephone: "" }}
      onSubmit={handleSubmit}
    />
  );
}

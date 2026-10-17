import EntityForm, {
  type EntityFormField,
  type EntityFormValues,
} from "../../components/EntityForm";
import { createOne } from "../../services/creneauService";

const fields: EntityFormField[] = [
  {
    name: "heure_debut",
    label: "Heure de début",
    type: "time",
    required: true,
  },
  { name: "heure_fin", label: "Heure de fin", type: "time", required: true },
];

export default function NewCreneauPage() {
  const handleSubmit = async (values: EntityFormValues) => {
    await createOne({
      heure_debut: `${values.heure_debut}:00`,
      heure_fin: `${values.heure_fin}:00`,
    });
  };

  return (
    <EntityForm
      title="Créer un créneau"
      parentTitle="Créneaux"
      backPath="/crenaux"
      fields={fields}
      initialValues={{ heure_debut: "", heure_fin: "" }}
      onSubmit={handleSubmit}
    />
  );
}

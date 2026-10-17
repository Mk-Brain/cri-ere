import * as React from "react";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router";
import FormPage from "./FormPage";

export type EntityFormValues = Record<string, string>;

export interface EntityFormField {
  name: string;
  label: string;
  type?: "text" | "tel" | "time";
  required?: boolean;
  multiline?: boolean;
  minRows?: number;
}

interface EntityFormProps {
  title: string;
  parentTitle: string;
  backPath: string;
  fields: EntityFormField[];
  initialValues: EntityFormValues;
  onSubmit: (values: EntityFormValues) => Promise<void>;
}

export default function EntityForm({
  title,
  parentTitle,
  backPath,
  fields,
  initialValues,
  onSubmit,
}: EntityFormProps) {
  const navigate = useNavigate();
  const [values, setValues] = React.useState(initialValues);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      navigate(backPath);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : String(submitError),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormPage
      title={title}
      parentTitle={parentTitle}
      backPath={backPath}
      submitLabel="Enregistrer"
      onSubmit={handleSubmit}
      error={error}
      isSubmitting={isSubmitting}
    >
      {fields.map((field) => (
        <TextField
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type ?? "text"}
          value={values[field.name] ?? ""}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              [field.name]: event.target.value,
            }))
          }
          required={field.required}
          multiline={field.multiline}
          minRows={field.minRows}
          slotProps={
            field.type === "time" ? { htmlInput: { step: 60 } } : undefined
          }
          fullWidth
        />
      ))}
    </FormPage>
  );
}

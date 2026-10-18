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
  submitLabel?: string;
  loadInitialValues?: () => Promise<EntityFormValues>;
  onSubmit: (values: EntityFormValues) => Promise<void>;
}

export default function EntityForm({
  title,
  parentTitle,
  backPath,
  fields,
  initialValues,
  submitLabel = "Enregistrer",
  loadInitialValues,
  onSubmit,
}: EntityFormProps) {
  const navigate = useNavigate();
  const [values, setValues] = React.useState(initialValues);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loadedFor, setLoadedFor] = React.useState<typeof loadInitialValues>();
  const isLoading = !!loadInitialValues && loadedFor !== loadInitialValues;

  React.useEffect(() => {
    if (!loadInitialValues) return;

    let isCurrent = true;

    void loadInitialValues()
      .then((loadedValues) => {
        if (isCurrent) {
          setValues(loadedValues);
          setLoadError(null);
        }
      })
      .catch((loadError: unknown) => {
        if (isCurrent) {
          setLoadError(
            loadError instanceof Error ? loadError.message : String(loadError),
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoadedFor(() => loadInitialValues);
      });

    return () => {
      isCurrent = false;
    };
  }, [loadInitialValues]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      navigate(backPath);
    } catch (submitError) {
      setSubmitError(
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
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      error={loadError ?? submitError}
      isSubmitting={isSubmitting}
      submitDisabled={isLoading || !!loadError}
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

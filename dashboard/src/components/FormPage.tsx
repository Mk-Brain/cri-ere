import type { FormEventHandler, ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import PageContainer from "./PageContainer";

interface FormPageProps {
  title: string;
  parentTitle: string;
  backPath: string;
  submitLabel: string;
  children: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onReset?: FormEventHandler<HTMLFormElement>;
  error?: string | null;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  noValidate?: boolean;
}

export default function FormPage({
  title,
  parentTitle,
  backPath,
  submitLabel,
  children,
  onSubmit,
  onReset,
  error,
  isSubmitting = false,
  submitDisabled = false,
  noValidate = false,
}: FormPageProps) {
  const navigate = useNavigate();

  return (
    <PageContainer
      title={title}
      breadcrumbs={[{ title: parentTitle, path: backPath }, { title }]}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        onReset={onReset}
        noValidate={noValidate}
        autoComplete="off"
        sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 2 }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack spacing={2}>
          {children}
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between", mt: 3 }}
          >
            <Button
              type="button"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(backPath)}
              disabled={isSubmitting}
            >
              Retour
            </Button>
            <Button
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={submitDisabled}
            >
              {submitLabel}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </PageContainer>
  );
}

import * as React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { type Dayjs } from "dayjs";
import { useNavigate } from "react-router";
import FormPage from "../FormPage";
import { StatutVisite } from "../../types/DomainTypes";
import { createOne as createVisit } from "../../services/visitService";
import { createOne as createVisiteur } from "../../services/visiteurService";
import { getAll as getParcours } from "../../services/parcoursService";
import { getAll as getCreneaux } from "../../services/creneauService";
import { getAll as getGuides } from "../../services/guideService";
import type {
  FormFieldValue,
  OptionItem,
  VisitFormState,
  VisitFormValues,
} from "../../types/VisitFormTypes";

const INITIAL_FORM_STATE: VisitFormState = {
  values: {
    date_visite: null,
    nombre_personnes: 1,
    id_parcours: "",
    id_creneau: "",
    id_guide: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  },
  errors: {},
};

export default function NewVisitePage() {
  const navigate = useNavigate();
  const [formState, setFormState] = React.useState(INITIAL_FORM_STATE);
  const [parcoursOptions, setParcoursOptions] = React.useState<OptionItem[]>(
    [],
  );
  const [creneauxOptions, setCreneauxOptions] = React.useState<OptionItem[]>(
    [],
  );
  const [guidesOptions, setGuidesOptions] = React.useState<OptionItem[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = React.useState(true);
  const [optionsError, setOptionsError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      setOptionsError(null);
      try {
        const [parcours, creneaux, guides] = await Promise.all([
          getParcours(),
          getCreneaux(),
          getGuides(),
        ]);

        setParcoursOptions(
          parcours.map(({ id_parcours, nom }) => ({
            id: id_parcours,
            label: nom,
          })),
        );
        setCreneauxOptions(
          creneaux.map(({ id_creneau, heure_debut, heure_fin }) => ({
            id: id_creneau,
            label: `${heure_debut} - ${heure_fin}`,
          })),
        );
        setGuidesOptions(
          guides.map(({ id_guide, nom, prenom }) => ({
            id: id_guide,
            label: `${prenom ? `${prenom} ` : ""}${nom}`,
          })),
        );
      } catch (error) {
        setOptionsError(
          error instanceof Error
            ? error.message
            : "Impossible de charger les options.",
        );
      } finally {
        setIsLoadingOptions(false);
      }
    };

    void fetchOptions();
  }, []);

  const handleFieldChange = React.useCallback(
    (name: keyof VisitFormValues, value: FormFieldValue) => {
      setFormState((current) => ({
        ...current,
        values: {
          ...current.values,
          [name]: value as VisitFormValues[typeof name],
        },
      }));
    },
    [],
  );

  const handleReset = React.useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setSubmitError(null);
  }, []);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitError(null);
      const { values } = formState;
      const {
        date_visite,
        nombre_personnes,
        id_parcours,
        id_creneau,
        id_guide,
        nom,
        prenom,
        email,
        telephone,
      } = values;
      const errors: VisitFormState["errors"] = {};

      if (!date_visite?.isValid()) errors.date_visite = "Date obligatoire.";
      if (typeof nombre_personnes !== "number" || nombre_personnes < 1) {
        errors.nombre_personnes = "Saisis au moins une personne.";
      }
      if (typeof id_parcours !== "number") {
        errors.id_parcours = "Sélectionne un parcours.";
      }
      if (typeof id_creneau !== "number") {
        errors.id_creneau = "Sélectionne un créneau.";
      }
      if (typeof id_guide !== "number") {
        errors.id_guide = "Sélectionne un guide.";
      }
      if (!nom?.trim()) errors.nom = "Le nom est obligatoire.";
      if (!email?.trim()) errors.email = "L’adresse email est obligatoire.";
      if (!telephone?.trim()) {
        errors.telephone = "Le téléphone est obligatoire.";
      }

      if (Object.keys(errors).length > 0) {
        setFormState((current) => ({ ...current, errors }));
        return;
      }

      if (
        !date_visite ||
        typeof nombre_personnes !== "number" ||
        typeof id_parcours !== "number" ||
        typeof id_creneau !== "number" ||
        typeof id_guide !== "number" ||
        !nom ||
        !email ||
        !telephone
      ) {
        return;
      }

      setIsSubmitting(true);
      try {
        const visiteur = await createVisiteur({
          nom: nom.trim(),
          prenom: prenom?.trim() || undefined,
          email: email.trim(),
          telephone: telephone.trim(),
        });

        if (visiteur.id_visiteur == null) {
          throw new Error("Impossible d’obtenir l’identifiant du visiteur.");
        }

        await createVisit({
          date_visite: date_visite.format("YYYY-MM-DD"),
          statut: StatutVisite.EN_ATTENTE,
          nombre_personnes,
          id_visiteur: visiteur.id_visiteur,
          id_parcours,
          id_creneau,
          id_guide,
        });
        navigate("/visites");
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Impossible de créer la visite.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, navigate],
  );

  const handleTextChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFieldChange(
        event.target.name as keyof VisitFormValues,
        event.target.value,
      );
    },
    [handleFieldChange],
  );

  const handleNumberChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      handleFieldChange(
        event.target.name as keyof VisitFormValues,
        value === "" ? "" : Number(value),
      );
    },
    [handleFieldChange],
  );

  const handleDateChange = React.useCallback(
    (value: Dayjs | null) => handleFieldChange("date_visite", value),
    [handleFieldChange],
  );

  const handleSelectChange = React.useCallback(
    (event: SelectChangeEvent<number | string>) => {
      handleFieldChange(
        event.target.name as keyof VisitFormValues,
        Number(event.target.value),
      );
    },
    [handleFieldChange],
  );

  const { values, errors } = formState;

  return (
    <FormPage
      title="Créer une visite"
      parentTitle="Visites"
      backPath="/visites"
      submitLabel="Enregistrer"
      onSubmit={handleSubmit}
      onReset={handleReset}
      error={submitError ?? optionsError}
      isSubmitting={isSubmitting}
      submitDisabled={isLoadingOptions || !!optionsError}
      noValidate
    >
      {isLoadingOptions ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormGroup>
          <Typography variant="h6" sx={{ mb: 1, color: "primary.main" }}>
            Informations du visiteur
          </Typography>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                value={values.nom ?? ""}
                onChange={handleTextChange}
                name="nom"
                label="Nom"
                required
                error={!!errors.nom}
                helperText={errors.nom ?? " "}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                value={values.prenom ?? ""}
                onChange={handleTextChange}
                name="prenom"
                label="Prénom"
                error={!!errors.prenom}
                helperText={errors.prenom ?? " "}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="email"
                value={values.email ?? ""}
                onChange={handleTextChange}
                name="email"
                label="Adresse email"
                required
                error={!!errors.email}
                helperText={errors.email ?? " "}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                value={values.telephone ?? ""}
                onChange={handleTextChange}
                name="telephone"
                label="Téléphone"
                required
                error={!!errors.telephone}
                helperText={errors.telephone ?? " "}
                fullWidth
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ mb: 1, color: "primary.main" }}>
            Détails de la visite
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date de la visite *"
                  value={values.date_visite ? dayjs(values.date_visite) : null}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      error: !!errors.date_visite,
                      helperText: errors.date_visite ?? " ",
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="number"
                value={values.nombre_personnes ?? ""}
                onChange={handleNumberChange}
                name="nombre_personnes"
                label="Nombre de personnes"
                required
                slotProps={{ htmlInput: { min: 1 } }}
                error={!!errors.nombre_personnes}
                helperText={errors.nombre_personnes ?? " "}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl error={!!errors.id_parcours} fullWidth required>
                <InputLabel id="parcours-select-label">Parcours</InputLabel>
                <Select
                  labelId="parcours-select-label"
                  name="id_parcours"
                  value={values.id_parcours ?? ""}
                  onChange={handleSelectChange}
                  label="Parcours *"
                >
                  {parcoursOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.id_parcours ?? " "}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl error={!!errors.id_creneau} fullWidth required>
                <InputLabel id="creneau-select-label">
                  Créneau horaire
                </InputLabel>
                <Select
                  labelId="creneau-select-label"
                  name="id_creneau"
                  value={values.id_creneau ?? ""}
                  onChange={handleSelectChange}
                  label="Créneau horaire *"
                >
                  {creneauxOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.id_creneau ?? " "}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl error={!!errors.id_guide} fullWidth required>
                <InputLabel id="guide-select-label">Guide désigné</InputLabel>
                <Select
                  labelId="guide-select-label"
                  name="id_guide"
                  value={values.id_guide ?? ""}
                  onChange={handleSelectChange}
                  label="Guide désigné *"
                >
                  {guidesOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.id_guide ?? " "}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </FormGroup>
      )}
    </FormPage>
  );
}

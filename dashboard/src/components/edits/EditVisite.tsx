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
import { useNavigate, useParams } from "react-router";
import FormPage from "../FormPage";
import {
  getOne as getVisit,
  updateOne as updateVisit,
} from "../../services/visitService";
import {
  getOne as getVisiteur,
  updateOne as updateVisiteur,
} from "../../services/visiteurService";
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

export default function EditVisitePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const visitId = Number(id);
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
    let isCurrent = true;
    const loadVisit = async () => {
      setIsLoadingOptions(true);
      setOptionsError(null);
      try {
        if (!Number.isInteger(visitId) || visitId <= 0) {
          throw new Error("Identifiant de visite invalide.");
        }

        const visit = await getVisit(visitId);
        const [visiteur, parcours, creneaux, guides] = await Promise.all([
          getVisiteur(visit.id_visiteur),
          getParcours(),
          getCreneaux(),
          getGuides(),
        ]);

        if (!isCurrent) return;

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
        setFormState({
          values: {
            date_visite: dayjs(visit.date_visite),
            nombre_personnes: visit.nombre_personnes,
            id_parcours: visit.id_parcours,
            id_creneau: visit.id_creneau,
            id_guide: visit.id_guide,
            nom: visiteur.nom,
            prenom: visiteur.prenom ?? "",
            email: visiteur.email,
            telephone: visiteur.telephone,
          },
          errors: {},
        });
      } catch (error) {
        if (isCurrent) {
          setOptionsError(
            error instanceof Error
              ? error.message
              : "Impossible de charger les données de la visite.",
          );
        }
      } finally {
        if (isCurrent) setIsLoadingOptions(false);
      }
    };

    void loadVisit();
    return () => {
      isCurrent = false;
    };
  }, [visitId]);

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

      if (
        !date_visite ||
        typeof nombre_personnes !== "number" ||
        typeof id_parcours !== "number" ||
        typeof id_creneau !== "number" ||
        typeof id_guide !== "number" ||
        !nom?.trim() ||
        !email?.trim() ||
        !telephone?.trim()
      ) {
        setSubmitError("Complète les champs obligatoires avant d’enregistrer.");
        return;
      }

      setIsSubmitting(true);
      try {
        const visit = await getVisit(visitId);
        await updateVisiteur(visit.id_visiteur, {
          nom: nom.trim(),
          prenom: prenom?.trim() || undefined,
          email: email.trim(),
          telephone: telephone.trim(),
        });
        await updateVisit(visitId, {
          date_visite: date_visite.format("YYYY-MM-DD"),
          nombre_personnes,
          id_parcours,
          id_creneau,
          id_guide,
        });
        navigate("/visites");
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Impossible d’enregistrer les modifications.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formState, navigate, visitId],
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
      title="Modifier une visite"
      parentTitle="Visites"
      backPath="/visites"
      submitLabel="Enregistrer les modifications"
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

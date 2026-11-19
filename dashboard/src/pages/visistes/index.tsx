import * as React from "react";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  StatutVisite,
  type Visite,
} from "../../types/DomainTypes";
import {
  deleteOne,
  getMany,
  updateStatus,
} from "../../services/visitService";
import ReferenceList from "../../components/ReferenceList";
import ResponsiveDialog from "../../components/Dialog";
import { useNavigate, type NavigateFunction } from "react-router";

const visitStatuses = [
  { value: StatutVisite.EN_ATTENTE, label: "En attente" },
  { value: StatutVisite.EFFECTUEE, label: "Effectuée" },
  { value: StatutVisite.NON_EFFECTUEE, label: "Non effectuée" },
];

function renderVisitStatus(value: unknown) {
  switch (value) {
    case StatutVisite.EFFECTUEE:
      return (
        <Chip
          icon={<CheckCircleIcon />}
          label="Effectuée"
          color="success"
          size="small"
        />
      );
    case StatutVisite.NON_EFFECTUEE:
      return (
        <Chip
          icon={<CancelOutlinedIcon />}
          label="Non effectuée"
          color="error"
          size="small"
        />
      );
    case StatutVisite.EN_ATTENTE:
      return (
        <Chip
          icon={<ScheduleIcon />}
          label="En attente"
          color="warning"
          size="small"
        />
      );
    default:
      return String(value ?? "");
  }
}

function VisitStatusCell({
  id,
  value,
  onStatusChange,
}: {
  id: number;
  value: unknown;
  onStatusChange: (id: number, status: StatutVisite) => Promise<void>;
}) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusSelect = async (status: StatutVisite) => {
    setAnchorEl(null);
    if (status === value) return;

    setIsUpdating(true);
    try {
      await onStatusChange(id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {renderVisitStatus(value)}
      <IconButton
        size="small"
        aria-label="Modifier le statut de la visite"
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        disabled={isUpdating}
      >
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {visitStatuses.map((status) => (
          <MenuItem
            key={status.value}
            selected={status.value === value}
            onClick={() => void handleStatusSelect(status.value)}
          >
            {status.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function defineColumns(
  navigate: NavigateFunction,
  onDelete: (id: number) => Promise<void>,
  onStatusChange: (id: number, status: StatutVisite) => Promise<void>,
  onSendEmail: (visit: Visite) => void,
) {
  const columns: GridColDef[] = [
    { field: "id_visite", headerName: "ID", width: 80 },
    {
      field: "date_visite",
      headerName: "Date",
      width: 130,
      renderCell: ({ value }) => {
        const date = new Date(`${String(value)}T00:00:00`);
        return Number.isNaN(date.getTime())
          ? String(value ?? "")
          : new Intl.DateTimeFormat("fr-FR").format(date);
      },
    },

    {
      field: "statut",
      headerName: "Statut",
      type: "singleSelect",
      valueOptions: visitStatuses,
      width: 190,
      renderCell: ({ row, value }) => (
        <VisitStatusCell
          id={row.id_visite}
          value={value}
          onStatusChange={onStatusChange}
        />
      ),
    },
    {
      field: "nombre_personnes",
      headerName: "Nombre de personnes",
      type: "number",
      minWidth: 100,
    },
    {
      field: "id_guide",
      headerName: "Guide",
      minWidth: 160,
      renderCell: ({ row }) => {
        const guide = row.guide
        return guide
          ? `${guide.prenom ? `${guide.prenom} ` : ""}${guide.nom}`
          : `#${row.id_guide}`;
      },
    },
    {
      field: "id_visiteur",
      headerName: "Visiteur",
      width: 160,
      renderCell: ({ row }) => {
        const visiteur = row.visiteur

        return visiteur
          ? `${visiteur.prenom ? `${visiteur.prenom} ` : ""}${visiteur.nom}`
          : `#${row.id_visiteur}`;
      },
    },
    {
      field: "id_parcours",
      headerName: "Parcours",
      width: 200,
      renderCell: ({ row }) => {
        const parcours = row.parcours

        return parcours
          ? `${parcours.nom ? `${parcours.nom} ` : ""}`
          : `#${row.id_parcours}`;
      },
    },
    {
      field: "id_creneau",
      headerName: "Créneau",
      width: 160,
      renderCell: ({ row }) => {
        const creneau = row.creneau
        return creneau
          ? `${creneau.heure_debut} - ${creneau.heure_fin}`
          : `#${row.id_creneau}`;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 140,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="email-visitor"
          icon={<EmailOutlinedIcon />}
          label="Envoyer un courriel au visiteur"
          disabled={!row.visiteur?.email}
          onClick={() => onSendEmail(row)}
        />,
        <GridActionsCellItem
          key="edit-visit"
          icon={<EditIcon />}
          label="Modifier"
          onClick={() => navigate(`/visites/edit/${row.id_visite}`)}
        />,
        <GridActionsCellItem
          key="delete-visit"
          icon={<DeleteIcon />}
          label="Supprimer"
          onClick={() => void onDelete(row.id_visite)}
        />,
      ],
    },
  ];

  return columns;
}

export const Visites = () => {
  const navigate = useNavigate();
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [selectedVisit, setSelectedVisit] = React.useState<Visite | null>(null);
  

  const handleDelete = React.useCallback(async (id: number) => {
    setActionError(null);
    try {
      await deleteOne(id);
      setRefreshToken((current) => current + 1);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer cette visite.",
      );
    }
  }, []);

  const handleStatusChange = React.useCallback(
    async (id: number, status: StatutVisite) => {
      setActionError(null);
      try {
        await updateStatus(id, status);
        setRefreshToken((current) => current + 1);
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "Impossible de modifier le statut de cette visite.",
        );
      }
    },
    [],
  );

  return (
    <>
      <ReferenceList<Visite>
        title="Visites"
        createLabel="Créer une visite"
        createPath="/visites/new"
        refreshToken={refreshToken}
        actionError={actionError}
        idField="id_visite"
        columns={defineColumns(
          navigate,
          handleDelete,
          handleStatusChange,
          setSelectedVisit,
        )}
        getMany={getMany}
      />
      {selectedVisit?.visiteur?.email && (
        <ResponsiveDialog
          mode="email"
          open={selectedVisit !== null}
          onClose={() => setSelectedVisit(null)}
          visitorId={selectedVisit.id_visiteur}
          recipientName={
            selectedVisit.visiteur.prenom
              ? `${selectedVisit.visiteur.prenom} ${selectedVisit.visiteur.nom}`
              : selectedVisit.visiteur.nom
          }
          recipientEmail={selectedVisit.visiteur.email}
          setRefreshToken={setRefreshToken}
          setActionError={setActionError}
        />
      )}
    </>
  );
};

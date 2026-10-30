import * as React from "react";
import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  StatutVisite,
  type Visite,
  
} from "../../types/DomainTypes";
import { deleteOne, getMany } from "../../services/visitService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";

function defineColumns(
  navigate: NavigateFunction,
  onDelete: (id: number) => Promise<void>,
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
      valueOptions: [
        { value: StatutVisite.EN_ATTENTE, label: "En attente" },
        { value: StatutVisite.EFFECTUEE, label: "Effectuée" },
        { value: StatutVisite.NON_EFFECTUEE, label: "Non effectuée" },
      ],
      width: 160,
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
      width: 100,
      getActions: ({ row }) => [
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

  return (
    <ReferenceList<Visite>
      title="Visites"
      createLabel="Créer une visite"
      createPath="/visites/new"
      refreshToken={refreshToken}
      actionError={actionError}
      idField="id_visite"
      columns={defineColumns(navigate, handleDelete)}
      getMany={getMany}
    />
  );
};

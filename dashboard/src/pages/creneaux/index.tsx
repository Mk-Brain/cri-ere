import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { CreneauHoraire } from "../../types/DomainTypes";
import { deleteOne, getMany } from "../../services/creneauService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";
import React from "react";

function createColumns(
  navigate: NavigateFunction,
  onDelete: (id: number) => Promise<void>,
): GridColDef[] {
  return [
    { field: "id_creneau", headerName: "ID", width: 90 },
    { field: "heure_debut", headerName: "Heure de début", minWidth: 180 },
    { field: "heure_fin", headerName: "Heure de fin", minWidth: 180 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit-creneau"
          icon={<EditIcon />}
          label="Modifier"
          onClick={() => navigate(`/crenaux/edit/${row.id_creneau}`)}
        />,
        <GridActionsCellItem
          key="delete-creneau"
          icon={<DeleteIcon />}
          label="Supprimer (bientôt disponible)"
          onClick={() => void onDelete(row.id_creneau)}
        />,
      ],
    },
  ];
}

export const Creneaux = () => {
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
    <ReferenceList<CreneauHoraire>
      title="Créneaux"
      createLabel="Créer un créneau"
      createPath="/crenaux/new"
      idField="id_creneau"
      columns={createColumns(navigate, handleDelete)}
      getMany={getMany}
      refreshToken={refreshToken}
      actionError={actionError}
    />
  );
};

import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Parcours as ParcoursModel } from "../../types/DomainTypes";
import { deleteOne, getMany } from "../../services/parcoursService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";
import React from "react";

function createColumns(
  navigate: NavigateFunction,
  onDelete: (id: number) => Promise<void>,
): GridColDef[] {
  return [
    { field: "id_parcours", headerName: "ID", width: 90 },
    { field: "nom", headerName: "Nom", minWidth: 180, flex: 1 },
    { field: "description", headerName: "Description", minWidth: 260, flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit-parcours"
          icon={<EditIcon />}
          label="Modifier"
          onClick={() => navigate(`/parcours/edit/${row.id_parcours}`)}
        />,
        <GridActionsCellItem
          key="delete-parcours"
          icon={<DeleteIcon />}
          label="Supprimer (bientôt disponible)"
          onClick={() => void onDelete(row.id_parcours)}
        />,
      ],
    },
  ];
}

export const Parcours = () => {
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
    <ReferenceList<ParcoursModel>
      title="Parcours"
      createLabel="Créer un parcours"
      createPath="/parcours/new"
      idField="id_parcours"
      columns={createColumns(navigate, handleDelete)}
      getMany={getMany}
      refreshToken={refreshToken}
      actionError={actionError}
    />
  );
};

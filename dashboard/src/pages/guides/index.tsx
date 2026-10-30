import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Guide } from "../../types/DomainTypes";
import { deleteOne, getMany } from "../../services/guideService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";
import React from "react";

function createColumns(navigate: NavigateFunction, onDelete: (id: number) => Promise<void>,): GridColDef[] {
  return [
    { field: "id_guide", headerName: "ID", width: 90 },
    { field: "nom", headerName: "Nom", minWidth: 160, flex: 1 },
    { field: "prenom", headerName: "Prénom", minWidth: 160, flex: 1 },
    { field: "telephone", headerName: "Téléphone", minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit-guide"
          icon={<EditIcon />}
          label="Modifier"
          onClick={() => navigate(`/guides/edit/${row.id_guide}`)}
        />,
        <GridActionsCellItem
          key="delete-guide"
          icon={<DeleteIcon />}
          label="Supprimer (bientôt disponible)"
          onClick={() => void onDelete(row.id_guide)}
        />,
      ],
    },
  ];
}

export const Guides = () => {
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
    <ReferenceList<Guide>
      title="Guides"
      createLabel="Créer un guide"
      createPath="/guides/new"
      idField="id_guide"
      columns={createColumns(navigate, handleDelete)}
      getMany={getMany}
      refreshToken={refreshToken}
      actionError={actionError}
    />
  );
};

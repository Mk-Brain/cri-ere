import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import { type Visiteur } from "../../types/DomainTypes";
import { deleteOne, getMany } from "../../services/visiteurService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";
import React from "react";
import ResponsiveDialog from "../../components/Dialog";

function createColumns(
  navigate: NavigateFunction,
  onDelete: (id: number) => Promise<void>,
  onOpenDialog: (visitor: Visiteur) => void
): GridColDef[] {
  return [
    { field: "id_visiteur", headerName: "ID", width: 80 },
    { field: "nom", headerName: "Nom", width: 140 },
    { field: "prenom", headerName: "Prénom", width: 110 },
    { field: "email", headerName: "Email", minWidth: 200 },
    { field: "telephone", headerName: "Téléphone", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="send-messages"
          icon={<SendIcon />}
          label="Envoyer un message (bientôt disponible)"
          onClick={() => onOpenDialog(row)}
        />,
        <GridActionsCellItem
          key="edit-visit"
          icon={<EditIcon />}
          label="Modifier"
          onClick={() => navigate(`/visiteurs/edit/${row.id_visiteur}`)}
        />,
        <GridActionsCellItem
          key="delete-visit"
          icon={<DeleteIcon />}
          label="Supprimer (bientôt disponible)"
          onClick={() => void onDelete(row.id_visiteur)}
        />,
      ],
    },
  ];
}

export const Visiteurs = () => {
  const navigate = useNavigate();
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [actionError, setActionError] = React.useState<string | null>(null);
   const [selectedVisitor, setSelectedVisitor] =
      React.useState<Visiteur | null>(null);
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
    <>
        <ReferenceList<Visiteur>
      title="Visiteurs"
      createLabel="Créer un visiteur"
      createPath="/visiteurs/new"
      idField="id_visiteur"
      columns={createColumns(navigate, handleDelete, setSelectedVisitor)}
      getMany={getMany}
      refreshToken={refreshToken}
      actionError={actionError}
    />
    <ResponsiveDialog
    open={selectedVisitor !== null}
    onClose={() => setSelectedVisitor(null)}
    setActionError={setActionError}
    setRefreshToken={setRefreshToken}
    mode="email"
    visitorId={selectedVisitor ? selectedVisitor.id_visiteur ?? 0 : 0}
    recipientName={selectedVisitor ? selectedVisitor.nom : ""}
    recipientEmail={selectedVisitor ? selectedVisitor.email : ""}
    />
    </>
  );
}
  
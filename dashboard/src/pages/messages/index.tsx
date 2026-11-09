import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import { StatutMessage, type VisitorMessage } from "../../types/DomainTypes";
import { deleteOne, getMany } from "../../services/MessagesService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";
import React from "react";

function defineColumns(
  navigate: NavigateFunction,
  onDelete: (id: number) => Promise<void>,
) {
const columns: GridColDef[] = [
  { field: "id_message", headerName: "ID", width: 90 },
  { field: "nom", headerName: "Nom", minWidth: 180, flex: 1 },
  { field: "email", headerName: "E-mail", minWidth: 220, flex: 1 },
  { field: "contenu", headerName: "Message", minWidth: 260, flex: 2 },
  { field: "date_envoi", headerName: "Date d'envoi", minWidth: 180 },
  { field: "statut", headerName: "statut", minWidth: 260, flex: 2 , type:'singleSelect', valueOptions:[
    {value: StatutMessage.LU, label: "Lu"},
    {value: StatutMessage.NON_LU, label: "Non lu"},
    {value: StatutMessage.REPONDU, label: "Archivé"},
  ]},
  {
    field: "actions",
    headerName: "Actions",
    type: "actions",
    width: 100,
    getActions: ({ row }) => [
      <GridActionsCellItem
        key="replit-messages"
        icon={<SendIcon />}
        label="Répondre (bientôt disponible)"
        onClick={() => navigate(`/visites/edit/${row.id_message}`)}
      />,
      <GridActionsCellItem
        key="delete-messages"
        icon={<DeleteIcon />}
        label="Supprimer (bientôt disponible)"
        onClick={() => void onDelete(row.id_message)}
      />,
    ],
  },
];

return columns
}
export const Messages = ()=>{
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
  <ReferenceList<VisitorMessage>
    title="Messages"
    createLabel="Créer un message"
    createPath="/messages/new"
    idField="id_message"
    columns={defineColumns(navigate, handleDelete)}
    getMany={getMany}
    refreshToken={refreshToken}
      actionError={actionError}
  />
);
} 

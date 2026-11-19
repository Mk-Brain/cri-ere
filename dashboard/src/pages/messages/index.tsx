import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { StatutMessage, type VisitorMessage } from "../../types/DomainTypes";
import { deleteOne, getMany } from "../../services/MessagesService";
import ReferenceList from "../../components/ReferenceList";
import ResponsiveDialog from "../../components/Dialog";
import React from "react";

function renderMessageStatus(value: unknown) {
  switch (value) {
    case StatutMessage.NON_LU:
      return (
        <Chip
          icon={<MarkEmailUnreadOutlinedIcon />}
          label="Non lu"
          color="info"
          size="small"
        />
      );
    case StatutMessage.LU:
      return (
        <Chip
          icon={<VisibilityOutlinedIcon />}
          label="Lu"
          color="default"
          size="small"
        />
      );
    case StatutMessage.REPONDU:
      return (
        <Chip
          icon={<ReplyOutlinedIcon />}
          label="Répondu"
          color="success"
          size="small"
        />
      );
    default:
      return String(value ?? "");
  }
}

function defineColumns(
  onDelete: (id: number) => Promise<void>,
  onOpenMessage: (message: VisitorMessage) => void,
) {
const columns: GridColDef[] = [
  { field: "id_message", headerName: "ID", width: 90 },
  { field: "nom", headerName: "Nom", minWidth: 180, flex: 1 },
  { field: "email", headerName: "E-mail", minWidth: 220, flex: 1 },
  { field: "contenu", headerName: "Message", minWidth: 260, flex: 2 },
  { field: "date_envoi", headerName: "Date d'envoi", minWidth: 180 },
  { field: "statut", headerName: "statut", minWidth: 160, flex: 2 , type:'singleSelect', valueOptions:[
    {value: StatutMessage.LU, label: "Lu"},
    {value: StatutMessage.NON_LU, label: "Non lu"},
    {value: StatutMessage.REPONDU, label: "Répondu"},
  ], renderCell: ({ value }) => renderMessageStatus(value)},
  {
    field: "actions",
    headerName: "Actions",
    type: "actions",
    width: 100,
    getActions: ({ row }) => [
      <GridActionsCellItem
        key="see-messages"
        icon={<VisibilityIcon />}
        label="Consulter les messages"
        onClick={() => onOpenMessage(row)}
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
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] =
    React.useState<VisitorMessage | null>(null);

  const handleDelete = React.useCallback(async (id: number) => {
    setActionError(null);
    try {
      await deleteOne(id);
      setRefreshToken((current) => current + 1);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Impossible de supprimer ce message.",
      );
    }
  }, []);
  return (
    <>
  <ReferenceList<VisitorMessage>
    title="Messages"
    createLabel="Créer un message"
    createPath="/messages/new"
    idField="id_message"
    columns={defineColumns(handleDelete, setSelectedMessage)}
    getMany={getMany}
    refreshToken={refreshToken}
      actionError={actionError}
  />
      <ResponsiveDialog
        mode="reply"
        open={selectedMessage !== null}
        onClose={() => setSelectedMessage(null)}
        messageId={selectedMessage ? selectedMessage.id_message : 0}
        content={
          selectedMessage
            ? [
                `De : ${selectedMessage.nom ?? "Visiteur"}`,
                `E-mail : ${selectedMessage.email}`,
                "",
                selectedMessage.contenu,
                ...(selectedMessage.reponses ?? []).flatMap((response) => [
                  "",
                  `Réponse de ${response.nom ?? response.email} — ${new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(response.date_envoi))}`,
                  response.contenu,
                ]),
              ].join("\n")
            : ""
        }
        status={selectedMessage ? selectedMessage.statut : "NON_LU"}
        setRefreshToken={setRefreshToken}
        setActionError={setActionError}
      />
    </>
);
} 

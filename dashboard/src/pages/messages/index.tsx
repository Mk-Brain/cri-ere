import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import { StatutMessage, type VisitorMessage } from "../../types/DomainTypes";
import { getMany } from "../../services/MessagesService";
import ReferenceList from "../../components/ReferenceList";

const columns: GridColDef[] = [
  { field: "id_message", headerName: "ID", width: 90 },
  { field: "contenu", headerName: "Nom", minWidth: 180, flex: 1 },
  { field: "date_envoi", headerName: "Description", minWidth: 260, flex: 2 },
  { field: "statut", headerName: "statut", minWidth: 260, flex: 2 , type:'singleSelect', valueOptions:[
    {value: StatutMessage.LU, label: "Lu"},
    {value: StatutMessage.NON_LU, label: "Non lu"},
    {value: StatutMessage.REPONDU, label: "Archivé"},
  ]},
  { field: "id_visiteur", headerName: "Description", minWidth: 260, flex: 2 },
  {
    field: "actions",
    headerName: "Actions",
    type: "actions",
    width: 100,
    getActions: () => [
      <GridActionsCellItem
        key="replit-messages"
        icon={<SendIcon />}
        label="Répondre (bientôt disponible)"
        disabled
      />,
      <GridActionsCellItem
        key="delete-messages"
        icon={<DeleteIcon />}
        label="Supprimer (bientôt disponible)"
        disabled
      />,
    ],
  },
];

export const Messages = () => (
  <ReferenceList<VisitorMessage>
    title="Messages"
    createLabel="Créer un message"
    createPath="/messages/new"
    idField="id_message"
    columns={columns}
    getMany={getMany}
  />
);

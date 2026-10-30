import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from '@mui/icons-material/Send';
import { StatutMessage, type VisitorMessage } from "../../types/DomainTypes";
import { getMany } from "../../services/MessagesService";
import { deleteOne, getAll as getVisiteurs } from "../../services/visiteurService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";
import React from "react";

function defineColumns(
  navigate: NavigateFunction,
  onDelete: (id: number) => Promise<void>,
  lookups: {
    visiteurs: ReturnType<typeof getVisiteurs>;
  },
) {
const columns: GridColDef[] = [
  { field: "id_message", headerName: "ID", width: 90 },
  { field: "contenu", headerName: "Nom", minWidth: 180, flex: 1 },
  { field: "date_envoi", headerName: "Description", minWidth: 260, flex: 2 },
  { field: "statut", headerName: "statut", minWidth: 260, flex: 2 , type:'singleSelect', valueOptions:[
    {value: StatutMessage.LU, label: "Lu"},
    {value: StatutMessage.NON_LU, label: "Non lu"},
    {value: StatutMessage.REPONDU, label: "Archivé"},
  ]},
  { field: "id_visiteur", headerName: "Description", minWidth: 260, flex: 2 ,renderCell: async ({ row }) => {
        const visiteur = (await lookups.visiteurs).find(
          (item) => item.id_visiteur === row.id_guide,
        );
        return visiteur
          ? `${visiteur.prenom ? `${visiteur.prenom} ` : ""}${visiteur.nom}`
          : `#${row.id_guide}`;
      },},
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
  const lookups = React.useMemo(
    () => ({
      visiteurs: getVisiteurs(),

    }),
    [],
  );

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
    columns={defineColumns(navigate, handleDelete, lookups)}
    getMany={getMany}
    refreshToken={refreshToken}
      actionError={actionError}
  />
);
} 

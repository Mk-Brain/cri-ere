import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import { type Visiteur } from "../../types/DomainTypes";
import { getMany } from "../../services/visiteurService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";

function createColumns(navigate: NavigateFunction): GridColDef[] {
  return [
    { field: "id_visiteur", headerName: "ID", width: 80 },
    { field: "nom", headerName: "Nom", width: 140 },
    { field: "prenom", headerName: "Prénom", width: 110 },
    { field: "email", headerName: "Email", width: 120 },
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
          disabled
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
          disabled
        />,
      ],
    },
  ];
}

export const Visiteurs = () => {
  const navigate = useNavigate();
  return (
    <ReferenceList<Visiteur>
      title="Visiteurs"
      createLabel="Créer un visiteur"
      createPath="/visiteurs/new"
      idField="id_visiteur"
      columns={createColumns(navigate)}
      getMany={getMany}
    />
  );
};

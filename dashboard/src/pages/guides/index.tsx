import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Guide } from "../../types/DomainTypes";
import { getMany } from "../../services/guideService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";

function createColumns(navigate: NavigateFunction): GridColDef[] {
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
          disabled
        />,
      ],
    },
  ];
}

export const Guides = () => {
  const navigate = useNavigate();
  return (
    <ReferenceList<Guide>
      title="Guides"
      createLabel="Créer un guide"
      createPath="/guides/new"
      idField="id_guide"
      columns={createColumns(navigate)}
      getMany={getMany}
    />
  );
};

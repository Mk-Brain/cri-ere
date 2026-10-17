import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Guide } from "../../types/DomainTypes";
import { getMany } from "../../services/guideService";
import ReferenceList from "../../components/ReferenceList";

const columns: GridColDef[] = [
  { field: "id_guide", headerName: "ID", width: 90 },
  { field: "nom", headerName: "Nom", minWidth: 160, flex: 1 },
  { field: "prenom", headerName: "Prénom", minWidth: 160, flex: 1 },
  { field: "telephone", headerName: "Téléphone", minWidth: 150 },
  {
    field: "actions",
    headerName: "Actions",
    type: "actions",
    width: 100,
    getActions: () => [
      <GridActionsCellItem
        key="edit-guide"
        icon={<EditIcon />}
        label="Modifier (bientôt disponible)"
        disabled
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

export const Guides = () => (
  <ReferenceList<Guide>
    title="Guides"
    createLabel="Créer un guide"
    createPath="/guides/new"
    idField="id_guide"
    columns={columns}
    getMany={getMany}
  />
);

import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { Parcours as ParcoursModel } from "../../types/DomainTypes";
import { getMany } from "../../services/parcoursService";
import ReferenceList from "../../components/ReferenceList";

const columns: GridColDef[] = [
  { field: "id_parcours", headerName: "ID", width: 90 },
  { field: "nom", headerName: "Nom", minWidth: 180, flex: 1 },
  { field: "description", headerName: "Description", minWidth: 260, flex: 2 },
  {
    field: "actions",
    headerName: "Actions",
    type: "actions",
    width: 100,
    getActions: () => [
      <GridActionsCellItem
        key="edit-parcours"
        icon={<EditIcon />}
        label="Modifier (bientôt disponible)"
        disabled
      />,
      <GridActionsCellItem
        key="delete-parcours"
        icon={<DeleteIcon />}
        label="Supprimer (bientôt disponible)"
        disabled
      />,
    ],
  },
];

export const Parcours = () => (
  <ReferenceList<ParcoursModel>
    title="Parcours"
    createLabel="Créer un parcours"
    createPath="/parcours/new"
    idField="id_parcours"
    columns={columns}
    getMany={getMany}
  />
);

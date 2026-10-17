import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { CreneauHoraire } from "../../types/DomainTypes";
import { getMany } from "../../services/creneauService";
import ReferenceList from "../../components/ReferenceList";

const columns: GridColDef[] = [
  { field: "id_creneau", headerName: "ID", width: 90 },
  { field: "heure_debut", headerName: "Heure de début", minWidth: 180 },
  { field: "heure_fin", headerName: "Heure de fin", minWidth: 180 },
  {
    field: "actions",
    headerName: "Actions",
    type: "actions",
    width: 100,
    getActions: () => [
      <GridActionsCellItem
        key="edit-creneau"
        icon={<EditIcon />}
        label="Modifier (bientôt disponible)"
        disabled
      />,
      <GridActionsCellItem
        key="delete-creneau"
        icon={<DeleteIcon />}
        label="Supprimer (bientôt disponible)"
        disabled
      />,
    ],
  },
];

export const Creneaux = () => (
  <ReferenceList<CreneauHoraire>
    title="Créneaux"
    createLabel="Créer un créneau"
    createPath="/crenaux/new"
    idField="id_creneau"
    columns={columns}
    getMany={getMany}
  />
);

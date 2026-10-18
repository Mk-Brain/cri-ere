import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { CreneauHoraire } from "../../types/DomainTypes";
import { getMany } from "../../services/creneauService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";

function createColumns(navigate: NavigateFunction): GridColDef[] {
  return [
    { field: "id_creneau", headerName: "ID", width: 90 },
    { field: "heure_debut", headerName: "Heure de début", minWidth: 180 },
    { field: "heure_fin", headerName: "Heure de fin", minWidth: 180 },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit-creneau"
          icon={<EditIcon />}
          label="Modifier"
          onClick={() => navigate(`/crenaux/edit/${row.id_creneau}`)}
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
}

export const Creneaux = () => {
  const navigate = useNavigate();
  return (
    <ReferenceList<CreneauHoraire>
      title="Créneaux"
      createLabel="Créer un créneau"
      createPath="/crenaux/new"
      idField="id_creneau"
      columns={createColumns(navigate)}
      getMany={getMany}
    />
  );
};

import { GridActionsCellItem, type GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { StatutVisite, type Visite } from "../../types/DomainTypes";
import { deleteOne, getMany } from "../../services/visitService";
import ReferenceList from "../../components/ReferenceList";
import { useNavigate, type NavigateFunction } from "react-router";

function defineColumns(n: NavigateFunction) {
  const columns: GridColDef[] = [
    { field: "id_visite", headerName: "ID", width: 80 },
    { field: "date_visite", headerName: "Date", width: 140 },
    { field: "id_guide", headerName: "ID Guide", width: 110 },
    { field: "id_visiteur", headerName: "ID Visiteur", width: 120 },
    { field: "id_parcours", headerName: "ID Parcours", width: 120 },
    { field: "id_creneau", headerName: "ID Créneau", width: 120 },
    {
      field: "statut",
      headerName: "Statut",
      type: "singleSelect",
      valueOptions: [
        { value: StatutVisite.EN_ATTENTE, label: "En attente" },
        { value: StatutVisite.EFFECTUEE, label: "Effectuée" },
        { value: StatutVisite.NON_EFFECTUEE, label: "Non effectuée" },
      ],
      width: 160,
    },
    {
      field: "nombre_personnes",
      headerName: "Nombre de personnes",
      type: "number",
      width: 180,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit-visit"
          icon={<EditIcon />}
          label="Modifier"
          onClick={() => n(`/visites/edit/${row.id_visite}`)}
        />,
        <GridActionsCellItem
          key="delete-visit"
          icon={<DeleteIcon />}
          label="Supprimer (bientôt disponible)"
          onClick={()=>{deleteOne(row.id_visite)}}
        />,
      ],
    },
  ];

  return columns;
}

export const Visites = () => {
  const navigate = useNavigate();

  return (
    <ReferenceList<Visite>
      title="Visites"
      createLabel="Créer une visite"
      createPath="/visites/new"
      idField="id_visite"
      columns={defineColumns(navigate)}
      getMany={getMany}
    />
  );
};

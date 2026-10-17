import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import {
  DataGrid,
  gridClasses,
  type GridColDef,
  type GridFilterModel,
  type GridPaginationModel,
  type GridSortModel,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import PageContainer from "./PageContainer";
import type { CollectionQuery } from "../types/CollectionTypes";

const INITIAL_PAGE_SIZE = 10;

interface ReferenceListProps<T extends object> {
  title: string;
  createLabel: string;
  createPath: string;
  idField: keyof T;
  columns: GridColDef[];
  getMany: (
    query: CollectionQuery,
  ) => Promise<{ items: T[]; itemCount: number }>;
}

export default function ReferenceList<T extends object>({
  title,
  createLabel,
  createPath,
  idField,
  columns,
  getMany,
}: ReferenceListProps<T>) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] =
    React.useState<GridPaginationModel>({
      page: Number(searchParams.get("page") ?? 0),
      pageSize: Number(searchParams.get("pageSize") ?? INITIAL_PAGE_SIZE),
    });
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>(() => {
    try {
      return JSON.parse(searchParams.get("filter") ?? '{"items":[]}');
    } catch {
      return { items: [] };
    }
  });
  const [sortModel, setSortModel] = React.useState<GridSortModel>(() => {
    try {
      return JSON.parse(searchParams.get("sort") ?? "[]");
    } catch {
      return [];
    }
  });
  const [rows, setRows] = React.useState<T[]>([]);
  const [rowCount, setRowCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const updateSearchParams = React.useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      navigate(`${pathname}${query ? `?${query}` : ""}`);
    },
    [navigate, pathname],
  );

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await getMany({ paginationModel, sortModel, filterModel });
      setRows(result.items);
      setRowCount(result.itemCount);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError : new Error(String(loadError)),
      );
    } finally {
      setIsLoading(false);
    }
  }, [filterModel, getMany, paginationModel, sortModel]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => void loadData(), 100);
    return () => clearTimeout(timeoutId);
  }, [loadData]);

  const handlePaginationChange = React.useCallback(
    (model: GridPaginationModel) => {
      setPaginationModel(model);
      const params = new URLSearchParams(searchParams);
      params.set("page", String(model.page));
      params.set("pageSize", String(model.pageSize));
      updateSearchParams(params);
    },
    [searchParams, updateSearchParams],
  );

  const handleFilterChange = React.useCallback(
    (model: GridFilterModel) => {
      setFilterModel(model);
      setPaginationModel((current) => ({ ...current, page: 0 }));
      const params = new URLSearchParams(searchParams);
      params.set("page", "0");
      if (
        model.items.length > 0 ||
        (model.quickFilterValues && model.quickFilterValues.length > 0)
      ) {
        params.set("filter", JSON.stringify(model));
      } else {
        params.delete("filter");
      }
      updateSearchParams(params);
    },
    [searchParams, updateSearchParams],
  );

  const handleSortChange = React.useCallback(
    (model: GridSortModel) => {
      setSortModel(model);
      const params = new URLSearchParams(searchParams);
      if (model.length > 0) {
        params.set("sort", JSON.stringify(model));
      } else {
        params.delete("sort");
      }
      updateSearchParams(params);
    },
    [searchParams, updateSearchParams],
  );

  return (
    <PageContainer
      title={title}
      breadcrumbs={[{ title }]}
      actions={
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Tooltip title="Actualiser" placement="right" enterDelay={1000}>
            <span>
              <IconButton
                size="small"
                aria-label="Actualiser"
                onClick={() => void loadData()}
                disabled={isLoading}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={createLabel} placement="bottom">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(createPath)}
            >
              {createLabel}
            </Button>
          </Tooltip>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        {error ? (
          <Alert severity="error">{error.message}</Alert>
        ) : (
          <DataGrid
            rows={rows as object[]}
            rowCount={rowCount}
            columns={columns}
            getRowId={(row) => String(row[String(idField)])}
            pagination
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            sortModel={sortModel}
            onSortModelChange={handleSortChange}
            filterModel={filterModel}
            onFilterModelChange={handleFilterChange}
            disableRowSelectionOnClick
            loading={isLoading}
            showToolbar
            pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: "transparent",
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
                {
                  outline: "none",
                },
            }}
            slotProps={{
              loadingOverlay: {
                variant: "circular-progress",
                noRowsVariant: "circular-progress",
              },
              baseIconButton: { size: "small" },
            }}
          />
        )}
      </Box>
    </PageContainer>
  );
}

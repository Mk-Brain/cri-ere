import type { CollectionQuery } from "../types/CollectionTypes";

function compareValues(left: unknown, right: unknown): number {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  return String(left ?? "").localeCompare(String(right ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function matchesFilter<T extends object>(
  row: T,
  field: string,
  operator: string,
  value: unknown,
): boolean {
  const rowValue = (row as unknown as Record<string, unknown>)[field];
  const comparison = compareValues(rowValue, value);
  const normalizedValue = String(value ?? "").toLowerCase();
  const normalizedRowValue = String(rowValue ?? "").toLowerCase();

  switch (operator) {
    case "contains":
      return normalizedRowValue.includes(normalizedValue);
    case "equals":
    case "is":
    case "=":
      return comparison === 0;
    case "not":
    case "doesNotEqual":
    case "!=":
      return comparison !== 0;
    case "startsWith":
      return normalizedRowValue.startsWith(normalizedValue);
    case "endsWith":
      return normalizedRowValue.endsWith(normalizedValue);
    case ">":
      return comparison > 0;
    case ">=":
      return comparison >= 0;
    case "<":
      return comparison < 0;
    case "<=":
      return comparison <= 0;
    case "isEmpty":
      return rowValue == null || rowValue === "";
    case "isNotEmpty":
      return rowValue != null && rowValue !== "";
    case "isAnyOf":
      return (
        Array.isArray(value) &&
        value.some((item) => compareValues(rowValue, item) === 0)
      );
    default:
      return true;
  }
}

export function createLocalCollection<T extends object, K extends keyof T>(
  initialRows: T[],
  idField: K,
) {
  let rows = initialRows.map((row) => ({ ...row }));

  return {
    getAll(): T[] {
      return rows.map((row) => ({ ...row }));
    },

    setAll(nextRows: T[]): void {
      rows = nextRows.map((row) => ({ ...row }));
    },

    async getMany({
      paginationModel,
      sortModel,
      filterModel,
    }: CollectionQuery): Promise<{ items: T[]; itemCount: number }> {
      let filteredRows = rows.map((row) => ({ ...row }));
      const activeFilters = filterModel.items.filter(
        ({ field, operator, value }) =>
          field &&
          operator &&
          (value != null ||
            operator === "isEmpty" ||
            operator === "isNotEmpty"),
      );

      if (activeFilters.length > 0) {
        const useOr = String(filterModel.logicOperator).toLowerCase() === "or";
        filteredRows = filteredRows.filter((row) => {
          const matches = activeFilters.map(({ field, operator, value }) =>
            matchesFilter(row, field, operator, value),
          );
          return useOr ? matches.some(Boolean) : matches.every(Boolean);
        });
      }

      const quickFilterValues = (filterModel.quickFilterValues ?? [])
        .map((value) => String(value).trim().toLowerCase())
        .filter(Boolean);
      if (quickFilterValues.length > 0) {
        filteredRows = filteredRows.filter((row) => {
          const values = Object.values(
            row as unknown as Record<string, unknown>,
          )
            .filter(
              (value) =>
                value == null ||
                ["string", "number", "boolean"].includes(typeof value),
            )
            .map((value) => String(value ?? "").toLowerCase());

          return quickFilterValues.every((query) =>
            values.some((value) => value.includes(query)),
          );
        });
      }

      if (sortModel.length > 0) {
        filteredRows.sort((left, right) => {
          for (const { field, sort } of sortModel) {
            const leftValue = (left as unknown as Record<string, unknown>)[
              field
            ];
            const rightValue = (right as unknown as Record<string, unknown>)[
              field
            ];
            const comparison = compareValues(leftValue, rightValue);
            if (comparison !== 0) {
              return sort === "asc" ? comparison : -comparison;
            }
          }
          return 0;
        });
      }

      const start = paginationModel.page * paginationModel.pageSize;
      return {
        items: filteredRows.slice(start, start + paginationModel.pageSize),
        itemCount: filteredRows.length,
      };
    },

    async getOne(id: number): Promise<T> {
      const row = rows.find((item) => Number(item[idField]) === id);
      if (!row) throw new Error("Record not found");
      return { ...row };
    },

    async createOne(data: Omit<T, K>): Promise<T> {
      const nextId =
        rows.reduce((max, row) => Math.max(max, Number(row[idField]) || 0), 0) +
        1;
      const created = { ...data, [idField]: nextId } as T;
      rows = [...rows, created];
      return { ...created };
    },

    async updateOne(id: number, data: Partial<Omit<T, K>>): Promise<T> {
      let updated: T | undefined;
      rows = rows.map((row) => {
        if (Number(row[idField]) !== id) return row;
        updated = { ...row, ...data };
        return updated;
      });
      if (!updated) throw new Error("Record not found");
      return { ...updated };
    },

    async deleteOne(id: number): Promise<void> {
      rows = rows.filter((row) => Number(row[idField]) !== id);
    },
  };
}

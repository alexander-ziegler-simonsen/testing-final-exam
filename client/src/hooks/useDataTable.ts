import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface ColumnConfig<T> {
    key: keyof T & string;
    header: string;
    enableSearch?: boolean;
    // Set to false to disable sorting for this column (e.g. an actions
    // column with no comparable value). Defaults to true.
    enableSort?: boolean;
    // Allows rendering custom components/elements for specific cells
    render?: (value: T[keyof T], item: T) => ReactNode;
    // Value to sort/filter by, for columns whose raw value (e.g. a nested
    // object) can't be compared directly. Falls back to the raw field value.
    sortValue?: (item: T) => string | number | Date | null | undefined;
}

type SortOrder = "asc" | "desc" | null;

interface UseDataTableOptions<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    pageSize: number;
    // Options offered in the "rows per page" selector. Defaults to a set of
    // common sizes, always including the initial `pageSize`.
    pageSizeOptions?: number[];
}

// Owns filter/sort/pagination state and derives the filtered, sorted,
// paginated rows a DataTable renders. Kept separate from the JSX so each can
// be read (and tested) on its own.
export function useDataTable<T>({ data, columns, pageSize, pageSizeOptions }: UseDataTableOptions<T>) {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);
    const [currentPage, setCurrentPage] = useState(1);
    // Rows-per-page is user-adjustable at runtime; `pageSize` prop is only
    // the initial value.
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);

    const rowsPerPageOptions = useMemo(() => {
        const options = new Set(pageSizeOptions ?? [5, 10, 25, 50]);
        options.add(pageSize);
        return [...options].sort((a, b) => a - b);
    }, [pageSizeOptions, pageSize]);

    const changeRowsPerPage = (value: number) => {
        setRowsPerPage(value);
        setCurrentPage(1); // Reset to page 1 so it stays in range for the new page size.
    };

    const setFilter = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to page 1 on search
    };

    const toggleSort = (key: keyof T) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortOrder("asc");
            return;
        }
        if (sortOrder === "asc") {
            setSortOrder("desc");
            return;
        }
        setSortOrder(null);
        setSortKey(null);
    };

    // Columns whose raw field value isn't directly comparable (e.g. a nested
    // object) can supply `sortValue` to opt into filtering/sorting.
    const getComparableValue = useCallback(
        (key: string, item: T) => {
            const column = columns.find((c) => c.key === key);
            return column?.sortValue ? column.sortValue(item) : item[key as keyof T];
        },
        [columns],
    );

    const filteredData = useMemo(() => {
        return data.filter((item) =>
            Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                return String(getComparableValue(key, item)).toLowerCase().includes(filterValue.toLowerCase());
            }),
        );
    }, [data, filters, getComparableValue]);

    const sortedData = useMemo(() => {
        if (!sortKey || !sortOrder) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = getComparableValue(sortKey as string, a);
            const bVal = getComparableValue(sortKey as string, b);

            if (aVal == null && bVal == null) return 0;
            if (aVal == null) return sortOrder === "asc" ? -1 : 1;
            if (bVal == null) return sortOrder === "asc" ? 1 : -1;

            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortOrder, getComparableValue]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return sortedData.slice(start, start + rowsPerPage);
    }, [sortedData, currentPage, rowsPerPage]);

    return {
        filters,
        setFilter,
        sortKey,
        sortOrder,
        toggleSort,
        currentPage,
        setCurrentPage,
        rowsPerPage,
        setRowsPerPage: changeRowsPerPage,
        rowsPerPageOptions,
        filteredData,
        paginatedData,
    };
}

import React, { useCallback, useState, useMemo } from "react";
import { Table, Input, Stack, HStack, IconButton, NativeSelect, Text, Pagination } from "@chakra-ui/react";
// Assumes Lucide icons are bundled with Chakra UI v3, swap with your preferred icons if needed
import { LuArrowUpDown, LuArrowUp, LuArrowDown, LuChevronLeft, LuChevronRight } from "react-icons/lu";

export interface ColumnConfig<T> {
    key: keyof T & string;
    header: string;
    enableSearch?: boolean;
    // Allows rendering custom components/elements for specific cells
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    // Value to sort/filter by, for columns whose raw value (e.g. a nested
    // object) can't be compared directly. Falls back to the raw field value.
    sortValue?: (item: T) => string | number | Date | null | undefined;
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    pageSize?: number;
    // Options offered in the "rows per page" selector. Defaults to a set of
    // common sizes, always including the initial `pageSize`.
    pageSizeOptions?: number[];
    // Called when a row is clicked. When provided, rows show a pointer cursor.
    onRowClick?: (item: T) => void;
    // Prefix used to build data-testid values for this table instance. Pass a
    // unique value per usage so tests can tell tables apart when more than
    // one is rendered on the same page (e.g. "patients-table").
    testId?: string;
}

type SortOrder = "asc" | "desc" | null;

export function DataTable<T>({ data, columns, pageSize = 5, pageSizeOptions, onRowClick, testId = "data-table" }: DataTableProps<T>) {
    // States for Filter, Sort, Pagination
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

    const handleRowsPerPageChange = (value: number) => {
        setRowsPerPage(value);
        setCurrentPage(1);
    };

    // 1. Handle Filtering
    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1); // Reset to page 1 on search
    };

    // 2. Handle Sorting Toggle
    const handleSort = (key: keyof T) => {
        if (sortKey === key) {
            if (sortOrder === "asc") setSortOrder("desc");
            else if (sortOrder === "desc") {
                setSortOrder(null);
                setSortKey(null);
            }
        } else {
            setSortKey(key);
            setSortOrder("asc");
        }
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

    // 3. Process Data (Filter -> Sort -> Paginate)
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                const itemValue = getComparableValue(key, item);
                return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
            });
        });
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

    return (
        <Stack width="full" gap="4" data-testid={testId}>
            {/* Table Container */}
            <Table.Root variant="line" size="md" interactive data-testid={`${testId}-table`}>
                <Table.Header>
                    <Table.Row>
                        {columns.map((col) => (
                            <Table.ColumnHeader key={col.key} paddingY="3" data-testid={`${testId}-header-${col.key}`}>
                                <Stack gap="2" align="start">
                                    {/* Sort Trigger Header */}
                                    <HStack cursor="pointer" onClick={() => handleSort(col.key)} userSelect="none" width="full" justify="space-between" data-testid={`${testId}-sort-${col.key}`}>
                                        <Text fontWeight="semibold">{col.header}</Text>
                                        <IconButton variant="ghost" size="xs" aria-label="Sort">
                                            {sortKey !== col.key && <LuArrowUpDown />}
                                            {sortKey === col.key && sortOrder === "asc" && <LuArrowUp />}
                                            {sortKey === col.key && sortOrder === "desc" && <LuArrowDown />}
                                        </IconButton>
                                    </HStack>

                                    {/* Header Column Search input */}
                                    {col.enableSearch && (
                                        <Input placeholder={`Search ${col.header}...`} size="xs" value={filters[col.key] || ""} onChange={(e) => handleFilterChange(col.key, e.target.value)} onClick={(e) => e.stopPropagation()} // Stop sorting trigger when clicking input
                                            data-testid={`${testId}-search-${col.key}`}
                                        />
                                    )}
                                </Stack>
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, rowIndex) => (
                            <Table.Row
                                key={rowIndex}
                                data-testid={`${testId}-row-${rowIndex}`}
                                onClick={() => onRowClick?.(item)}
                                cursor={onRowClick ? "pointer" : undefined}
                                _hover={onRowClick ? { bg: "gray.50" } : undefined}
                            >
                                {columns.map((col) => (
                                    <Table.Cell key={col.key} data-testid={`${testId}-row-${rowIndex}-cell-${col.key}`}>
                                        {col.render ? col.render(item[col.key], item) : String(item[col.key])
                                        }
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        ))
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={columns.length} textAlign="center" paddingY="6" data-testid={`${testId}-empty-state`}>
                                No matching records found.
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>

            {/* Rows-per-page + Chakra v3 Native Pagination Integration */}
            <HStack justify="space-between" width="full" pt="2" flexWrap="wrap" gap="4">
                <HStack data-testid={`${testId}-page-size`}>
                    <Text fontSize="sm" color="fg.muted">Rows per page</Text>
                    <NativeSelect.Root size="sm" width="auto">
                        <NativeSelect.Field
                            data-testid={`${testId}-page-size-select`}
                            value={rowsPerPage}
                            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                        >
                            {rowsPerPageOptions.map((size) => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </HStack>

                {filteredData.length > rowsPerPage && (
                    <HStack data-testid={`${testId}-pagination`}>
                        <Pagination.Root count={filteredData.length} pageSize={rowsPerPage} page={currentPage} onPageChange={(details) => setCurrentPage(details.page)}>
                            <HStack>
                                <Pagination.PrevTrigger asChild data-testid={`${testId}-pagination-prev`}>
                                    <IconButton variant="outline" size="sm" aria-label="Previous page">
                                        <LuChevronLeft />
                                    </IconButton>
                                </Pagination.PrevTrigger>

                                {/* Explicit loop fallback for v3 */}
                                <Pagination.Context>
                                    {({ pages }) =>
                                        pages.map((page, index) =>
                                            page.type === "page"
                                                ? (
                                                    <Pagination.Item
                                                        key={index}
                                                        {...page}
                                                        asChild
                                                        data-testid={`${testId}-pagination-page-${page.value}`}
                                                    >
                                                        <IconButton variant={page.value === currentPage ? "solid" : "outline"} size="sm" aria-label={`Page ${page.value}`}>
                                                            {page.value}
                                                        </IconButton>
                                                    </Pagination.Item>
                                                )
                                                : (<Pagination.Ellipsis key={index} index={index} px="2">{"…"}</Pagination.Ellipsis>))
                                    }
                                </Pagination.Context>

                                <Pagination.NextTrigger asChild data-testid={`${testId}-pagination-next`}>
                                    <IconButton variant="outline" size="sm" aria-label="Next page">
                                        <LuChevronRight />
                                    </IconButton>
                                </Pagination.NextTrigger>
                            </HStack>
                        </Pagination.Root>
                    </HStack>
                )}
            </HStack>
        </Stack>
    );
}

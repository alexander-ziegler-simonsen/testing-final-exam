import React, { useState, useMemo } from "react";
import { Table, Input, Stack, HStack, IconButton, Text, Pagination } from "@chakra-ui/react";
// Assumes Lucide icons are bundled with Chakra UI v3, swap with your preferred icons if needed
import { LuArrowUpDown, LuArrowUp, LuArrowDown } from "react-icons/lu";

export interface ColumnConfig<T> {
    key: keyof T & string;
    header: string;
    enableSearch?: boolean;
    // Allows rendering custom components/elements for specific cells
    render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: ColumnConfig<T>[];
    pageSize?: number;
    // Called when a row is clicked. When provided, rows show a pointer cursor.
    onRowClick?: (item: T) => void;
    // Prefix used to build data-testid values for this table instance. Pass a
    // unique value per usage so tests can tell tables apart when more than
    // one is rendered on the same page (e.g. "patients-table").
    testId?: string;
}

type SortOrder = "asc" | "desc" | null;

export function DataTable<T>({ data, columns, pageSize = 5, onRowClick, testId = "data-table" }: DataTableProps<T>) {
    // States for Filter, Sort, Pagination
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);
    const [currentPage, setCurrentPage] = useState(1);

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

    // 3. Process Data (Filter -> Sort -> Paginate)
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                const itemValue = item[key as keyof T];
                return String(itemValue).toLowerCase().includes(filterValue.toLowerCase());
            });
        });
    }, [data, filters]);

    const sortedData = useMemo(() => {
        if (!sortKey || !sortOrder) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortOrder]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

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

            {/* Chakra v3 Native Pagination Integration */}
            {filteredData.length > pageSize && (
                <HStack justify="center" width="full" pt="2" data-testid={`${testId}-pagination`}>
                    <Pagination.Root count={filteredData.length} pageSize={pageSize} page={currentPage} onPageChange={(details) => setCurrentPage(details.page)}>
                        <HStack>
                            <Pagination.PrevTrigger data-testid={`${testId}-pagination-prev`} />

                            {/* Explicit loop fallback for v3 */}
                            <Pagination.Context>
                                {({ pages }) =>
                                    pages.map((page, index) =>
                                        page.type === "page"
                                            ? (<Pagination.Item key={index} {...page} data-testid={`${testId}-pagination-page-${page.value}`} />)
                                            : (<Pagination.Ellipsis key={index} index={index} />))
                                }
                            </Pagination.Context>

                            <Pagination.NextTrigger data-testid={`${testId}-pagination-next`} />
                        </HStack>
                    </Pagination.Root>
                </HStack>
            )}
        </Stack>
    );
}

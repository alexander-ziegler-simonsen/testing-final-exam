import { Box, Input, Table } from "@chakra-ui/react"

interface Props {
    col: string
    label: string
    sortBy: string
    sortDir: 'asc' | 'desc'
    onSort: (col: string) => void
    filterValue?: string
    onFilter?: (col: string, value: string) => void
}

export default function SortHeader({ col, label, sortBy, sortDir, onSort, filterValue, onFilter }: Props) {
    const active = sortBy === col
    return (
        <Table.ColumnHeader style={{ verticalAlign: "top" }}>
            <Box
                cursor="pointer"
                userSelect="none"
                onClick={() => onSort(col)}
                mb={onFilter ? 1 : 0}
                whiteSpace="nowrap"
            >
                {label}{active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
            </Box>
            {onFilter && (
                <Input
                    size="xs"
                    value={filterValue ?? ''}
                    onChange={e => onFilter(col, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    placeholder="Search…"
                />
            )}
        </Table.ColumnHeader>
    )
}

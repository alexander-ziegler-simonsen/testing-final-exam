import { Table, Text } from "@chakra-ui/react"
import type { MedicationStorage } from "../entites/MedicationStorage"
import type { Medication } from "../entites/Medication"

interface Props {
    storages: MedicationStorage[]
    medications: Medication[]
}

function medicationName(medications: Medication[], id: number) {
    const med = medications.find(m => m.id === id)
    return med?.name ?? `Medication #${id}`
}

export default function MedicationStorageTable({ storages, medications }: Props) {
    if (storages.length === 0) return <Text color="gray.500">No storage entries found.</Text>

    return (
        <Table.Root size="sm">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Storage ID</Table.ColumnHeader>
                    <Table.ColumnHeader>Medication</Table.ColumnHeader>
                    <Table.ColumnHeader>Amount in Stock</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {storages.map(s => (
                    <Table.Row key={s.id}>
                        <Table.Cell>{s.id}</Table.Cell>
                        <Table.Cell>{medicationName(medications, s.fkMedicationId)}</Table.Cell>
                        <Table.Cell>{s.amount}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )
}

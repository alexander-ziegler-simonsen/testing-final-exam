import { Table, Text } from "@chakra-ui/react"
import type { MedicationStorage } from "../entites/MedicationStorage"
import type { Medication } from "../entites/Medication"

interface Props {
    storages: MedicationStorage[]
    medications: Medication[]
}

function medicationName(medications: Medication[], id: number) {
    const med = medications.find(medication => medication.id === id)
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
                {storages.map(storageEntry => (
                    <Table.Row key={storageEntry.id}>
                        <Table.Cell>{storageEntry.id}</Table.Cell>
                        <Table.Cell>{medicationName(medications, storageEntry.fkMedicationId)}</Table.Cell>
                        <Table.Cell>{storageEntry.amount}</Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    )
}

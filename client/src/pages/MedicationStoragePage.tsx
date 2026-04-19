import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Spinner, Table, Text } from "@chakra-ui/react"
import { storageService } from "../services/StorageService"
import { medicationService } from "../services/MedicationService"
import { missingStorageService } from "../services/MissingStorageService"
import MedicationStorageTable from "../components/MedicationStorageTable"
import ReportMissingForm from "../components/ReportMissingForm"
import type { MedicationStorage } from "../entites/MedicationStorage"
import type { Medication } from "../entites/Medication"
import type { MedicationStorageMissing } from "../entites/MedicationStorageMissing"

const fmt = (d: string) => new Date(d).toLocaleString()

export default function MedicationStoragePage() {
    const [storages, setStorages] = useState<MedicationStorage[]>([])
    const [medications, setMedications] = useState<Medication[]>([])
    const [missingReports, setMissingReports] = useState<MedicationStorageMissing[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [showMissing, setShowMissing] = useState(false)

    useEffect(() => {
        Promise.all([
            storageService.getAll(),
            medicationService.getAll(),
            missingStorageService.getAll(),
        ])
            .then(([s, m, ms]) => {
                setStorages(s)
                setMedications(m)
                setMissingReports(ms)
            })
            .catch(() => setLoadError("Failed to load medication storage data."))
            .finally(() => setLoading(false))
    }, [])

    function medicationName(storageId: number) {
        const storage = storages.find(s => s.id === storageId)
        if (!storage) return `Storage #${storageId}`
        const med = medications.find(m => m.id === storage.fkMedicationId)
        return med?.name ?? `Medication #${storage.fkMedicationId}`
    }

    if (loading) return <Box p={8}><Spinner /></Box>
    if (loadError) return <Box p={8}><Text color="red.500">{loadError}</Text></Box>

    return (
        <Box p={8}>
            <Heading mb={6}>Medication Storage</Heading>

            {/* Storage overview */}
            <Box mb={8}>
                <Heading size="md" mb={4}>Current Stock</Heading>
                <MedicationStorageTable storages={storages} medications={medications} />
            </Box>

            {/* Report missing form */}
            <ReportMissingForm
                storages={storages}
                medications={medications}
                onReported={entry => setMissingReports(prev => [...prev, entry])}
            />

            {/* Missing reports */}
            <HStack mb={3} justify="space-between" align="center">
                <Heading size="md">Missing Reports ({missingReports.length})</Heading>
                <Button size="sm" variant="outline" onClick={() => setShowMissing(v => !v)}>
                    {showMissing ? "Hide" : "Show"}
                </Button>
            </HStack>

            {showMissing && (
                missingReports.length === 0 ? (
                    <Text color="gray.500">No missing reports yet.</Text>
                ) : (
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Medication</Table.ColumnHeader>
                                <Table.ColumnHeader>Amount Missing</Table.ColumnHeader>
                                <Table.ColumnHeader>Reported At</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {missingReports.map(r => (
                                <Table.Row key={r.id}>
                                    <Table.Cell>{r.id}</Table.Cell>
                                    <Table.Cell>{medicationName(r.fkMedicationStorageId)}</Table.Cell>
                                    <Table.Cell>{r.amountMissing}</Table.Cell>
                                    <Table.Cell>{fmt(r.wentMissingAt)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )
            )}
        </Box>
    )
}

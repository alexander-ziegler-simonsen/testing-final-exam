import { useState } from "react"
import { Box, Button, Heading, Input, Spinner, Text, VStack } from "@chakra-ui/react"
import { missingStorageService } from "../services/MissingStorageService"
import type { MedicationStorage } from "../entites/MedicationStorage"
import type { Medication } from "../entites/Medication"
import type { MedicationStorageMissing } from "../entites/MedicationStorageMissing"

interface Props {
    storages: MedicationStorage[]
    medications: Medication[]
    onReported: (newEntry: MedicationStorageMissing) => void
}

function localDateTimeNow() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
}

const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    background: "white",
}

export default function ReportMissingForm({ storages, medications, onReported }: Props) {
    const [storageId, setStorageId] = useState<number | "">("")
    const [amount, setAmount] = useState("")
    const [wentMissingAt, setWentMissingAt] = useState(localDateTimeNow)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState(false)

    function medicationLabel(storageEntry: MedicationStorage) {
        const med = medications.find(medication => medication.id === storageEntry.fkMedicationId)
        const name = med?.name ?? `Medication #${storageEntry.fkMedicationId}`
        return `${name} (Storage #${storageEntry.id}, stock: ${storageEntry.amount})`
    }

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        if (storageId === "" || !amount) return

        const amountNum = parseFloat(amount)
        if (isNaN(amountNum) || amountNum <= 0) {
            setFormError("Amount missing must be a positive number.")
            return
        }

        setSubmitting(true)
        setFormError(null)
        setFormSuccess(false)

        try {
            await missingStorageService.create({
                fkMedicationStorageId: storageId as number,
                amountMissing: amountNum,
                wentMissingAt: new Date(wentMissingAt).toISOString(),
            })
            const all = await missingStorageService.getAll()
            const latest = all.at(-1)
            if (latest) onReported(latest)
            setFormSuccess(true)
            setStorageId("")
            setAmount("")
            setWentMissingAt(localDateTimeNow())
        } catch {
            setFormError("Failed to report missing medicine. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Box borderWidth={1} borderRadius="lg" p={6} mb={8}>
            <Heading size="md" mb={4}>Report Missing Medicine</Heading>
            <form onSubmit={handleSubmit}>
                <VStack align="stretch" gap={4}>
                    <Box>
                        <Text fontWeight="medium" fontSize="sm" mb={1}>Medication Storage</Text>
                        <select
                            value={storageId}
                            onChange={event => {
                                setStorageId(event.target.value === "" ? "" : Number(event.target.value))
                                setFormError(null)
                                setFormSuccess(false)
                            }}
                            required
                            style={selectStyle}
                        >
                            <option value="">Select a storage entry…</option>
                            {storages.map(storageEntry => (
                                <option key={storageEntry.id} value={storageEntry.id}>
                                    {medicationLabel(storageEntry)}
                                </option>
                            ))}
                        </select>
                    </Box>

                    <Box>
                        <Text fontWeight="medium" fontSize="sm" mb={1}>Amount Missing</Text>
                        <Input type="number" min="0.01" step="any" placeholder="e.g. 5" value={amount} 
                            onChange={event => {
                                setAmount(event.target.value)
                                setFormError(null)
                                setFormSuccess(false)
                            }}
                            required
                        />
                    </Box>

                    <Box>
                        <Text fontWeight="medium" fontSize="sm" mb={1}>Went Missing At</Text>
                        <Input type="datetime-local" value={wentMissingAt} onChange={event => setWentMissingAt(event.target.value)} required />
                    </Box>

                    {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                    {formSuccess && <Text color="green.500" fontSize="sm">Missing medicine reported successfully.</Text>}

                    <Button type="submit" bg="orange.500" color="white" disabled={submitting || storageId === ""} alignSelf="flex-start">
                        {submitting ? <Spinner size="sm" /> : "Report Missing"}
                    </Button>
                </VStack>
            </form>
        </Box>
    )
}

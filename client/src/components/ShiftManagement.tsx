import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Text, VStack } from "@chakra-ui/react"
import { shiftService, type ShiftInput } from "../services/ShiftService"
import type { Shift } from "../entites/Shift"

const fmt = (d: string) => new Date(d).toLocaleString()

function toLocalInput(iso: string) {
    const d = new Date(iso)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 16)
}

function localDateTimeNow() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
}

function localDateTimeHourLater() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    now.setHours(now.getHours() + 8)
    return now.toISOString().slice(0, 16)
}

const emptyForm = (): ShiftInput => ({ startTime: localDateTimeNow(), endTime: localDateTimeHourLater() })

export default function ShiftManagement() {
    const [shifts, setShifts] = useState<Shift[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    const [editing, setEditing] = useState<Shift | null>(null)
    const [form, setForm] = useState<ShiftInput>(emptyForm())
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)

    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        shiftService.getAll()
            .then(setShifts)
            .catch(() => setLoadError("Failed to load shifts."))
            .finally(() => setLoading(false))
    }, [])

    function startEdit(s: Shift) {
        setEditing(s)
        setForm({ startTime: toLocalInput(s.startTime), endTime: toLocalInput(s.endTime) })
        setFormError(null)
        setFormSuccess(null)
    }

    function cancelEdit() {
        setEditing(null)
        setForm(emptyForm())
        setFormError(null)
        setFormSuccess(null)
    }

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        if (new Date(form.startTime) >= new Date(form.endTime)) {
            setFormError("End time must be after start time.")
            return
        }

        setSubmitting(true)
        setFormError(null)
        setFormSuccess(null)

        const payload: ShiftInput = {
            startTime: new Date(form.startTime).toISOString(),
            endTime: new Date(form.endTime).toISOString(),
        }

        try {
            if (editing) {
                await shiftService.update(editing.id, payload)
                setShifts(prev => prev.map(s => s.id === editing.id ? { ...s, ...payload } : s))
                setFormSuccess("Shift updated.")
            } else {
                await shiftService.create(payload)
                const updated = await shiftService.getAll()
                setShifts(updated)
                setFormSuccess("Shift created.")
            }
            setEditing(null)
            setForm(emptyForm())
        } catch {
            setFormError(editing ? "Failed to update shift." : "Failed to create shift.")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await shiftService.delete(id)
            setShifts(prev => prev.filter(s => s.id !== id))
        } catch {
            setDeleteError("Failed to delete shift.")
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) return <Box p={4}><Spinner /></Box>
    if (loadError) return <Box p={4}><Text color="red.500">{loadError}</Text></Box>

    return (
        <Box>
            {/* Form */}
            <Box borderWidth={1} borderRadius="lg" p={6} mb={6}>
                <Heading size="sm" mb={4}>
                    {editing ? `Editing shift #${editing.id}` : "Add Shift"}
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={3}>
                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Start</Text>
                                <Input
                                    type="datetime-local"
                                    value={form.startTime}
                                    onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                                    required
                                />
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>End</Text>
                                <Input
                                    type="datetime-local"
                                    value={form.endTime}
                                    onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                                    required
                                />
                            </Box>
                        </HStack>

                        {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                        {formSuccess && <Text color="green.500" fontSize="sm">{formSuccess}</Text>}

                        <HStack gap={3}>
                            <Button type="submit" bg="blue.500" color="white" disabled={submitting}>
                                {submitting ? <Spinner size="sm" /> : editing ? "Save Changes" : "Add Shift"}
                            </Button>
                            {editing && (
                                <Button type="button" variant="outline" onClick={cancelEdit} disabled={submitting}>
                                    Cancel
                                </Button>
                            )}
                        </HStack>
                    </VStack>
                </form>
            </Box>

            {/* Table */}
            {deleteError && <Text color="red.500" fontSize="sm" mb={2}>{deleteError}</Text>}
            {shifts.length === 0 ? (
                <Text color="gray.500">No shifts yet.</Text>
            ) : (
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Start</Table.ColumnHeader>
                            <Table.ColumnHeader>End</Table.ColumnHeader>
                            <Table.ColumnHeader />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {shifts.map(s => (
                            <Table.Row key={s.id} bg={editing?.id === s.id ? "blue.50" : undefined}>
                                <Table.Cell>{s.id}</Table.Cell>
                                <Table.Cell>{fmt(s.startTime)}</Table.Cell>
                                <Table.Cell>{fmt(s.endTime)}</Table.Cell>
                                <Table.Cell>
                                    <HStack gap={2} justify="flex-end">
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            onClick={() => startEdit(s)}
                                            disabled={deletingId === s.id}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="xs"
                                            colorPalette="red"
                                            variant="outline"
                                            disabled={deletingId === s.id}
                                            onClick={() => handleDelete(s.id)}
                                        >
                                            {deletingId === s.id ? <Spinner size="xs" /> : "Delete"}
                                        </Button>
                                    </HStack>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </Box>
    )
}

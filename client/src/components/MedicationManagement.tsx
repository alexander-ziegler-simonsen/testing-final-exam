import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Text, Textarea, VStack } from "@chakra-ui/react"
import { medicationService, type MedicationInput } from "../services/MedicationService"
import type { Medication } from "../entites/Medication"

const emptyForm = (): MedicationInput => ({
    name: "",
    genericName: "",
    brand: "",
    form: "",
    strength: "",
    category: "",
    description: "",
})

export default function MedicationManagement() {
    const [medications, setMedications] = useState<Medication[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    const [editing, setEditing] = useState<Medication | null>(null)
    const [form, setForm] = useState<MedicationInput>(emptyForm())
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)

    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        medicationService.getAll()
            .then(setMedications)
            .catch(() => setLoadError("Failed to load medications."))
            .finally(() => setLoading(false))
    }, [])

    function startEdit(m: Medication) {
        setEditing(m)
        setForm({
            name: m.name ?? "",
            genericName: m.genericName ?? "",
            brand: m.brand ?? "",
            form: m.form ?? "",
            strength: m.strength ?? "",
            category: m.category ?? "",
            description: m.description ?? "",
        })
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
        if (!form.name?.trim()) {
            setFormError("Medication name is required.")
            return
        }

        setSubmitting(true)
        setFormError(null)
        setFormSuccess(null)

        try {
            if (editing) {
                await medicationService.update(editing.id, form)
                setMedications(prev => prev.map(m => m.id === editing.id ? { ...m, ...form } : m))
                setFormSuccess("Medication updated.")
            } else {
                await medicationService.create(form)
                const updated = await medicationService.getAll()
                setMedications(updated)
                setFormSuccess("Medication created.")
            }
            setEditing(null)
            setForm(emptyForm())
        } catch {
            setFormError(editing ? "Failed to update medication." : "Failed to create medication.")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await medicationService.delete(id)
            setMedications(prev => prev.filter(m => m.id !== id))
        } catch {
            setDeleteError("Failed to delete medication.")
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
                    {editing ? `Editing: ${editing.name ?? `#${editing.id}`}` : "Add Medication"}
                </Heading>
                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={3}>
                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Name *</Text>
                                <Input
                                    value={form.name ?? ""}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Paracetamol"
                                    required
                                />
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Generic Name</Text>
                                <Input
                                    value={form.genericName ?? ""}
                                    onChange={e => setForm(f => ({ ...f, genericName: e.target.value }))}
                                    placeholder="e.g. Acetaminophen"
                                />
                            </Box>
                        </HStack>

                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Brand</Text>
                                <Input
                                    value={form.brand ?? ""}
                                    onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                                    placeholder="e.g. Panodil"
                                />
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Category</Text>
                                <Input
                                    value={form.category ?? ""}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    placeholder="e.g. Analgesic"
                                />
                            </Box>
                        </HStack>

                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Form</Text>
                                <Input
                                    value={form.form ?? ""}
                                    onChange={e => setForm(f => ({ ...f, form: e.target.value }))}
                                    placeholder="e.g. Tablet"
                                />
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Strength</Text>
                                <Input
                                    value={form.strength ?? ""}
                                    onChange={e => setForm(f => ({ ...f, strength: e.target.value }))}
                                    placeholder="e.g. 500mg"
                                />
                            </Box>
                        </HStack>

                        <Box>
                            <Text fontWeight="medium" fontSize="sm" mb={1}>Description</Text>
                            <Textarea
                                value={form.description ?? ""}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Optional notes"
                                rows={2}
                            />
                        </Box>

                        {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                        {formSuccess && <Text color="green.500" fontSize="sm">{formSuccess}</Text>}

                        <HStack gap={3}>
                            <Button type="submit" bg="blue.500" color="white" disabled={submitting}>
                                {submitting ? <Spinner size="sm" /> : editing ? "Save Changes" : "Add Medication"}
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
            {medications.length === 0 ? (
                <Text color="gray.500">No medications yet.</Text>
            ) : (
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Generic Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Brand</Table.ColumnHeader>
                            <Table.ColumnHeader>Category</Table.ColumnHeader>
                            <Table.ColumnHeader>Form</Table.ColumnHeader>
                            <Table.ColumnHeader>Strength</Table.ColumnHeader>
                            <Table.ColumnHeader />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {medications.map(m => (
                            <Table.Row key={m.id} bg={editing?.id === m.id ? "blue.50" : undefined}>
                                <Table.Cell>{m.id}</Table.Cell>
                                <Table.Cell>{m.name ?? "—"}</Table.Cell>
                                <Table.Cell>{m.genericName ?? "—"}</Table.Cell>
                                <Table.Cell>{m.brand ?? "—"}</Table.Cell>
                                <Table.Cell>{m.category ?? "—"}</Table.Cell>
                                <Table.Cell>{m.form ?? "—"}</Table.Cell>
                                <Table.Cell>{m.strength ?? "—"}</Table.Cell>
                                <Table.Cell>
                                    <HStack gap={2} justify="flex-end">
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            onClick={() => startEdit(m)}
                                            disabled={deletingId === m.id}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="xs"
                                            colorPalette="red"
                                            variant="outline"
                                            disabled={deletingId === m.id}
                                            onClick={() => handleDelete(m.id)}
                                        >
                                            {deletingId === m.id ? <Spinner size="xs" /> : "Delete"}
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

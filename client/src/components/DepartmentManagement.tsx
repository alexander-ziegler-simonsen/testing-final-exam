import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Text, VStack } from "@chakra-ui/react"
import { departmentService, type DepartmentInput } from "../services/DepartmentService"
import type { Department } from "../entites/Department"

const emptyForm = (): DepartmentInput => ({ name: "", type: "" })

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    const [editing, setEditing] = useState<Department | null>(null)
    const [form, setForm] = useState<DepartmentInput>(emptyForm())
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)

    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        departmentService.getAll()
            .then(setDepartments)
            .catch(() => setLoadError("Failed to load departments."))
            .finally(() => setLoading(false))
    }, [])

    function startEdit(dept: Department) {
        setEditing(dept)
        setForm({ name: dept.name ?? "", type: dept.type ?? "" })
        setFormError(null)
        setFormSuccess(null)
    }

    function cancelEdit() {
        setEditing(null)
        setForm(emptyForm())
        setFormError(null)
        setFormSuccess(null)
    }

    async function handleSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        if (!form.name?.trim()) {
            setFormError("Department name is required.")
            return
        }

        setSubmitting(true)
        setFormError(null)
        setFormSuccess(null)

        try {
            if (editing) {
                await departmentService.update(editing.id, form)
                setDepartments(prev => prev.map(dept => dept.id === editing.id ? { ...dept, ...form } : dept))
                setFormSuccess("Department updated.")
            } else {
                await departmentService.create(form)
                const updated = await departmentService.getAll()
                setDepartments(updated)
                setFormSuccess("Department created.")
            }
            setEditing(null)
            setForm(emptyForm())
        } catch {
            setFormError(editing ? "Failed to update department." : "Failed to create department.")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await departmentService.delete(id)
            setDepartments(prev => prev.filter(dept => dept.id !== id))
        } catch {
            setDeleteError("Failed to delete department.")
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
                <Heading size="sm" mb={4}>{editing ? `Editing: ${editing.name}` : "Add Department"}</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={3}>
                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Name</Text>
                                <Input value={form.name ?? ""} onChange={event => setForm(prevForm => ({ ...prevForm, name: event.target.value }))} placeholder="e.g. Cardiology" required />
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Type</Text>
                                <Input value={form.type ?? ""} onChange={event => setForm(prevForm => ({ ...prevForm, type: event.target.value }))} placeholder="e.g. Surgical" />
                            </Box>
                        </HStack>

                        {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                        {formSuccess && <Text color="green.500" fontSize="sm">{formSuccess}</Text>}

                        <HStack gap={3}>
                            <Button type="submit" bg="blue.500" color="white" disabled={submitting}>
                                {submitting ? <Spinner size="sm" /> : editing ? "Save Changes" : "Add Department"}
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
            {departments.length === 0 ? (
                <Text color="gray.500">No departments yet.</Text>
            ) : (
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Type</Table.ColumnHeader>
                            <Table.ColumnHeader />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {departments.map(dept => (
                            <Table.Row key={dept.id} bg={editing?.id === dept.id ? "blue.50" : undefined}>
                                <Table.Cell>{dept.id}</Table.Cell>
                                <Table.Cell>{dept.name ?? "—"}</Table.Cell>
                                <Table.Cell>{dept.type ?? "—"}</Table.Cell>
                                <Table.Cell>
                                    <HStack gap={2} justify="flex-end">
                                        <Button size="xs" variant="outline" onClick={() => startEdit(dept)} disabled={deletingId === dept.id}>Edit</Button>
                                        <Button size="xs" colorPalette="red" variant="outline" disabled={deletingId === dept.id} onClick={() => handleDelete(dept.id)}>
                                            {deletingId === dept.id ? <Spinner size="xs" /> : "Delete"}
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

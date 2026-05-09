import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Text, VStack } from "@chakra-ui/react"
import { staffService, type StaffInput } from "../services/StaffService"
import type { Staff } from "../entites/Staff"

const ROLES: { id: number; label: string }[] = [
    { id: 1, label: "Doctor" },
    { id: 2, label: "Nurse" },
]

const roleLabel = (id: number) => ROLES.find(r => r.id === id)?.label ?? `Role ${id}`

const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    background: "white",
}

const emptyForm = (): StaffInput => ({ firstname: "", lastname: "", fkRoleId: 1 })

export default function StaffManagement() {
    const [staff, setStaff] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    const [editing, setEditing] = useState<Staff | null>(null)
    const [form, setForm] = useState<StaffInput>(emptyForm())
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState<string | null>(null)

    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        staffService.getAll()
            .then(setStaff)
            .catch(() => setLoadError("Failed to load staff."))
            .finally(() => setLoading(false))
    }, [])

    function startEdit(s: Staff) {
        setEditing(s)
        setForm({ firstname: s.firstname ?? "", lastname: s.lastname ?? "", fkRoleId: s.fkRoleId })
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
        if (!form.firstname?.trim() || !form.lastname?.trim()) {
            setFormError("First name and last name are required.")
            return
        }

        setSubmitting(true)
        setFormError(null)
        setFormSuccess(null)

        try {
            if (editing) {
                await staffService.update(editing.id, form)
                setStaff(prev => prev.map(s => s.id === editing.id ? { ...s, ...form } : s))
                setFormSuccess("Staff member updated.")
            } else {
                await staffService.create(form)
                const updated = await staffService.getAll()
                setStaff(updated)
                setFormSuccess("Staff member created.")
            }
            setEditing(null)
            setForm(emptyForm())
        } catch {
            setFormError(editing ? "Failed to update staff member." : "Failed to create staff member.")
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await staffService.delete(id)
            setStaff(prev => prev.filter(s => s.id !== id))
        } catch {
            setDeleteError("Failed to delete staff member.")
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
                <Heading size="sm" mb={4}>{editing ? `Editing: ${editing.firstname} ${editing.lastname}` : "Add Staff Member"}</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={3}>
                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>First Name</Text>
                                <Input
                                    value={form.firstname ?? ""}
                                    onChange={e => setForm(f => ({ ...f, firstname: e.target.value }))}
                                    placeholder="e.g. Jane"
                                    required
                                />
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Last Name</Text>
                                <Input
                                    value={form.lastname ?? ""}
                                    onChange={e => setForm(f => ({ ...f, lastname: e.target.value }))}
                                    placeholder="e.g. Doe"
                                    required
                                />
                            </Box>
                        </HStack>

                        <Box>
                            <Text fontWeight="medium" fontSize="sm" mb={1}>Role</Text>
                            <select
                                value={form.fkRoleId}
                                onChange={e => setForm(f => ({ ...f, fkRoleId: Number(e.target.value) }))}
                                style={selectStyle}
                            >
                                {ROLES.map(r => (
                                    <option key={r.id} value={r.id}>{r.label}</option>
                                ))}
                            </select>
                        </Box>

                        {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                        {formSuccess && <Text color="green.500" fontSize="sm">{formSuccess}</Text>}

                        <HStack gap={3}>
                            <Button type="submit" bg="blue.500" color="white" disabled={submitting}>
                                {submitting ? <Spinner size="sm" /> : editing ? "Save Changes" : "Add Staff"}
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
            {staff.length === 0 ? (
                <Text color="gray.500">No staff members yet.</Text>
            ) : (
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Role</Table.ColumnHeader>
                            <Table.ColumnHeader />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {staff.map(s => (
                            <Table.Row key={s.id} bg={editing?.id === s.id ? "blue.50" : undefined}>
                                <Table.Cell>{s.id}</Table.Cell>
                                <Table.Cell>{s.firstname} {s.lastname}</Table.Cell>
                                <Table.Cell>{roleLabel(s.fkRoleId)}</Table.Cell>
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

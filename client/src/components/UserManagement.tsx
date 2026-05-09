import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Text, VStack } from "@chakra-ui/react"
import { userService, type UserAccount } from "../services/UserService"
import { staffService } from "../services/StaffService"
import type { Staff } from "../entites/Staff"

const emptyRegisterForm = () => ({ username: "", password: "", fkStaffId: 0 })

const selectStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: "6px",
    border: "1px solid #e2e8f0", fontSize: "14px", background: "white",
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserAccount[]>([])
    const [staff, setStaff] = useState<Staff[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    // Register form
    const [registerForm, setRegisterForm] = useState(emptyRegisterForm())
    const [registering, setRegistering] = useState(false)
    const [registerError, setRegisterError] = useState<string | null>(null)
    const [registerSuccess, setRegisterSuccess] = useState<string | null>(null)

    // Change-password inline form
    const [changingPwId, setChangingPwId] = useState<number | null>(null)
    const [newPassword, setNewPassword] = useState("")
    const [savingPw, setSavingPw] = useState(false)
    const [pwError, setPwError] = useState<string | null>(null)

    // Delete
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([userService.getAll(), staffService.getAll()])
            .then(([us, stf]) => { setUsers(us); setStaff(stf) })
            .catch(() => setLoadError("Failed to load users."))
            .finally(() => setLoading(false))
    }, [])

    function staffLabel(id: number) {
        const s = staff.find(s => s.id === id)
        return s ? `${s.firstname ?? ""} ${s.lastname ?? ""}`.trim() || `#${id}` : `#${id}`
    }

    async function handleRegister(e: React.SyntheticEvent) {
        e.preventDefault()
        if (!registerForm.username.trim()) { setRegisterError("Username is required."); return }
        if (!registerForm.password.trim()) { setRegisterError("Password is required."); return }
        if (!registerForm.fkStaffId) { setRegisterError("Staff member is required."); return }

        setRegistering(true)
        setRegisterError(null)
        setRegisterSuccess(null)
        try {
            await userService.register(registerForm)
            const updated = await userService.getAll()
            setUsers(updated)
            setRegisterSuccess(`Account "${registerForm.username}" created.`)
            setRegisterForm(emptyRegisterForm())
        } catch {
            setRegisterError("Failed to create account. Username may already be taken.")
        } finally {
            setRegistering(false)
        }
    }

    async function handleChangePassword(id: number) {
        if (!newPassword.trim()) { setPwError("Password cannot be empty."); return }
        setSavingPw(true)
        setPwError(null)
        try {
            await userService.changePassword(id, newPassword)
            setChangingPwId(null)
            setNewPassword("")
        } catch {
            setPwError("Failed to update password.")
        } finally {
            setSavingPw(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await userService.delete(id)
            setUsers(prev => prev.filter(u => u.id !== id))
        } catch {
            setDeleteError("Failed to delete account.")
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) return <Box p={4}><Spinner /></Box>
    if (loadError) return <Box p={4}><Text color="red.500">{loadError}</Text></Box>

    return (
        <Box>
            {/* Register form */}
            <Box borderWidth={1} borderRadius="lg" p={6} mb={6}>
                <Heading size="sm" mb={4}>Create Account</Heading>
                <form onSubmit={handleRegister}>
                    <VStack align="stretch" gap={3}>
                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Username</Text>
                                <Input
                                    value={registerForm.username}
                                    onChange={e => setRegisterForm(f => ({ ...f, username: e.target.value }))}
                                    placeholder="e.g. jdoe"
                                    autoComplete="off"
                                    required
                                />
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1}>Password</Text>
                                <Input
                                    type="password"
                                    value={registerForm.password}
                                    onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                                    autoComplete="new-password"
                                    required
                                />
                            </Box>
                        </HStack>
                        <Box>
                            <Text fontWeight="medium" fontSize="sm" mb={1}>Staff member</Text>
                            <select
                                value={registerForm.fkStaffId || ""}
                                onChange={e => setRegisterForm(f => ({ ...f, fkStaffId: Number(e.target.value) }))}
                                style={selectStyle}
                                required
                            >
                                <option value="">Select staff…</option>
                                {staff.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {staffLabel(s.id)} (#{s.id})
                                    </option>
                                ))}
                            </select>
                        </Box>

                        {registerError && <Text color="red.500" fontSize="sm">{registerError}</Text>}
                        {registerSuccess && <Text color="green.500" fontSize="sm">{registerSuccess}</Text>}

                        <Button type="submit" bg="blue.500" color="white" alignSelf="flex-start" disabled={registering}>
                            {registering ? <Spinner size="sm" /> : "Create Account"}
                        </Button>
                    </VStack>
                </form>
            </Box>

            {/* Users table */}
            {deleteError && <Text color="red.500" fontSize="sm" mb={2}>{deleteError}</Text>}
            {users.length === 0 ? (
                <Text color="gray.500">No accounts yet.</Text>
            ) : (
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>ID</Table.ColumnHeader>
                            <Table.ColumnHeader>Username</Table.ColumnHeader>
                            <Table.ColumnHeader>Staff</Table.ColumnHeader>
                            <Table.ColumnHeader />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {users.map(u => (
                            <>
                                <Table.Row key={u.id} bg={changingPwId === u.id ? "blue.50" : undefined}>
                                    <Table.Cell>{u.id}</Table.Cell>
                                    <Table.Cell>{u.username}</Table.Cell>
                                    <Table.Cell>{staffLabel(u.fkStaffId)}</Table.Cell>
                                    <Table.Cell>
                                        <HStack gap={2} justify="flex-end">
                                            <Button
                                                size="xs"
                                                variant="outline"
                                                onClick={() => {
                                                    setChangingPwId(changingPwId === u.id ? null : u.id)
                                                    setNewPassword("")
                                                    setPwError(null)
                                                }}
                                                disabled={deletingId === u.id}
                                            >
                                                {changingPwId === u.id ? "Cancel" : "Change Password"}
                                            </Button>
                                            <Button
                                                size="xs"
                                                colorPalette="red"
                                                variant="outline"
                                                disabled={deletingId === u.id}
                                                onClick={() => handleDelete(u.id)}
                                            >
                                                {deletingId === u.id ? <Spinner size="xs" /> : "Delete"}
                                            </Button>
                                        </HStack>
                                    </Table.Cell>
                                </Table.Row>
                                {/* Inline password row — only shown for the selected user */}
                                {changingPwId === u.id && (
                                    <Table.Row key={`${u.id}-pw`} bg="blue.50">
                                        <Table.Cell colSpan={4}>
                                            <HStack gap={3} py={1}>
                                                <Input
                                                    type="password"
                                                    placeholder="New password"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    autoComplete="new-password"
                                                    size="sm"
                                                    maxW="260px"
                                                />
                                                {pwError && <Text color="red.500" fontSize="xs">{pwError}</Text>}
                                                <Button
                                                    size="xs"
                                                    bg="blue.500"
                                                    color="white"
                                                    onClick={() => handleChangePassword(u.id)}
                                                    disabled={savingPw}
                                                >
                                                    {savingPw ? <Spinner size="xs" /> : "Save"}
                                                </Button>
                                            </HStack>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </>
                        ))}
                    </Table.Body>
                </Table.Root>
            )}
        </Box>
    )
}

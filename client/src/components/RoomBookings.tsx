import { useEffect, useState } from "react"
import { Box, Button, Heading, HStack, Input, Spinner, Table, Text, VStack } from "@chakra-ui/react"
import { roomBookingService } from "../services/RoomBookingService"
import { patientService } from "../services/PatientService"
import { locationService } from "../services/LocationService"
import type { RoomBooking } from "../entites/RoomBooking"
import type { Patient } from "../entites/Patient"
import type { Location } from "../entites/Location"
import type { Room } from "../entites/Room"

interface FlatRoom {
    room: Room
    label: string
}

function localDateTimeNow() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
}

function localDateTimeHourLater() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    now.setHours(now.getHours() + 1)
    return now.toISOString().slice(0, 16)
}

const fmt = (d: string) => new Date(d).toLocaleString()

const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    background: "white",
}

const selectStyleDisabled: React.CSSProperties = {
    ...selectStyle,
    background: "#f7fafc",
    color: "#a0aec0",
    cursor: "not-allowed",
}

export default function RoomBookings() {
    const [bookings, setBookings] = useState<RoomBooking[]>([])
    const [patients, setPatients] = useState<Patient[]>([])
    const [flatRooms, setFlatRooms] = useState<FlatRoom[]>([])
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    // form
    const [patientId, setPatientId] = useState<number | "">("")
    const [roomId, setRoomId] = useState<number | "">("")
    const [startTime, setStartTime] = useState(localDateTimeNow)
    const [endTime, setEndTime] = useState(localDateTimeHourLater)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [formSuccess, setFormSuccess] = useState(false)

    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [showAllBookings, setShowAllBookings] = useState(false)

    const timesEnabled = patientId !== "" && roomId !== ""

    useEffect(() => {
        Promise.all([
            roomBookingService.getAll(),
            patientService.getAll(),
            locationService.getAll(),
        ])
            .then(([b, p, locs]) => {
                setBookings(b)
                setPatients(p)
                setFlatRooms(flattenRooms(locs))
            })
            .catch(() => setLoadError("Failed to load data"))
            .finally(() => setLoading(false))
    }, [])

    function flattenRooms(locations: Location[]): FlatRoom[] {
        const result: FlatRoom[] = []
        for (const loc of locations) {
            for (const fr of loc.floorsWithRooms) {
                for (const room of fr.rooms) {
                    result.push({
                        room,
                        label: `${loc.building.name} — ${fr.floor.name} — ${room.name}`,
                    })
                }
            }
        }
        return result
    }

    function patientName(id: number) {
        const p = patients.find(p => p.id === id)
        return p ? `${p.firstname ?? ""} ${p.lastname ?? ""}`.trim() || `Patient #${id}` : `Patient #${id}`
    }

    function roomLabel(id: number) {
        return flatRooms.find(fr => fr.room.id === id)?.label ?? `Room #${id}`
    }

    const selectedRoomBookings = roomId !== ""
        ? bookings.filter(b => b.fkRoomId === roomId)
        : []

    async function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault()
        if (patientId === "" || roomId === "") return
        if (new Date(startTime) >= new Date(endTime)) {
            setFormError("End time must be after start time.")
            return
        }

        setSubmitting(true)
        setFormError(null)
        setFormSuccess(false)

        try {
            await roomBookingService.create({
                fkPatientId: patientId as number,
                fkRoomId: roomId as number,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
            })
            const updated = await roomBookingService.getAll()
            setBookings(updated)
            setFormSuccess(true)
            setPatientId("")
            setRoomId("")
            setStartTime(localDateTimeNow())
            setEndTime(localDateTimeHourLater())
        } catch (err) {
            const status = (err as { status?: number }).status
            if (status === 409) {
                setFormError("That room is already booked for the selected time slot. Please choose a different time.")
            } else {
                setFormError("Failed to create booking. Please try again.")
            }
        } finally {
            setSubmitting(false)
        }
    }

    async function handleDelete(id: number) {
        setDeletingId(id)
        setDeleteError(null)
        try {
            await roomBookingService.delete(id)
            setBookings(prev => prev.filter(b => b.id !== id))
        } catch {
            setDeleteError("Failed to delete booking.")
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) return <Box p={4}><Spinner /></Box>
    if (loadError) return <Box p={4}><Text color="red.500">{loadError}</Text></Box>

    return (
        <Box>
            {/* ── New booking form ── */}
            <Box borderWidth={1} borderRadius="lg" p={6} mb={8}>
                <Heading size="md" mb={4}>New Booking</Heading>
                <form onSubmit={handleSubmit}>
                    <VStack align="stretch" gap={4}>

                        <Box>
                            <Text fontWeight="medium" fontSize="sm" mb={1}>Patient</Text>
                            <select
                                value={patientId}
                                onChange={e => {
                                    setPatientId(e.target.value === "" ? "" : Number(e.target.value))
                                    setRoomId("")
                                    setFormError(null)
                                    setFormSuccess(false)
                                }}
                                required
                                style={selectStyle}
                            >
                                <option value="">Select a patient…</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.firstname} {p.lastname} (#{p.id})
                                    </option>
                                ))}
                            </select>
                        </Box>

                        <Box>
                            <Text fontWeight="medium" fontSize="sm" mb={1}>Room</Text>
                            <select
                                value={roomId}
                                onChange={e => {
                                    setRoomId(e.target.value === "" ? "" : Number(e.target.value))
                                    setFormError(null)
                                    setFormSuccess(false)
                                }}
                                required
                                disabled={patientId === ""}
                                style={patientId === "" ? selectStyleDisabled : selectStyle}
                            >
                                <option value="">Select a room…</option>
                                {flatRooms.map(fr => (
                                    <option key={fr.room.id} value={fr.room.id}>
                                        {fr.label}
                                    </option>
                                ))}
                            </select>
                            {patientId === "" && (
                                <Text fontSize="xs" color="gray.400" mt={1}>Select a patient first</Text>
                            )}
                        </Box>

                        {selectedRoomBookings.length > 0 && (
                            <Box borderWidth={1} borderRadius="md" p={3} bg="orange.50" borderColor="orange.200">
                                <Text fontWeight="semibold" fontSize="sm" color="orange.700" mb={2}>
                                    This room already has {selectedRoomBookings.length} booking{selectedRoomBookings.length > 1 ? "s" : ""} — avoid these times:
                                </Text>
                                <VStack align="stretch" gap={1}>
                                    {selectedRoomBookings.map(b => (
                                        <Text key={b.id} fontSize="sm" color="orange.800">
                                            {fmt(b.startTime)} → {fmt(b.endTime)} ({patientName(b.fkPatientId)})
                                        </Text>
                                    ))}
                                </VStack>
                            </Box>
                        )}

                        <HStack gap={4}>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1} color={timesEnabled ? undefined : "gray.400"}>Start</Text>
                                <Input
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    required
                                    disabled={!timesEnabled}
                                />
                            </Box>
                            <Box flex={1}>
                                <Text fontWeight="medium" fontSize="sm" mb={1} color={timesEnabled ? undefined : "gray.400"}>End</Text>
                                <Input
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    required
                                    disabled={!timesEnabled}
                                />
                            </Box>
                        </HStack>
                        {!timesEnabled && (
                            <Text fontSize="xs" color="gray.400" mt={-2}>Select a patient and room before choosing times</Text>
                        )}

                        {formError && <Text color="red.500" fontSize="sm">{formError}</Text>}
                        {formSuccess && <Text color="green.500" fontSize="sm">Booking created successfully.</Text>}

                        <Button
                            type="submit"
                            bg="blue.500"
                            color="white"
                            disabled={submitting || !timesEnabled}
                            alignSelf="flex-start"
                        >
                            {submitting ? <Spinner size="sm" /> : "Book Room"}
                        </Button>
                    </VStack>
                </form>
            </Box>

            {/* ── Existing bookings (toggled) ── */}
            <HStack mb={3} justify="space-between" align="center">
                <Heading size="md">Existing Bookings ({bookings.length})</Heading>
                <Button size="sm" variant="outline" onClick={() => setShowAllBookings(v => !v)}>
                    {showAllBookings ? "Hide" : "Show"}
                </Button>
            </HStack>

            {deleteError && <Text color="red.500" fontSize="sm" mb={2}>{deleteError}</Text>}

            {showAllBookings && (
                bookings.length === 0 ? (
                    <Text color="gray.500">No bookings yet.</Text>
                ) : (
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Patient</Table.ColumnHeader>
                                <Table.ColumnHeader>Room</Table.ColumnHeader>
                                <Table.ColumnHeader>Start</Table.ColumnHeader>
                                <Table.ColumnHeader>End</Table.ColumnHeader>
                                <Table.ColumnHeader />
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {bookings.map(b => (
                                <Table.Row key={b.id}>
                                    <Table.Cell>{b.id}</Table.Cell>
                                    <Table.Cell>{patientName(b.fkPatientId)}</Table.Cell>
                                    <Table.Cell>{roomLabel(b.fkRoomId)}</Table.Cell>
                                    <Table.Cell>{fmt(b.startTime)}</Table.Cell>
                                    <Table.Cell>{fmt(b.endTime)}</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            size="xs"
                                            colorPalette="red"
                                            variant="outline"
                                            disabled={deletingId === b.id}
                                            onClick={() => handleDelete(b.id)}
                                        >
                                            {deletingId === b.id ? <Spinner size="xs" /> : "Delete"}
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                )
            )}
        </Box>
    )
}

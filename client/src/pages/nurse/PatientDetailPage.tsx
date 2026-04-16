import { useEffect, useState } from "react"
import { useParams, useNavigate, Navigate } from "react-router"
import { Box, Button, Heading, Spinner, Table, Text } from "@chakra-ui/react"
import { authService } from "../../services/AuthService"
import { patientService } from "../../services/PatientService"
import { treatmentService } from "../../services/TreatmentService"
import { roomBookingService } from "../../services/RoomBookingService"
import { locationService } from "../../services/LocationService"
import type { Patient } from "../../entites/Patient"
import type { Treatment } from "../../entites/Treatment"
import type { RoomBooking } from "../../entites/RoomBooking"
import type { Location } from "../../entites/Location"
import type { Building } from "../../entites/Building"
import type { Floor } from "../../entites/Floor"
import type { Room } from "../../entites/Room"

const fmt = (d: string) => new Date(d).toLocaleString()
const fmtDate = (d: string) => new Date(d).toLocaleDateString()

interface ResolvedLocation {
    building: Building
    floor: Floor
    room: Room
}

interface Visit {
    booking: RoomBooking
    location: ResolvedLocation | null
    treatments: Treatment[]
}

function resolveLocation(roomId: number, locations: Location[]): ResolvedLocation | null {
    for (const loc of locations) {
        for (const fr of loc.floorsWithRooms) {
            const room = fr.rooms.find(r => r.id === roomId)
            if (room) return { building: loc.building, floor: fr.floor, room }
        }
    }
    return null
}

function buildVisits(
    bookings: RoomBooking[],
    treatments: Treatment[],
    locations: Location[]
): { visits: Visit[]; unlinked: Treatment[] } {
    const used = new Set<number>()

    const visits: Visit[] = bookings
        .map(b => {
            const start = new Date(b.startTime).getTime()
            const end   = new Date(b.endTime).getTime()
            const matched = treatments.filter(t => {
                const tTime = new Date(t.time).getTime()
                return tTime >= start && tTime <= end
            })
            matched.forEach(t => used.add(t.id))
            return {
                booking: b,
                location: resolveLocation(b.fkRoomId, locations),
                treatments: matched.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()),
            }
        })
        .sort((a, b) => new Date(b.booking.startTime).getTime() - new Date(a.booking.startTime).getTime())

    const unlinked = treatments
        .filter(t => !used.has(t.id))
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return { visits, unlinked }
}

export default function PatientDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const patientId = Number(id)

    const [patient, setPatient] = useState<Patient | null>(null)
    const [visits, setVisits] = useState<Visit[]>([])
    const [unlinked, setUnlinked] = useState<Treatment[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([
            patientService.getById(patientId),
            treatmentService.getAll(),
            roomBookingService.getAll(),
            locationService.getAll(),
        ])
            .then(([p, allTreatments, allBookings, allLocations]) => {
                setPatient(p)

                const myTreatments = allTreatments.filter(t => t.fkPatientId === patientId)
                const myBookings   = allBookings.filter(b => b.fkPatientId === patientId)

                const { visits, unlinked } = buildVisits(myBookings, myTreatments, allLocations)
                setVisits(visits)
                setUnlinked(unlinked)
            })
            .catch(() => setError("Failed to load patient details."))
            .finally(() => setLoading(false))
    }, [patientId])

    // Future-proof: if the user is a patient they may only view their own page
    if (authService.getRole() === "patient" && authService.getPatientId() !== patientId) {
        return <Navigate to="/" replace />
    }

    if (loading) return <Box p={8}><Spinner /></Box>
    if (error)   return <Box p={8}><Text color="red.500">{error}</Text></Box>
    if (!patient) return <Box p={8}><Text>Patient not found.</Text></Box>

    return (
        <Box p={8} maxW="900px">
            <Button variant="outline" size="sm" mb={6} onClick={() => navigate(-1)}>
                ← Back
            </Button>

            {/* Patient info */}
            <Box borderWidth={1} borderRadius="lg" p={5} mb={8}>
                <Heading size="lg" mb={1}>{patient.firstname} {patient.lastname}</Heading>
                <Text color="gray.500" fontSize="sm">
                    Gender: {patient.gender ?? "—"} &nbsp;·&nbsp; CPR: {patient.cprNumber ?? "—"}
                </Text>
            </Box>

            <Heading size="md" mb={4}>
                Visits ({visits.length})
            </Heading>

            {visits.length === 0 && (
                <Text color="gray.500" mb={6}>No room bookings recorded for this patient.</Text>
            )}

            {visits.map((v, i) => {
                const loc = v.location
                return (
                    <Box key={v.booking.id} borderWidth={1} borderRadius="lg" p={5} mb={5}>
                        {/* Visit header */}
                        <Box mb={3}>
                            <Heading size="sm">
                                Visit {visits.length - i} &nbsp;·&nbsp;
                                {fmtDate(v.booking.startTime)} → {fmtDate(v.booking.endTime)}
                            </Heading>
                            {loc ? (
                                <Text fontSize="sm" color="gray.600" mt={1}>
                                    {loc.building.name}
                                    {loc.building.address ? ` (${loc.building.address})` : ""}
                                    {" › "}{loc.floor.name}
                                    {" › "}{loc.room.name}
                                </Text>
                            ) : (
                                <Text fontSize="sm" color="gray.400" mt={1}>Location not found</Text>
                            )}
                        </Box>

                        {/* Treatments in this visit */}
                        {v.treatments.length === 0 ? (
                            <Text fontSize="sm" color="gray.400">No treatments recorded during this visit.</Text>
                        ) : (
                            <Table.Root size="sm">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>ID</Table.ColumnHeader>
                                        <Table.ColumnHeader>Description</Table.ColumnHeader>
                                        <Table.ColumnHeader>Time</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {v.treatments.map(t => (
                                        <Table.Row key={t.id}>
                                            <Table.Cell>{t.id}</Table.Cell>
                                            <Table.Cell>{t.description ?? "—"}</Table.Cell>
                                            <Table.Cell>{fmt(t.time)}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        )}
                    </Box>
                )
            })}

            {/* Treatments not linked to any booking */}
            {unlinked.length > 0 && (
                <Box borderWidth={1} borderRadius="lg" p={5} mt={2}>
                    <Heading size="sm" mb={3}>Other treatments</Heading>
                    <Table.Root size="sm">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                <Table.ColumnHeader>Description</Table.ColumnHeader>
                                <Table.ColumnHeader>Time</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {unlinked.map(t => (
                                <Table.Row key={t.id}>
                                    <Table.Cell>{t.id}</Table.Cell>
                                    <Table.Cell>{t.description ?? "—"}</Table.Cell>
                                    <Table.Cell>{fmt(t.time)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            )}
        </Box>
    )
}

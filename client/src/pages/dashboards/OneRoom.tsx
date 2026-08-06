import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, Stack, Table, Text } from "@chakra-ui/react";
import type {
    HospitalApiDtosOutputsFloorRoomsOutputDto,
    HospitalApiDtosOutputsPatientOutputDto,
    HospitalApiDtosOutputsRoomBookingOutputDto,
} from "../../api";
import { RoomBookingService } from "../../services/RoomBooking";
import { LocationService } from "../../services/Location";
import { PatientService } from "../../services/Patient";

export default function OneRoom() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const roomId = Number(id);

    const [floors, setFloors] = useState<HospitalApiDtosOutputsFloorRoomsOutputDto[]>([]);
    const [bookings, setBookings] = useState<HospitalApiDtosOutputsRoomBookingOutputDto[]>([]);
    const [patients, setPatients] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!id) return;
        Promise.all([LocationService.getAllFloorRooms(), RoomBookingService.getAll(), PatientService.getAll()])
            .then(([floorData, bookingData, patientData]) => {
                setFloors(floorData);
                setBookings(bookingData);
                setPatients(patientData);
                setLoaded(true);
            })
            .catch((err) => setError(err.message));
    }, [id]);

    const room = useMemo(() => {
        for (const f of floors) {
            const match = f.rooms.find((r) => r.id === roomId);
            if (match) return { ...match, floorName: f.floor.name };
        }
        return null;
    }, [floors, roomId]);

    const patientMap = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);

    // Full booking history for this room, most recent first.
    const roomBookings = useMemo(
        () =>
            bookings
                .filter((b) => b.fkRoomId === roomId)
                .sort((a, b) => new Date(b.startTime ?? 0).getTime() - new Date(a.startTime ?? 0).getTime()),
        [bookings, roomId],
    );

    if (error) return <Text data-testid="one-room-error" color="red.500">{error}</Text>;
    if (!loaded) return <Text data-testid="one-room-loading">Loading room...</Text>;
    if (!room) return <Text data-testid="one-room-not-found">Room not found.</Text>;

    return (
        <Stack gap="4" data-testid="one-room-page">
            <Button data-testid="one-room-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/room_booking")}>
                Back to room bookings
            </Button>

            <Heading data-testid="one-room-heading" size="lg">{room.name}</Heading>
            <Text data-testid="one-room-floor"><b>Floor:</b> {room.floorName}</Text>

            <Heading size="md" mt="4">Booking History</Heading>
            <Table.Root variant="line" size="md" data-testid="one-room-bookings-table">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Id</Table.ColumnHeader>
                        <Table.ColumnHeader>Patient</Table.ColumnHeader>
                        <Table.ColumnHeader>Start Time</Table.ColumnHeader>
                        <Table.ColumnHeader>End Time</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {roomBookings.length > 0 ? (
                        roomBookings.map((booking) => {
                            const patient = patientMap.get(booking.fkPatientId);
                            return (
                                <Table.Row
                                    key={booking.id}
                                    cursor="pointer"
                                    _hover={{ bg: "gray.50" }}
                                    onClick={() => navigate(`/app/room_booking/${booking.id}`)}
                                    data-testid={`one-room-booking-row-${booking.id}`}
                                >
                                    <Table.Cell>{booking.id}</Table.Cell>
                                    <Table.Cell>
                                        {patient ? `${patient.firstname} ${patient.lastname}` : `Patient #${booking.fkPatientId}`}
                                    </Table.Cell>
                                    <Table.Cell>{booking.startTime ? new Date(booking.startTime).toLocaleString() : ""}</Table.Cell>
                                    <Table.Cell>{booking.endTime ? new Date(booking.endTime).toLocaleString() : ""}</Table.Cell>
                                </Table.Row>
                            );
                        })
                    ) : (
                        <Table.Row>
                            <Table.Cell colSpan={4} textAlign="center" paddingY="6" data-testid="one-room-bookings-empty">
                                No bookings for this room yet.
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </Stack>
    );
}

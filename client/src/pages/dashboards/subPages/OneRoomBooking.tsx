import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { CommandFormPopup, type CommandFormMode, type CommandFormService, type FieldConfig } from "../../../components/dashboards/CommandFormPopup";
import type { RoomBookingRequest } from "../../../api/Requests/RoomBookingRequest";
import type { PatientResponse } from "../../../api/Responses/PatientResponse";
import type { RoomBookingResponse } from "../../../api/Responses/RoomBookingResponse";
import type { RoomResponse } from "../../../api/Responses/RoomResponse";
import { LocationService } from "../../../api/Services/Location";
import { RoomBookingService } from "../../../api/Services/RoomBooking";
import { PatientService } from "../../../api/Services/Patient";

// The popup's datetime-local inputs hold the times as "YYYY-MM-DDTHH:mm" strings, not Dates.
type RoomBookingForm = Omit<RoomBookingRequest, "startTime" | "endTime"> & { startTime: string; endTime: string };

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time, not a full (UTC) ISO string.
const toDatetimeLocal = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

export default function OneRoomBooking() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const bookingId = Number(id);

    const [booking, setBooking] = useState<RoomBookingResponse | null>(null);
    const [patient, setPatient] = useState<PatientResponse | null>(null);
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    const [patients, setPatients] = useState<PatientResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [popupMode, setPopupMode] = useState<CommandFormMode>("edit");
    const [popupOpen, setPopupOpen] = useState(false);

    const loadBooking = () => {
        if (!id) return;
        RoomBookingService.getById(bookingId)
            .then((b) => {
                setBooking(b);
                return PatientService.getById(b.fkPatientId);
            })
            .then(setPatient)
            .catch((err) => setError(err.message));
    };

    useEffect(() => {
        loadBooking();
        LocationService.getAllFloorRooms()
            .then((floors) => setRooms(floors.flatMap((f) => f.rooms)))
            .catch((err) => setError(err.message));
        PatientService.getAll()
            .then(setPatients)
            .catch((err) => setError(err.message));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const roomMap = useMemo(() => new Map(rooms.map((r) => [r.id, r])), [rooms]);
    const room = booking ? roomMap.get(booking.fkRoomId) : undefined;

    const roomOptions = useMemo(
        () => rooms.map((r) => ({ label: r.name ?? `Room #${r.id}`, value: r.id ?? 0 })),
        [rooms],
    );

    const patientOptions = useMemo(
        () =>
            patients.map((p) => ({
                label: [p.firstname, p.lastname].filter(Boolean).join(" "),
                value: p.id ?? 0,
            })),
        [patients],
    );

    const roomBookingFields: FieldConfig<RoomBookingForm>[] = useMemo(
        () => [
            { key: "fkRoomId", label: "Room", type: "select", required: true, options: roomOptions },
            { key: "fkPatientId", label: "Patient", type: "select", required: true, options: patientOptions },
            { key: "startTime", label: "Start Time", type: "datetime", required: true },
            { key: "endTime", label: "End Time", type: "datetime", required: true },
        ],
        [roomOptions, patientOptions],
    );

    // Converts the datetime-local values from the form into Dates (new Date()
    // reads "YYYY-MM-DDTHH:mm" as local time) before they hit the request schema.
    const roomBookingFormService: CommandFormService<RoomBookingForm> = useMemo(
        () => ({
            update: (bId, values) =>
                RoomBookingService.update(bId, {
                    ...values,
                    startTime: new Date(values.startTime),
                    endTime: new Date(values.endTime),
                }),
            delete: (bId) => RoomBookingService.delete(bId),
        }),
        [],
    );

    const openEdit = () => {
        setPopupMode("edit");
        setPopupOpen(true);
    };

    const openDelete = () => {
        setPopupMode("delete");
        setPopupOpen(true);
    };

    if (error) return <Text data-testid="one-room-booking-error" color="red.500">{error}</Text>;
    if (!booking || !patient) return <Text data-testid="one-room-booking-loading">Loading room booking...</Text>;

    return (
        <Stack gap="4" data-testid="one-room-booking-page">
            <Button data-testid="one-room-booking-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/room_booking")}>Back to room bookings</Button>

            <HStack justify="space-between">
                <Heading data-testid="one-room-booking-heading" size="lg">Booking #{booking.id}</Heading>
                <HStack gap="2">
                    <Button data-testid="one-room-booking-edit-button" onClick={openEdit}><LuPencil /> Edit</Button>
                    <Button colorPalette="red" variant="outline" onClick={openDelete} data-testid="one-room-booking-delete-button"><LuTrash2 /> Delete</Button>
                </HStack>
            </HStack>

            <Stack gap="2">
                <Text data-testid="one-room-booking-field-room"><b>Room:</b> {room?.name ?? `Room #${booking.fkRoomId}`}</Text>
                <Text data-testid="one-room-booking-field-start"><b>Start Time:</b> {booking.startTime.toLocaleString()}</Text>
                <Text data-testid="one-room-booking-field-end"><b>End Time:</b> {booking.endTime.toLocaleString()}</Text>
            </Stack>

            <Heading size="md" mt="4">Patient</Heading>
            <Stack gap="2">
                <Text>
                    <b>Name:</b>{" "}
                    <Text as="span" data-testid="one-room-booking-patient-link" color="blue.600" cursor="pointer" onClick={() => navigate(`/app/patients/${patient.id}`)}>{patient.firstname} {patient.lastname}</Text>
                </Text>
                <Text data-testid="one-room-booking-patient-cpr"><b>CPR Number:</b> {patient.cprNumber}</Text>
                <Text data-testid="one-room-booking-patient-gender"><b>Gender:</b> {patient.gender}</Text>
            </Stack>

            <CommandFormPopup<RoomBookingForm> open={popupOpen} onOpenChange={setPopupOpen} service={roomBookingFormService} testId="one-room-booking-form"
                mode={popupMode} title="Room Booking" fields={roomBookingFields} itemId={booking.id} initialValues={{
                    ...booking,
                    startTime: toDatetimeLocal(booking.startTime),
                    endTime: toDatetimeLocal(booking.endTime),
                }}
                onSuccess={(mode) => {
                    if (mode === "delete") navigate("/app/room_booking");
                    else loadBooking();
                }} />
        </Stack>
    );
}

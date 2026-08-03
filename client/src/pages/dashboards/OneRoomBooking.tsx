import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { CommandFormPopup, type CommandFormMode, type CommandFormService, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type {
    HospitalApiDtosInputsRoomBookingInputDto,
    HospitalApiDtosOutputsPatientOutputDto,
    HospitalApiDtosOutputsRoomBookingOutputDto,
    HospitalApiDtosOutputsRoomOutputDto,
} from "../../api";
import { RoomBookingService } from "../../services/RoomBooking";
import { LocationService } from "../../services/Location";
import { PatientService } from "../../services/Patient";

// datetime-local inputs need "YYYY-MM-DDTHH:mm", not a full ISO string.
const toDatetimeLocal = (value?: string | null) => (value ? value.slice(0, 16) : "");

// The API's zod schema requires a full ISO datetime (seconds + timezone),
// but datetime-local inputs only produce "YYYY-MM-DDTHH:mm".
const fromDatetimeLocal = (value: unknown): string | undefined => {
    if (typeof value !== "string" || !value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export default function OneRoomBooking() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const bookingId = Number(id);

    const [booking, setBooking] = useState<HospitalApiDtosOutputsRoomBookingOutputDto | null>(null);
    const [patient, setPatient] = useState<HospitalApiDtosOutputsPatientOutputDto | null>(null);
    const [rooms, setRooms] = useState<HospitalApiDtosOutputsRoomOutputDto[]>([]);
    const [patients, setPatients] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [popupMode, setPopupMode] = useState<CommandFormMode>("edit");
    const [popupOpen, setPopupOpen] = useState(false);

    const loadBooking = () => {
        if (!id) return;
        RoomBookingService.getById(bookingId)
            .then((b) => {
                setBooking(b);
                return PatientService.getById(b.fkPatientId ?? 0);
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

    const roomBookingFields: FieldConfig<HospitalApiDtosInputsRoomBookingInputDto>[] = useMemo(
        () => [
            { key: "fkRoomId", label: "Room", type: "select", required: true, options: roomOptions },
            { key: "fkPatientId", label: "Patient", type: "select", required: true, options: patientOptions },
            { key: "startTime", label: "Start Time", type: "datetime", required: true },
            { key: "endTime", label: "End Time", type: "datetime", required: true },
        ],
        [roomOptions, patientOptions],
    );

    const roomBookingFormService: CommandFormService<HospitalApiDtosInputsRoomBookingInputDto> = useMemo(
        () => ({
            update: (bId, values) =>
                RoomBookingService.update(bId, {
                    ...values,
                    startTime: fromDatetimeLocal(values.startTime),
                    endTime: fromDatetimeLocal(values.endTime),
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
            <Button data-testid="one-room-booking-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/room_booking")}>
                Back to room bookings
            </Button>

            <HStack justify="space-between">
                <Heading data-testid="one-room-booking-heading" size="lg">
                    Booking #{booking.id}
                </Heading>
                <HStack gap="2">
                    <Button data-testid="one-room-booking-edit-button" onClick={openEdit}>
                        <LuPencil /> Edit
                    </Button>
                    <Button colorPalette="red" variant="outline" onClick={openDelete} data-testid="one-room-booking-delete-button">
                        <LuTrash2 /> Delete
                    </Button>
                </HStack>
            </HStack>

            <Stack gap="2">
                <Text data-testid="one-room-booking-field-room"><b>Room:</b> {room?.name ?? `Room #${booking.fkRoomId}`}</Text>
                <Text data-testid="one-room-booking-field-start"><b>Start Time:</b> {booking.startTime ? new Date(booking.startTime).toLocaleString() : ""}</Text>
                <Text data-testid="one-room-booking-field-end"><b>End Time:</b> {booking.endTime ? new Date(booking.endTime).toLocaleString() : ""}</Text>
            </Stack>

            <Heading size="md" mt="4">Patient</Heading>
            <Stack gap="2">
                <Text>
                    <b>Name:</b>{" "}
                    <Text
                        as="span"
                        data-testid="one-room-booking-patient-link"
                        color="blue.600"
                        cursor="pointer"
                        onClick={() => navigate(`/app/patients/${patient.id}`)}
                    >
                        {patient.firstname} {patient.lastname}
                    </Text>
                </Text>
                <Text data-testid="one-room-booking-patient-cpr"><b>CPR Number:</b> {patient.cprNumber}</Text>
                <Text data-testid="one-room-booking-patient-gender"><b>Gender:</b> {patient.gender}</Text>
            </Stack>

            <CommandFormPopup<HospitalApiDtosInputsRoomBookingInputDto>
                open={popupOpen}
                onOpenChange={setPopupOpen}
                mode={popupMode}
                title="Room Booking"
                fields={roomBookingFields}
                itemId={booking.id}
                initialValues={{
                    ...booking,
                    startTime: toDatetimeLocal(booking.startTime),
                    endTime: toDatetimeLocal(booking.endTime),
                }}
                service={roomBookingFormService}
                onSuccess={(mode) => {
                    if (mode === "delete") navigate("/app/room_booking");
                    else loadBooking();
                }}
                testId="one-room-booking-form"
            />
        </Stack>
    );
}

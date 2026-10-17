import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Field, HStack, IconButton, Input, Table, Tabs, Text } from "@chakra-ui/react";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../../components/dashboards/DataTable";
import { CommandFormPopup, type CommandFormService, type FieldConfig } from "../../../components/dashboards/CommandFormPopup";
import type { RoomBookingRequest } from "../../../api/Requests/RoomBookingRequest";
import type { FloorRoomsResponse } from "../../../api/Responses/FloorRoomsResponse";
import type { PatientResponse } from "../../../api/Responses/PatientResponse";
import type { RoomBookingResponse } from "../../../api/Responses/RoomBookingResponse";
import { LocationService } from "../../../api/Services/Location";
import { useCommandPopup } from "../../../hooks/useCommandPopup";
import { RoomBookingService } from "../../../api/Services/RoomBooking";
import { PatientService } from "../../../api/Services/Patient";

interface RoomBookingRow {
    id?: number;
    roomName: string;
    patientName: string;
    startTime: Date;
    endTime: Date;
    actions?: undefined;
}

// The popup's datetime-local inputs hold the times as "YYYY-MM-DDTHH:mm" strings, not Dates.
type RoomBookingForm = Omit<RoomBookingRequest, "startTime" | "endTime"> & { startTime: string; endTime: string };

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time, not a full (UTC) ISO string.
const toDatetimeLocal = (date: Date) => new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);

export default function RoomBooking() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState<RoomBookingResponse[]>([]);
    const [floors, setFloors] = useState<FloorRoomsResponse[]>([]);
    const [patients, setPatients] = useState<PatientResponse[]>([]);
    const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, selected: selectedBooking, openCreate, openEdit, openDelete } =
        useCommandPopup<RoomBookingResponse>();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const loadBookings = () => {
        RoomBookingService.getAll()
            .then(setBookings)
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        loadBookings();
        LocationService.getAllFloorRooms()
            .then(setFloors)
            .catch((error) => console.error(error));
        PatientService.getAll()
            .then(setPatients)
            .catch((error) => console.error(error));
    }, []);

    const rooms = useMemo(() => floors.flatMap((f) => f.rooms), [floors]);
    const roomsWithFloor = useMemo(
        () => floors.flatMap((f) => f.rooms.map((r) => ({ ...r, floorName: f.floor.name }))),
        [floors],
    );
    const roomMap = useMemo(() => new Map(rooms.map((r) => [r.id, r])), [rooms]);
    const patientMap = useMemo(() => new Map(patients.map((p) => [p.id, p])), [patients]);

    // Limits the bookings table to the selected date range, comparing against
    // each booking's start time. Either bound can be left blank.
    const dateFilteredBookings = useMemo(
        () =>
            bookings.filter((b) => {
                if (!b.startTime) return true;
                const start = new Date(b.startTime);
                if (fromDate && start < new Date(`${fromDate}T00:00:00`)) return false;
                if (toDate && start > new Date(`${toDate}T23:59:59`)) return false;
                return true;
            }),
        [bookings, fromDate, toDate],
    );

    const rows: RoomBookingRow[] = useMemo(
        () =>
            dateFilteredBookings.map((b) => {
                const patient = patientMap.get(b.fkPatientId);
                return {
                    id: b.id,
                    roomName: roomMap.get(b.fkRoomId)?.name ?? `Room #${b.fkRoomId}`,
                    patientName: patient ? `${patient.firstname} ${patient.lastname}` : `Patient #${b.fkPatientId}`,
                    startTime: b.startTime,
                    endTime: b.endTime,
                };
            }),
        [dateFilteredBookings, roomMap, patientMap],
    );

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
            create: (values) =>
                RoomBookingService.create({
                    ...values,
                    startTime: new Date(values.startTime),
                    endTime: new Date(values.endTime),
                }),
            update: (id, values) =>
                RoomBookingService.update(id, {
                    ...values,
                    startTime: new Date(values.startTime),
                    endTime: new Date(values.endTime),
                }),
            delete: (id) => RoomBookingService.delete(id),
        }),
        [],
    );

    const columns: ColumnConfig<RoomBookingRow>[] = [
        { key: "id", header: "Id" },
        { key: "roomName", header: "Room", enableSearch: true },
        { key: "patientName", header: "Patient", enableSearch: true },
        { key: "startTime", header: "Start Time", render: (_value, item) => item.startTime.toLocaleString(), },
        { key: "endTime", header: "End Time", render: (_value, item) => item.endTime.toLocaleString(), },
        {
            key: "actions", header: "Actions", enableSort: false,
            render: (_value, item) => {
                const booking = bookings.find((b) => b.id === item.id);
                if (!booking) return null;
                return (
                    <HStack gap="2">
                        <IconButton aria-label="Edit room booking" size="sm" variant="ghost" data-testid={`room-booking-edit-${item.id}`} onClick={(e) => {
                            e.stopPropagation();
                            openEdit(booking);
                        }}><LuPencil /></IconButton>
                        <IconButton aria-label="Delete room booking" size="sm" variant="ghost" colorPalette="red"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDelete(booking);
                            }}
                            data-testid={`room-booking-delete-${item.id}`}><LuTrash2 /></IconButton>
                    </HStack>
                );
            },
        },
    ];

    return (
        <>
            <Text data-testid="room-booking-page-heading" fontSize="xl" fontWeight="bold" mb="4">Room Bookings</Text>

            <Tabs.Root defaultValue="bookings" data-testid="room-booking-tabs">
                <Tabs.List mb="4">
                    <Tabs.Trigger value="bookings" data-testid="room-booking-tab-bookings">Bookings</Tabs.Trigger>
                    <Tabs.Trigger value="rooms" data-testid="room-booking-tab-rooms">Rooms</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="bookings">
                    <HStack justify="space-between" align="end" mb="4" flexWrap="wrap" gap="4">
                        <HStack gap="3" align="end" flexWrap="wrap" data-testid="room-booking-date-filter">
                            <Field.Root w="180px">
                                <Field.Label>From</Field.Label>
                                <Input type="date" size="sm" value={fromDate} onChange={(e) => setFromDate(e.target.value)} data-testid="room-booking-date-filter-from" />
                            </Field.Root>
                            <Field.Root w="180px">
                                <Field.Label>To</Field.Label>
                                <Input type="date" size="sm" value={toDate} onChange={(e) => setToDate(e.target.value)} data-testid="room-booking-date-filter-to" />
                            </Field.Root>
                            {(fromDate || toDate) && (
                                <Button data-testid="room-booking-date-filter-clear" variant="ghost" size="sm" onClick={() => {
                                    setFromDate("");
                                    setToDate("");
                                }}>Clear</Button>)}
                        </HStack>
                        <Button data-testid="room-booking-add-button" onClick={openCreate}><LuPlus /> Add Room Booking</Button>
                    </HStack>

                    <DataTable<RoomBookingRow> testId="room-booking-table" data={rows} columns={columns} pageSize={10} onRowClick={(item) => navigate(`/app/room_booking/${item.id}`)} />
                </Tabs.Content>

                <Tabs.Content value="rooms">
                    <Table.Root variant="line" size="md" interactive data-testid="room-booking-rooms-table">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>Id</Table.ColumnHeader>
                                <Table.ColumnHeader>Room</Table.ColumnHeader>
                                <Table.ColumnHeader>Floor</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {roomsWithFloor.length > 0 ? (
                                roomsWithFloor.map((room) => (
                                    <Table.Row key={room.id} data-testid={`room-booking-rooms-row-${room.id}`} cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => navigate(`/app/room_booking/room/${room.id}`)}>
                                        <Table.Cell>{room.id}</Table.Cell>
                                        <Table.Cell>{room.name}</Table.Cell>
                                        <Table.Cell>{room.floorName}</Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={3} textAlign="center" paddingY="6">No rooms found.</Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table.Root>
                </Tabs.Content>
            </Tabs.Root>

            <CommandFormPopup<RoomBookingForm> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Room Booking"
                fields={roomBookingFields} itemId={selectedBooking?.id} initialValues={
                    selectedBooking
                        ? {
                            ...selectedBooking,
                            startTime: toDatetimeLocal(selectedBooking.startTime),
                            endTime: toDatetimeLocal(selectedBooking.endTime),
                        } : undefined
                } service={roomBookingFormService} onSuccess={loadBookings} testId="room-booking-form" />
        </>
    );
}

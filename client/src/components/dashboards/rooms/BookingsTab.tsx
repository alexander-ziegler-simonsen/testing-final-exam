import { Button, Field, HStack, Input } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { DataTable, type ColumnConfig } from "../../../components/dashboards/DataTable";
import { useEffect, useMemo, useState } from "react";
import type { HospitalApiDtosInputsRoomBookingInputDto, HospitalApiDtosOutputsFloorRoomsOutputDto, HospitalApiDtosOutputsPatientOutputDto, HospitalApiDtosOutputsRoomBookingOutputDto } from "../../../api";
import { useCommandPopup } from "../../../hooks/useCommandPopup";
import { RoomBookingService } from "../../../services/rooms/RoomBooking";
import { PatientService } from "../../../services/patients/Patient";
import { CommandFormPopup } from "../../../components/dashboards/CommandFormPopup";
import { useNavigate } from "react-router";
import { LocationService } from "../../../services/facilities/Location";
import { buildRoomBookingFields, roomBookingFormService } from "./roomBookingForm";

interface RoomBookingRow {
  id?: number;
  roomName: string;
  patientName: string;
  startTime?: string;
  endTime?: string;
}

const columns: ColumnConfig<RoomBookingRow>[] = [
  { key: "id", header: "Id" },
  { key: "roomName", header: "Room", enableSearch: true },
  { key: "patientName", header: "Patient", enableSearch: true },
  { key: "startTime", header: "Start Time", render: (value) => (value ? new Date(String(value)).toLocaleString() : ""), },
  { key: "endTime", header: "End Time", render: (value) => (value ? new Date(String(value)).toLocaleString() : ""), },
];

// Edit and delete live on the booking's own page (OneRoomBookingPage).
export default function BookingsTab() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<HospitalApiDtosOutputsRoomBookingOutputDto[]>([]);
  const [floors, setFloors] = useState<HospitalApiDtosOutputsFloorRoomsOutputDto[]>([]);
  const [patients, setPatients] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
  const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, openCreate } =
    useCommandPopup<HospitalApiDtosOutputsRoomBookingOutputDto>();
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

  const roomBookingFields = useMemo(() => buildRoomBookingFields(rooms, patients), [rooms, patients]);

  return (
    <>
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

      <CommandFormPopup<HospitalApiDtosInputsRoomBookingInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Room Booking"
        fields={roomBookingFields} service={roomBookingFormService} onSuccess={loadBookings} testId="room-booking-form" />
    </>
  );
}

import { Button, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import type { HospitalApiDtosInputsRoomBookingInputDto, HospitalApiDtosOutputsFloorRoomsOutputDto, HospitalApiDtosOutputsPatientOutputDto, HospitalApiDtosOutputsRoomBookingOutputDto } from "../../../../api";
import { RoomBookingService } from "../../../../services/rooms/RoomBooking";
import { LocationService } from "../../../../services/facilities/Location";
import { PatientService } from "../../../../services/patients/Patient";
import { CommandFormPopup } from "../../../../components/dashboards/CommandFormPopup";
import { useCommandPopup } from "../../../../hooks/useCommandPopup";
import { buildRoomBookingFields, roomBookingFormService, toRoomBookingFormValues } from "../../../../components/dashboards/rooms/roomBookingForm";

export default function OneRoomBookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookingId = Number(id);

  const [booking, setBooking] = useState<HospitalApiDtosOutputsRoomBookingOutputDto | null>(null);
  const [floors, setFloors] = useState<HospitalApiDtosOutputsFloorRoomsOutputDto[]>([]);
  const [patients, setPatients] = useState<HospitalApiDtosOutputsPatientOutputDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { open: popupOpen, setOpen: setPopupOpen, mode: popupMode, openEdit, openDelete } =
    useCommandPopup<HospitalApiDtosOutputsRoomBookingOutputDto>();

  const loadBooking = () => {
    if (!id) return;
    RoomBookingService.getById(bookingId)
      .then(setBooking)
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (!id) return;
    loadBooking();
    // floors + patients feed the room/patient names and the edit form's selects
    Promise.all([LocationService.getAllFloorRooms(), PatientService.getAll()])
      .then(([floorData, patientData]) => {
        setFloors(floorData);
        setPatients(patientData);
      })
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const rooms = useMemo(() => floors.flatMap((f) => f.rooms), [floors]);
  const roomBookingFields = useMemo(() => buildRoomBookingFields(rooms, patients), [rooms, patients]);

  if (error) return <Text data-testid="one-room-booking-error" color="red.500">{error}</Text>;
  if (!booking) return <Text data-testid="one-room-booking-loading">Loading room booking...</Text>;

  const room = rooms.find((r) => r.id === booking.fkRoomId);
  const patient = patients.find((p) => p.id === booking.fkPatientId);

  return (
    <Stack gap="4" data-testid="one-room-booking-page">
      <Button data-testid="one-room-booking-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/rooms")}>Back to room bookings</Button>

      <HStack justify="space-between">
        <Heading data-testid="one-room-booking-heading" size="lg">Room Booking #{booking.id}</Heading>
        <HStack gap="2">
          <Button data-testid="one-room-booking-edit-button" variant="outline" onClick={() => openEdit(booking)}><LuPencil /> Edit</Button>
          <Button data-testid="one-room-booking-delete-button" variant="outline" colorPalette="red" onClick={() => openDelete(booking)}><LuTrash2 /> Delete</Button>
        </HStack>
      </HStack>

      <Stack gap="2">
        <Text data-testid="one-room-booking-field-room">
          <b>Room:</b>{" "}
          <Text as="span" color="blue.600" cursor="pointer" onClick={() => navigate(`/app/rooms/${booking.fkRoomId}`)}>{room?.name ?? `Room #${booking.fkRoomId}`}</Text>
        </Text>
        <Text data-testid="one-room-booking-field-patient">
          <b>Patient:</b>{" "}
          <Text as="span" color="blue.600" cursor="pointer" onClick={() => navigate(`/app/patients/${booking.fkPatientId}`)}>{patient ? `${patient.firstname} ${patient.lastname}` : `Patient #${booking.fkPatientId}`}</Text>
        </Text>
        <Text data-testid="one-room-booking-field-start-time"><b>Start Time:</b> {booking.startTime ? new Date(booking.startTime).toLocaleString() : ""}</Text>
        <Text data-testid="one-room-booking-field-end-time"><b>End Time:</b> {booking.endTime ? new Date(booking.endTime).toLocaleString() : ""}</Text>
      </Stack>

      <CommandFormPopup<HospitalApiDtosInputsRoomBookingInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Room Booking"
        fields={roomBookingFields} itemId={booking.id} initialValues={toRoomBookingFormValues(booking)} service={roomBookingFormService} testId="one-room-booking-form"
        onSuccess={(mode) => (mode === "delete" ? navigate("/app/rooms") : loadBooking())} />
    </Stack>
  );
}

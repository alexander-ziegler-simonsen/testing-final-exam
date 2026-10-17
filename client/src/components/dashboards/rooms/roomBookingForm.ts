import type { HospitalApiDtosInputsRoomBookingInputDto, HospitalApiDtosOutputsPatientOutputDto, HospitalApiDtosOutputsRoomBookingOutputDto, HospitalApiDtosOutputsRoomOutputDto } from "../../../api";
import { RoomBookingService } from "../../../services/rooms/RoomBooking";
import type { CommandFormService, FieldConfig } from "../CommandFormPopup";

// Shared by BookingsTab (create) and OneRoomBookingPage (edit/delete).

// datetime-local inputs need "YYYY-MM-DDTHH:mm", not a full ISO string.
export const toDatetimeLocal = (value?: string | null) => (value ? value.slice(0, 16) : "");

// The API's zod schema requires a full ISO datetime (seconds + timezone),
// but datetime-local inputs only produce "YYYY-MM-DDTHH:mm".
export const fromDatetimeLocal = (value: unknown): string | undefined => {
  if (typeof value !== "string" || !value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export const buildRoomBookingFields = (
  rooms: HospitalApiDtosOutputsRoomOutputDto[],
  patients: HospitalApiDtosOutputsPatientOutputDto[],
): FieldConfig<HospitalApiDtosInputsRoomBookingInputDto>[] => [
  { key: "fkRoomId", label: "Room", type: "select", required: true, options: rooms.map((r) => ({ label: r.name ?? `Room #${r.id}`, value: r.id ?? 0 })) },
  { key: "fkPatientId", label: "Patient", type: "select", required: true, options: patients.map((p) => ({ label: [p.firstname, p.lastname].filter(Boolean).join(" "), value: p.id ?? 0 })) },
  { key: "startTime", label: "Start Time", type: "datetime", required: true },
  { key: "endTime", label: "End Time", type: "datetime", required: true },
];

// Pre-fills the form with datetime-local values the inputs can display.
export const toRoomBookingFormValues = (booking: HospitalApiDtosOutputsRoomBookingOutputDto) => ({
  ...booking,
  startTime: toDatetimeLocal(booking.startTime),
  endTime: toDatetimeLocal(booking.endTime),
});

// Converts the datetime-local values from the form into full ISO strings
// before they hit the API's zod validation.
export const roomBookingFormService: CommandFormService<HospitalApiDtosInputsRoomBookingInputDto> = {
  create: (values) =>
    RoomBookingService.create({
      ...values,
      startTime: fromDatetimeLocal(values.startTime),
      endTime: fromDatetimeLocal(values.endTime),
    }),
  update: (id, values) =>
    RoomBookingService.update(id, {
      ...values,
      startTime: fromDatetimeLocal(values.startTime),
      endTime: fromDatetimeLocal(values.endTime),
    }),
  delete: (id) => RoomBookingService.delete(id),
};

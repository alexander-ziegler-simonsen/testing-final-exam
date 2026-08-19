import { roomBookingGetAll, roomBookingGet, roomBookingPost, roomBookingPut, roomBookingDelete, roomBookingGetEmptyRoomsCountForDay, roomBookingGetRoomsInUseCountByFloor } from "../api";
import { zHospitalApiDtosInputsRoomBookingInputDto } from "../api/zod.gen";
import type { HospitalApiDtosOutputsRoomBookingOutputDto, HospitalApiDtosInputsRoomBookingInputDto } from "../api";

export const RoomBookingService = {
  getAll: async (): Promise<HospitalApiDtosOutputsRoomBookingOutputDto[]> => {
    const { data, error } = await roomBookingGetAll();
    if (error) throw new Error("Failed to load room bookings");
    return data;
  },

  getById: async (id: number): Promise<HospitalApiDtosOutputsRoomBookingOutputDto> => {
    const { data, error } = await roomBookingGet({ path: { id } });
    if (error) throw new Error(`Failed to load room booking ${id}`);
    return data;
  },

  create: async (newRoomBooking: HospitalApiDtosInputsRoomBookingInputDto): Promise<number> => {
    const body = zHospitalApiDtosInputsRoomBookingInputDto.parse(newRoomBooking);
    const { data, error } = await roomBookingPost({ body });
    if (error) throw new Error(error);
    if (typeof data !== "number") throw new Error("Failed to create room booking");
    return data;
  },

  update: async (id: number, changedRoomBooking: HospitalApiDtosInputsRoomBookingInputDto): Promise<void> => {
    const body = zHospitalApiDtosInputsRoomBookingInputDto.parse(changedRoomBooking);
    const { error } = await roomBookingPut({ path: { id }, body });
    if (error) throw new Error(typeof error === "string" ? error : `Failed to update room booking ${id}`);
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await roomBookingDelete({ path: { id } });
    if (error) throw new Error(`Failed to delete room booking ${id}`);
  },

  getEmptyRoomsCountForDay: async (date: string): Promise<number> => {
    const { data, error } = await roomBookingGetEmptyRoomsCountForDay({ query: { date } });
    if (error) throw new Error("Failed to load empty rooms count");
    return data;
  },

  getRoomsInUseCountByFloor: async (floorFkId: number): Promise<number> => {
    const { data, error } = await roomBookingGetRoomsInUseCountByFloor({ query: { floorFkId } });
    if (error) throw new Error("Failed to load rooms in use count");
    return data;
  },
};

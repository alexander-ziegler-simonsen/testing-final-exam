import { Table } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import type { HospitalApiDtosOutputsFloorRoomsOutputDto } from "../../../api";
import { LocationService } from "../../../services/Location";
import { useNavigate } from "react-router";

export default function RoomsTab() {
  const navigate = useNavigate();

  const [floors, setFloors] = useState<HospitalApiDtosOutputsFloorRoomsOutputDto[]>([]);

  useEffect(() => {
    LocationService.getAllFloorRooms()
      .then(setFloors)
      .catch((error) => console.error(error));
  }, []);

  const roomsWithFloor = useMemo(
    () => floors.flatMap((f) => f.rooms.map((r) => ({ ...r, floorName: f.floor.name }))),
    [floors],
  );

  return (
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
            <Table.Row key={room.id} data-testid={`room-booking-rooms-row-${room.id}`} cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => navigate(`/app/rooms/${room.id}`)}>
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
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box, Button, Heading, HStack, Stack, Tag, Text, Wrap } from "@chakra-ui/react";
import { LuDoorOpen, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { CommandFormPopup, type CommandFormMode, type CommandFormService, type FieldConfig } from "../../components/dashboards/CommandFormPopup";
import type {
    HospitalApiDtosInputsFloorInputDto,
    HospitalApiDtosOutputsFloorOutputDto,
    HospitalApiDtosOutputsLocationOutputDto,
} from "../../api";
import { LocationService } from "../../services/Location";
import { useAuthStore } from "../../stores/AuthStore";

const floorFields: FieldConfig<HospitalApiDtosInputsFloorInputDto>[] = [
    { key: "name", label: "Name", type: "text", required: true },
];

export default function OneFacility() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const buildingId = Number(id);
    const isAdmin = useAuthStore((state) => state.user?.role === "admin");

    const [location, setLocation] = useState<HospitalApiDtosOutputsLocationOutputDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupMode, setPopupMode] = useState<CommandFormMode>("create");
    const [selectedFloor, setSelectedFloor] = useState<HospitalApiDtosOutputsFloorOutputDto | null>(null);

    const loadLocation = () => {
        if (!id) return;
        LocationService.getById(buildingId)
            .then(setLocation)
            .catch((err) => setError(err.message));
    };

    useEffect(() => {
        loadLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Floors belong to this building; the popup only ever asks for a name, so
    // fkBuildingId is pinned here rather than left for the user to pick.
    const floorService: CommandFormService<HospitalApiDtosInputsFloorInputDto> = useMemo(
        () => ({
            create: (data) => LocationService.createFloor({ ...data, fkBuildingId: buildingId }),
            update: (floorId, data) => LocationService.putFloor(floorId, { ...data, fkBuildingId: buildingId }),
            delete: (floorId) => LocationService.deleteFloor(floorId),
        }),
        [buildingId],
    );

    const openCreate = () => {
        setSelectedFloor(null);
        setPopupMode("create");
        setPopupOpen(true);
    };

    const openEdit = (floor: HospitalApiDtosOutputsFloorOutputDto) => {
        setSelectedFloor(floor);
        setPopupMode("edit");
        setPopupOpen(true);
    };

    const openDelete = (floor: HospitalApiDtosOutputsFloorOutputDto) => {
        setSelectedFloor(floor);
        setPopupMode("delete");
        setPopupOpen(true);
    };

    if (error) return <Text data-testid="one-facility-error" color="red.500">{error}</Text>;
    if (!location) return <Text data-testid="one-facility-loading">Loading facility...</Text>;

    return (
        <Stack gap="4" data-testid="one-facility-page">
            <Button data-testid="one-facility-back-button" alignSelf="start" variant="outline" onClick={() => navigate("/app/facilities")}>Back to facilities</Button>

            <HStack justify="space-between">
                <Heading data-testid="one-facility-heading" size="lg">{location.building.name}</Heading>
                {isAdmin && (
                    <Button data-testid="one-facility-add-floor-button" onClick={openCreate}><LuPlus /> Add Floor</Button>
                )}
            </HStack>
            <Text data-testid="one-facility-address"><b>Address:</b> {location.building.address}</Text>

            {location.floorsWithRooms.length === 0 && (
                <Text data-testid="one-facility-no-floors" color="fg.muted">No floors yet.</Text>
            )}

            {location.floorsWithRooms.map(({ floor, rooms }) => (
                <Box key={floor.id} borderWidth="1px" borderColor="border" borderRadius="lg" p="4" data-testid={`one-facility-floor-${floor.id}`}>
                    <HStack justify="space-between" mb="3">
                        <Heading size="md">{floor.name}</Heading>
                        {isAdmin && (
                            <HStack gap="2">
                                <Button size="sm" variant="ghost" onClick={() => openEdit(floor)} data-testid={`one-facility-edit-floor-${floor.id}`}><LuPencil /> Edit</Button>
                                <Button size="sm" variant="ghost" colorPalette="red" onClick={() => openDelete(floor)} data-testid={`one-facility-delete-floor-${floor.id}`}><LuTrash2 /> Delete</Button>
                            </HStack>
                        )}
                    </HStack>
                    {rooms.length === 0 ? (
                        <Text data-testid={`one-facility-no-rooms-${floor.id}`} color="fg.muted" fontSize="sm">No rooms on this floor.</Text>
                    ) : (
                        <Wrap gap="2" data-testid={`one-facility-rooms-${floor.id}`}>
                            {rooms.map((room) => (
                                <Tag.Root key={room.id} size="lg" variant="subtle" colorPalette="teal" cursor="pointer" _hover={{ opacity: 0.8 }}  onClick={() => navigate(`/app/room_booking/room/${room.id}`)} data-testid={`one-facility-room-${room.id}`}>
                                    <Tag.StartElement><LuDoorOpen /></Tag.StartElement>
                                    <Tag.Label>{room.name}</Tag.Label>
                                </Tag.Root>
                            ))}
                        </Wrap>
                    )}
                </Box>
            ))}

            <CommandFormPopup<HospitalApiDtosInputsFloorInputDto> open={popupOpen} onOpenChange={setPopupOpen} mode={popupMode} title="Floor" fields={floorFields}  itemId={selectedFloor?.id} initialValues={selectedFloor ?? undefined} service={floorService}onSuccess={loadLocation} testId="one-facility-floor-form" />
        </Stack>
    );
}

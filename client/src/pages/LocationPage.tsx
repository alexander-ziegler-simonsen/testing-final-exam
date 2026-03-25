import { Box, Heading, Text, Spinner, VStack, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { locationService } from "../services/LocationService";
import type { Location } from "../entites/Location";

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        locationService
            .getAll()
            .then((data) => {
                console.log("debuging", data);
                setLocations(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) { return (<Box p={6}> <Spinner size="lg" /> </Box>); }

    return (
        <Box p={6}>
            <Heading mb={6}>Locations</Heading>

            <VStack spaceX={6} spaceY={6} align="stretch">
                {locations.map((location) => (
                    <Box key={location.building.id} borderWidth="1px" borderRadius="lg" p={4} shadow="sm" >
                        <Stack spaceX={4} spaceY={4}>
                            {/* building */}
                            <Box>
                                <Heading size="md">{location.building.name}</Heading>
                                {location.building.address && (
                                    <Text color="gray.500">
                                        {location.building.address}
                                    </Text>
                                )}
                            </Box>

                            {/* Floors */}

                            <Box id={(location.building.id).toString()} pl={4}>

                                <VStack align="start" spaceX={1} spaceY={1} pl={4}>
                                    {/* rooms */}

                                    <Box display="flex" gap={4} flexWrap="wrap">
                                        {location.floorsWithRooms.map((floorData) => (
                                            <Box key={floorData.floor.id} borderWidth="1px" borderRadius="md" p={3} minW="200px" flex="1" >
                                                <Heading size="sm" mb={2}>{floorData.floor.name}</Heading>

                                                {(floorData.rooms ?? []).map((room) => (<Text key={room.id}>• {room.name}</Text>))}
                                            </Box>
                                        ))}
                                    </Box>

                                </VStack>
                            </Box>

                        </Stack>
                    </Box>
                ))}
            </VStack>
        </Box>
    );
}
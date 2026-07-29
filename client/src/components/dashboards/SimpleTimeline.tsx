import { Box, Grid, GridItem, Text } from "@chakra-ui/react";

// Mock configuration data
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const FixedTimelineGrid = () => {
    return (
        <Box w="full" maxW="60vw" maxH="600px" border="1px solid" borderColor="gray.200" borderRadius="xl" overflow="auto" boxShadow="sm">
            <Grid templateColumns="100px repeat(24, 120px)"  position="relative">

                <GridItem position="sticky" top={0} left={0} bg="gray.50" zIndex={4} />

                {/* header - Hours */}
                {HOURS.map((hour) => (
                    <GridItem key={hour} position="sticky" top={0} bg="gray.50" zIndex={2}>
                        <Text fontSize="xs" textAlign={"center"} m={0.5} fontWeight="bold" color="gray.600">{hour}</Text>
                    </GridItem>
                ))}

                {/* body - (Days) & Columns */}
                {DAYS.map((day) => (
                    <>
                        {/* Sticky (Day) */}
                        <GridItem position="sticky" left={0} bg="gray.50" zIndex={3}>
                            <Text fontSize="xl" textAlign={"center"} fontWeight="bold" paddingTop={6} color="gray.700">{day}</Text>
                        </GridItem>

                        {/* empty Hour blocks */}
                        {HOURS.map((hour, index) => (
                            <GridItem key={`${day}-${hour}`} h="80px" borderBottom="1px solid" borderRight="1px solid" borderColor="gray.100" bg="white" _hover={{ bg: "gray.50/50" }} position="relative">
                                {/* Mock Event Display */}
                                {day === "Mon" && index === 2 && (
                                    <Box position="absolute" top="10%" left="4px" width="calc(300% - 8px)" height="80%" bg="blue.500" color="white" borderRadius="md" p={2} zIndex={1}>
                                        <Text fontSize="xs" fontWeight="bold" lineClamp={1}>Team Sync</Text>
                                        <Text fontSize="xx-small" opacity={0.8}>02:00 - 05:00</Text>
                                    </Box>
                                )}
                            </GridItem>
                        ))}
                    </>
                ))}
            </Grid>
        </Box>
    );
};

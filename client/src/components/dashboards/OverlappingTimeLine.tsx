import { Box, Grid, GridItem, Text } from "@chakra-ui/react";

// --- TYPES ---
interface EventStyles {
    left: string;
    width: string;
    top: string;
    height: string;
}

interface TimelineEvent {
    id: string;
    day: string;
    title: string;
    start: number; // e.g., 13.5 for 13:30
    end: number;
    lane: number; // Stacking tier layer index (0, 1, 2, ...)
    color: string;
}

// --- CONFIGURATION CONSTANTS ---
const HOURS = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`,
);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const COLUMN_WIDTH = 120;
const SIDEBAR_WIDTH = 100;
const LANE_HEIGHT = 45;
const ROW_PADDING = 16;
const TOTAL_GRID_WIDTH = 24 * COLUMN_WIDTH; // 2880px

// Pure CSS vertical background line rule for the scrollable container track
const VISUAL_GRID_LINES = `repeating-linear-gradient(
  to right, 
  transparent, 
  transparent ${COLUMN_WIDTH - 1}px, 
  var(--chakra-colors-gray-100) ${COLUMN_WIDTH - 1}px, 
  var(--chakra-colors-gray-100) ${COLUMN_WIDTH}px
)`;

// --- HELPER UTILITIES ---
const formatTime = (time: number): string => {
    const hours = Math.floor(time);
    const minutes = (time % 1) * 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const calculateEventStyles = (
    start: number,
    end: number,
    lane: number,
): EventStyles => {
    const leftPos = (start / 24) * TOTAL_GRID_WIDTH;
    const blockWidth = ((end - start) / 24) * TOTAL_GRID_WIDTH;
    const topPos = lane * LANE_HEIGHT + ROW_PADDING / 2;

    return {
        left: `${leftPos}px`,
        width: `${blockWidth}px`,
        top: `${topPos}px`,
        height: `${LANE_HEIGHT - 6}px`, // 6px padding spacer between vertical layers
    };
};

// --- MOCK DATA ---
const MOCK_EVENTS: TimelineEvent[] = [
    {
        id: "1",
        day: "Mon",
        title: "All-Day Project Scope",
        start: 2,
        end: 22,
        lane: 0,
        color: "blue.500",
    },
    {
        id: "2",
        day: "Mon",
        title: "Midday Catchup",
        start: 13.5,
        end: 15,
        lane: 1,
        color: "purple.500",
    },
    {
        id: "3",
        day: "Mon",
        title: "Sync A",
        start: 14,
        end: 16,
        lane: 2,
        color: "teal.500",
    },
    {
        id: "4",
        day: "Mon",
        title: "Sync B",
        start: 14,
        end: 16,
        lane: 3,
        color: "orange.500",
    },
];

// --- MAIN COMPONENT ---
export const OverlappingTimeline = () => {
    // Scans lane properties to adjust vertical row expansion requirements dynamically
    const getRowHeight = (dayName: string): string => {
        const dayEvents = MOCK_EVENTS.filter((e) => e.day === dayName);
        if (dayEvents.length === 0) return `${LANE_HEIGHT + ROW_PADDING}px`;

        const maxLane = Math.max(...dayEvents.map((e) => e.lane));
        return `${(maxLane + 1) * LANE_HEIGHT + ROW_PADDING}px`;
    };

    return (
        <Box w="full" maxW="60vw" maxH="600px" border="1px solid" borderColor="gray.200" borderRadius="xl" overflow="auto" boxShadow="sm">
            <Grid templateColumns={`${SIDEBAR_WIDTH}px repeat(24, ${COLUMN_WIDTH}px)`} position="relative" w="max-content">
                {/* Sticky Top-Left Corner Block */}
                <GridItem position="sticky" top={0} left={0} bg="gray.50" zIndex={4} borderRight="2px solid" borderBottom="2px solid" borderColor="gray.200" />

                {/* Header Row: Hours Timeline Scale */}
                {HOURS.map((hour) => (
                    <GridItem key={hour} position="sticky" top={0} bg="gray.50" zIndex={2} p={3} borderBottom="2px solid" borderRight="1px solid" borderColor="gray.200" textAlign="center">
                        <Text fontSize="xs" fontWeight="bold" color="gray.600">
                            {hour}
                        </Text>
                    </GridItem>
                ))}

                {/* Timeline Body Rows */}
                {DAYS.map((day) => {
                    const dayHeight = getRowHeight(day);
                    const dayEvents = MOCK_EVENTS.filter((e) => e.day === day);

                    return (
                        <Box key={day} display="contents">
                            {/* Sticky Left Sidebar: Day Labels */}
                            <GridItem position="sticky" left={0} bg="gray.50" zIndex={3} p={4} h={dayHeight} borderRight="2px solid" borderBottom="1px solid" borderColor="gray.200" display="flex" alignItems="flex-start" fontWeight="semibold" transition="height 0.2s">
                                <Text fontSize="sm" color="gray.700" mt={1}>
                                    {day}
                                </Text>
                            </GridItem>

                            {/* Event Track Area (Spans all 24 Hourly Columns) */}
                            <GridItem gridColumn="span 24" h={dayHeight} borderBottom="1px solid" borderColor="gray.200" position="relative" transition="height 0.2s" background={VISUAL_GRID_LINES} >
                                {dayEvents.map((event) => (
                                    <Box key={event.id} position="absolute" bg={event.color} color="white" borderRadius="md" px={2} py={1} zIndex={1} boxShadow="sm" {...calculateEventStyles(
                                        event.start,
                                        event.end,
                                        event.lane,
                                    )} >
                                        <Text fontSize="xs" fontWeight="bold" lineClamp={1}>
                                            {event.title}
                                        </Text>
                                        <Text fontSize="xx-small" opacity={0.8} lineClamp={1}>
                                            {formatTime(event.start)} - {formatTime(event.end)}
                                        </Text>
                                    </Box>
                                ))}
                            </GridItem>
                        </Box>
                    );
                })}
            </Grid>
        </Box>
    );
};

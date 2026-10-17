import { Tabs, Text } from "@chakra-ui/react";
import BookingsTab from "../../components/dashboards/rooms/BookingsTab";
import RoomsTab from "../../components/dashboards/rooms/RoomsTab";


export default function RoomsDashboard() {
  return (
    <>
      <Text data-testid="room-booking-page-heading" fontSize="xl" fontWeight="bold" mb="4">Room Bookings</Text>

      {/* lazyMount so the rooms tab only fetches once it's opened; no unmountOnExit
          so the bookings date filter survives switching tabs. */}
      <Tabs.Root defaultValue="bookings" lazyMount data-testid="room-booking-tabs">
        <Tabs.List mb="4">
          <Tabs.Trigger value="bookings" data-testid="room-booking-tab-bookings">Bookings</Tabs.Trigger>
          <Tabs.Trigger value="rooms" data-testid="room-booking-tab-rooms">Rooms</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="bookings">
          <BookingsTab />
        </Tabs.Content>
        <Tabs.Content value="rooms">
          <RoomsTab />
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}

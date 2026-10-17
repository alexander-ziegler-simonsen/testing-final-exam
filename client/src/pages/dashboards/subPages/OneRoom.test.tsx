import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneRoom from "./OneRoom";
import { Provider } from "../../../components/ui/provider";

// OneRoom reads the room id from the route (useParams), so it needs a
// matching <Route>. It loads floors/rooms, all bookings, and all patients,
// all served by the default MSW handlers, then finds the room and its
// bookings client-side. Room 1 ("Room 001", Ground Floor) has one booking
// (id 1, patient 1) in the fixtures - see mocks/fixtures/responses/RoomFixture.ts
// and RoomBookingFixture.ts.
function renderOneRoom() {
    return render(
        <Routes>
            <Route path="/app/room_booking/room/:id" element={<OneRoom />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/room_booking/room/1"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the room and its booking history", async () => {
    const { getByTestId, container } = await renderOneRoom();

    await expect.element(getByTestId("one-room-heading")).toHaveTextContent("Room 001");
    await expect.element(getByTestId("one-room-floor")).toHaveTextContent("Ground Floor");

    await expect
        .element(getByTestId("one-room-booking-row-1"))
        .toHaveTextContent("Lars Jensen");

    await matchScreenshot(container, "one-room");
});

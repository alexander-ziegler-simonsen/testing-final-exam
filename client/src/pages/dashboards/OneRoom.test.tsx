import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneRoom from "./OneRoom";
import { Provider } from "../../components/ui/provider";

// OneRoom reads the room id from the route (useParams), so it needs a
// matching <Route>. It loads floors/rooms, all bookings, and all patients,
// all served by the default MSW handlers, then finds the room and its
// bookings client-side. Room 14 ("Room 201", 2nd floor) has one booking
// (id 4, patient 42) in the fixtures - see mocks/fixtures/location.ts and
// roomBooking.ts.
function renderOneRoom() {
    return render(
        <Routes>
            <Route path="/app/room_booking/room/:id" element={<OneRoom />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/room_booking/room/14"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the room and its booking history", async () => {
    const { getByTestId, container } = await renderOneRoom();

    await expect.element(getByTestId("one-room-heading")).toHaveTextContent("Room 201");
    await expect.element(getByTestId("one-room-floor")).toHaveTextContent("2nd floor");

    await expect
        .element(getByTestId("one-room-booking-row-4"))
        .toHaveTextContent("Mette Sørensen");

    await expect(container).toMatchScreenshot("one-room");
});

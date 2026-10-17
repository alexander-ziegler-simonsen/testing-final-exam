import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneRoomBooking from "./OneRoomBooking";
import { Provider } from "../../../components/ui/provider";

// OneRoomBooking reads the booking id from the route (useParams), so it
// needs a matching <Route>. RoomBookingService.getById and PatientService
// are served by the default MSW handlers, which look the rows up by id -
// booking 1 is for room 1 ("Room 001") and patient 1 ("Lars Jensen").
function renderOneRoomBooking() {
    return render(
        <Routes>
            <Route path="/app/room_booking/:id" element={<OneRoomBooking />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/room_booking/1"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the booking with its room and patient details", async () => {
    const { getByTestId, container } = await renderOneRoomBooking();

    await expect.element(getByTestId("one-room-booking-heading")).toHaveTextContent("Booking #1");
    await expect.element(getByTestId("one-room-booking-field-room")).toHaveTextContent("Room 001");
    await expect
        .element(getByTestId("one-room-booking-patient-link"))
        .toHaveTextContent("Lars Jensen");

    await matchScreenshot(container, "one-room-booking");
});

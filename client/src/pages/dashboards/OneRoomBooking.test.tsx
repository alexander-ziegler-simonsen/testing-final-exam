import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneRoomBooking from "./OneRoomBooking";
import { Provider } from "../../components/ui/provider";

// OneRoomBooking reads the booking id from the route (useParams), so it
// needs a matching <Route>. RoomBookingService.getById and PatientService
// are served by the default MSW handlers regardless of which id is
// requested, returning mockRoomBooking (id 4) and mockPatient (id 42), which
// consistently share fkPatientId 42.
function renderOneRoomBooking() {
    return render(
        <Routes>
            <Route path="/app/room_booking/:id" element={<OneRoomBooking />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/room_booking/4"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the booking with its room and patient details", async () => {
    const { getByTestId, container } = await renderOneRoomBooking();

    await expect.element(getByTestId("one-room-booking-heading")).toHaveTextContent("Booking #4");
    await expect.element(getByTestId("one-room-booking-field-room")).toHaveTextContent("Room 201");
    await expect
        .element(getByTestId("one-room-booking-patient-link"))
        .toHaveTextContent("Mette Sørensen");

    await expect(container).toMatchScreenshot("one-room-booking");
});

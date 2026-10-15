import { expect, test } from "vitest";
import { matchScreenshot } from "../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import RoomBooking from "./RoomBooking";
import { Provider } from "../../components/ui/provider";

// RoomBooking joins RoomBookingService, LocationService (floors/rooms), and
// PatientService data, all served by the default MSW handlers - see
// mocks/fixtures/roomBooking.ts, location.ts, patient.ts.
function renderRoomBooking() {
    return render(<RoomBooking />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("resolves each booking's room and patient names", async () => {
    const { getByTestId, container } = await renderRoomBooking();

    await expect.element(getByTestId("room-booking-page-heading")).toBeInTheDocument();

    // mockRoomBooking.fkRoomId (14) -> "Room 201", fkPatientId (42) -> "Mette Sørensen".
    await expect
        .element(getByTestId("room-booking-table-row-0-cell-roomName"))
        .toHaveTextContent("Room 201");
    await expect
        .element(getByTestId("room-booking-table-row-0-cell-patientName"))
        .toHaveTextContent("Mette Sørensen");

    await matchScreenshot(container, "room-booking");
});

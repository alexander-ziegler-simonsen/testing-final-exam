import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import { Provider } from "../../../components/ui/provider";
import RoomBooking from "./RoomBooking";

// RoomBooking joins RoomBookingService, LocationService (floors/rooms), and
// PatientService data, all served by the default MSW handlers - see
// mocks/fixtures/responses/RoomBookingFixture.ts, FloorRoomsFixture.ts, PatientFixture.ts.
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

    // mockRoomBookingResponse.fkRoomId (1) -> "Room 001", fkPatientId (1) -> "Lars Jensen".
    await expect
        .element(getByTestId("room-booking-table-row-0-cell-roomName"))
        .toHaveTextContent("Room 001");
    await expect
        .element(getByTestId("room-booking-table-row-0-cell-patientName"))
        .toHaveTextContent("Lars Jensen");

    await matchScreenshot(container, "room-booking");
});

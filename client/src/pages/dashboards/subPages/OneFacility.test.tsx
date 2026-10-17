import { expect, test } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneFacility from "./OneFacility";
import { Provider } from "../../../components/ui/provider";

// OneFacility reads the building id from the route (useParams), so it needs
// to be rendered under a matching <Route>, not just a bare <MemoryRouter>.
// LocationService.getById is served by the default MSW handler, which looks
// the building up by id - building 1 is mockLocationResponse, with floor 1
// ("Ground Floor", rooms 1-2) and floor 2 ("First Floor", room 3) - see
// mocks/fixtures/responses/LocationFixture.ts.
function renderOneFacility() {
    return render(
        <Routes>
            <Route path="/app/facilities/:id" element={<OneFacility />} />
        </Routes>,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter initialEntries={["/app/facilities/1"]}>{children}</MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("loads the building and lists its floors and rooms", async () => {
    const { getByTestId, container } = await renderOneFacility();

    await expect
        .element(getByTestId("one-facility-heading"))
        .toHaveTextContent("Main Building");
    await expect
        .element(getByTestId("one-facility-address"))
        .toHaveTextContent("Hospitalsvej 1, 2100 København Ø");

    await expect
        .element(getByTestId("one-facility-floor-1"))
        .toHaveTextContent("Ground Floor");
    await expect
        .element(getByTestId("one-facility-room-1"))
        .toHaveTextContent("Room 001");

    await matchScreenshot(container, "one-facility");
});

import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes } from "react-router";
import OneFacility from "./OneFacility";
import { Provider } from "../../components/ui/provider";

// OneFacility reads the building id from the route (useParams), so it needs
// to be rendered under a matching <Route>, not just a bare <MemoryRouter>.
// LocationService.getById is served by the default MSW handler regardless of
// which id is requested, returning mockLocation (building id 1) - see
// mocks/fixtures/location.ts.
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
        .toHaveTextContent("Nørrebrogade 44, 8000 Aarhus C");

    await expect
        .element(getByTestId("one-facility-floor-2"))
        .toHaveTextContent("2nd floor");
    await expect
        .element(getByTestId("one-facility-room-14"))
        .toHaveTextContent("Room 201");

    await expect(container).toMatchScreenshot("one-facility");
});

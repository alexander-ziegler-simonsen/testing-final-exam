import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Facilities from "./Facilities";
import { Provider } from "../../components/ui/provider";

// Facilities fetches via LocationService, served here by the default MSW
// handlers, which return the fixtures from mocks/fixtures/location.ts.
function renderFacilities() {
    return render(<Facilities />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("loads locations from the API and renders them in the table", async () => {
    const { getByTestId } = await renderFacilities();

    await expect.element(getByTestId("facilities-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("facilities-table-row-0-cell-name"))
        .toHaveTextContent("Main Building");
    await expect
        .element(getByTestId("facilities-table-row-0-cell-address"))
        .toHaveTextContent("Nørrebrogade 44, 8000 Aarhus C");
});

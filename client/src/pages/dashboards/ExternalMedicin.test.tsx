import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import ExternalMedicin from "./ExternalMedicin";
import { Provider } from "../../components/ui/provider";
import { useExternalMedicinStore } from "../../stores/ExternalMedicinStore";

// The last search is kept in the (non-persisted) ExternalMedicinStore so it
// survives navigating to a detail page and back - reset it so a search made
// here doesn't leak into other tests in the same browser tab.
afterEach(() => {
    useExternalMedicinStore.getState().setSearch({ searchMode: "name", query: "", results: [], searched: false });
});

function renderExternalMedicin() {
    return render(<ExternalMedicin />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("searches by name and renders the matching products", async () => {
    const { getByTestId } = await renderExternalMedicin();

    await getByTestId("external-medicin-search-input").fill("Panodil");
    await getByTestId("external-medicin-search-button").click();

    await expect
        .element(getByTestId("external-medicin-row-0"))
        .toHaveTextContent("Panodil");
    await expect
        .element(getByTestId("external-medicin-row-0"))
        .toHaveTextContent("GlaxoSmithKline Consumer Healthcare");
});

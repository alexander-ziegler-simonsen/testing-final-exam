import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import MedicinStorage from "./MedicinStorage";
import { Provider } from "../../components/ui/provider";

// MedicinStorage joins MedicationStorageService and MedicationService data,
// both served by the default MSW handlers - see mocks/fixtures/medication.ts
// and mocks/fixtures/medicationStorage.ts.
function renderMedicinStorage() {
    return render(<MedicinStorage />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("resolves each storage row's medication name and amount", async () => {
    const { getByTestId } = await renderMedicinStorage();

    await expect.element(getByTestId("medicin-storage-page-heading")).toBeInTheDocument();

    // mockStorage.fkMedicationId (11) resolves against the medication list to "Panodil".
    await expect
        .element(getByTestId("medicin-storage-table-row-0-cell-medicationName"))
        .toHaveTextContent("Panodil");
    await expect
        .element(getByTestId("medicin-storage-table-row-0-cell-amount"))
        .toHaveTextContent("142");
});

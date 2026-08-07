import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import MissingMedicin from "./MissingMedicin";
import { Provider } from "../../components/ui/provider";

// MissingMedicin only renders Chakra components (no router/auth involved),
// and fetches via MedicationStorageMissingService, served by the default MSW
// handler - see mocks/fixtures/medicationStorageMissing.ts.
function renderMissingMedicin() {
    return render(<MissingMedicin />, {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
    });
}

test("loads missing-storage reports and renders them in the table", async () => {
    const { getByTestId, container } = await renderMissingMedicin();

    await expect.element(getByTestId("missing-medicine-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("missing-medicine-table-row-0-cell-amountMissing"))
        .toHaveTextContent("12");
    await expect
        .element(getByTestId("missing-medicine-table-row-0-cell-fkMedicationStorageId"))
        .toHaveTextContent("5");

    await expect(container).toMatchScreenshot("missing-medicin");
});

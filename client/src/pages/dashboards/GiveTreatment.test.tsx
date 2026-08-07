import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import GiveTreatment from "./GiveTreatment";
import { Provider } from "../../components/ui/provider";

// GiveTreatment loads patients/medications/storages via Promise.all before
// rendering the form (see its `dataLoading` state), served here by the
// default MSW handlers.
function renderGiveTreatment() {
    return render(<GiveTreatment />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("renders the form once patient/medication data has loaded", async () => {
    const { getByTestId } = await renderGiveTreatment();

    await expect.element(getByTestId("give-treatment-page")).toBeInTheDocument();
    await expect.element(getByTestId("give-treatment-field-patient")).toBeInTheDocument();

    // No patient selected yet, so submit is disabled.
    await expect.element(getByTestId("give-treatment-submit-button")).toBeDisabled();
});

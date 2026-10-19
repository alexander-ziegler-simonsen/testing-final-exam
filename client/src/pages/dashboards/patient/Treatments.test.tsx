import { afterEach, expect, test, vi } from "vitest";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import { Provider } from "../../../components/ui/provider";
import { useAuthStore } from "../../../stores/AuthStore";
import { PatientService } from "../../../api/Services/Patient";
import { TreatmentService } from "../../../api/Services/Treatment";
import Treatments from "./Treatments";

// Treatments fetches via TreatmentService, served here by the default MSW
// handlers, which return the fixtures from mocks/fixtures/responses/TreatmentFixture.ts.
function renderTreatments() {
    return render(<Treatments />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

function loginAsPatient(patientId: number | null) {
    useAuthStore.getState().setSession("fake-token", {
        staffId: null,
        patientId,
        firstName: "Paula",
        lastName: "Patient",
        role: "patient",
    });
}

afterEach(() => {
    useAuthStore.getState().clearSession();
    vi.restoreAllMocks();
});

test("loads treatments from the API and renders them in the table", async () => {
    const { getByTestId, container } = await renderTreatments();

    await expect.element(getByTestId("treatments-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("treatments-table-row-0-cell-description"))
        .toHaveTextContent("Initial examination and blood test.");
    await expect
        .element(getByTestId("treatments-table-row-0-cell-fkPatientId"))
        .toHaveTextContent("1");

    await matchScreenshot(container, "treatments");
});

test("a logged-in patient only sees their own treatments and can't change them", async () => {
    const getAllPatients = vi.spyOn(PatientService, "getAll");
    // the fixtures hold two treatments for patient 1 and one for patient 2
    loginAsPatient(1);

    const { getByTestId } = await renderTreatments();

    await expect
        .element(getByTestId("treatments-table-row-0-cell-description"))
        .toHaveTextContent("Initial examination and blood test.");
    await expect
        .element(getByTestId("treatments-table-row-1-cell-description"))
        .toHaveTextContent("Follow-up on blood test results.");
    await expect.element(getByTestId("treatments-table-row-2")).not.toBeInTheDocument();

    await expect.element(getByTestId("treatments-table-header-actions")).not.toBeInTheDocument();
    await expect.element(getByTestId("treatments-edit-1")).not.toBeInTheDocument();
    expect(getAllPatients).not.toHaveBeenCalled();
});

test("a patient without a patient id gets no treatments instead of everyone's", async () => {
    const getAllTreatments = vi.spyOn(TreatmentService, "getAll");
    loginAsPatient(null);

    const { getByTestId } = await renderTreatments();

    await expect.element(getByTestId("treatments-table-empty-state")).toBeInTheDocument();
    expect(getAllTreatments).not.toHaveBeenCalled();
});

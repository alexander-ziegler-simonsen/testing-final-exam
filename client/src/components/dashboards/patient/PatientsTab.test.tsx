import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { MemoryRouter, useLocation } from "react-router";
import { Provider } from "../../ui/provider";
import PatientsTab from "./PatientsTab";
import { mockPatients } from "../../../mocks/fixtures/patient";
import { matchScreenshot } from "../../../test-utils/matchScreenshot";

// https://testing-library.com/docs/example-react-router/
function LocationDisplay(){
    const location = useLocation();
    return <div data-testid="location-display">{location.pathname}</div>;
}

function renderPatientsTab() {
    return render(
        <PatientsTab />,
        {
            wrapper: ({ children }) => (
                <Provider>
                    <MemoryRouter>
                        {children}
                        <LocationDisplay />
                    </MemoryRouter>
                </Provider>
            ),
        },
    );
}

test("renders all the patients", async () => {
    const { getByTestId } = await renderPatientsTab();

    await expect.element(getByTestId("patients-table-row-0")).toBeInTheDocument();
    await expect.element(getByTestId("patients-table-row-0-cell-id")).toHaveTextContent(String(mockPatients[0].id));
    await expect.element(getByTestId("patients-table-row-0-cell-firstname")).toHaveTextContent(mockPatients[0].firstname!);
    await expect.element(getByTestId("patients-table-row-0-cell-lastname")).toHaveTextContent(mockPatients[0].lastname!);
    await expect.element(getByTestId("patients-table-row-0-cell-gender")).toHaveTextContent(mockPatients[0].gender!);
    await expect.element(getByTestId("patients-table-row-0-cell-cprNumber")).toHaveTextContent(mockPatients[0].cprNumber!);
    await expect.element(getByTestId("patients-table-row-0-cell-dateOfBirth")).toHaveTextContent(mockPatients[0].dateOfBirth!);
    await expect.element(getByTestId("patients-table-row-0-cell-weightKg")).toHaveTextContent(String(mockPatients[0].weightKg));
    await expect.element(getByTestId("patients-table-row-0-cell-heightCm")).toHaveTextContent(String(mockPatients[0].heightCm));

    await expect.element(getByTestId("patients-table-row-1")).toBeInTheDocument();
    await expect.element(getByTestId("patients-table-row-1-cell-id")).toHaveTextContent(String(mockPatients[1].id));
    await expect.element(getByTestId("patients-table-row-1-cell-firstname")).toHaveTextContent(mockPatients[1].firstname!);
    await expect.element(getByTestId("patients-table-row-1-cell-lastname")).toHaveTextContent(mockPatients[1].lastname!);
    await expect.element(getByTestId("patients-table-row-1-cell-gender")).toHaveTextContent(mockPatients[1].gender!);
    await expect.element(getByTestId("patients-table-row-1-cell-cprNumber")).toHaveTextContent(mockPatients[1].cprNumber!);
    await expect.element(getByTestId("patients-table-row-1-cell-dateOfBirth")).toHaveTextContent(mockPatients[1].dateOfBirth!);
    await expect.element(getByTestId("patients-table-row-1-cell-weightKg")).toHaveTextContent(String(mockPatients[1].weightKg));
    await expect.element(getByTestId("patients-table-row-1-cell-heightCm")).toHaveTextContent(String(mockPatients[1].heightCm));

    await expect.element(getByTestId("patients-table-row-2")).toBeInTheDocument();
    await expect.element(getByTestId("patients-table-row-2-cell-id")).toHaveTextContent(String(mockPatients[2].id));
    await expect.element(getByTestId("patients-table-row-2-cell-firstname")).toHaveTextContent(mockPatients[2].firstname!);
    await expect.element(getByTestId("patients-table-row-2-cell-lastname")).toHaveTextContent(mockPatients[2].lastname!);
    await expect.element(getByTestId("patients-table-row-2-cell-gender")).toHaveTextContent(mockPatients[2].gender!);
    await expect.element(getByTestId("patients-table-row-2-cell-cprNumber")).toHaveTextContent(mockPatients[2].cprNumber!);
    await expect.element(getByTestId("patients-table-row-2-cell-dateOfBirth")).toHaveTextContent(mockPatients[2].dateOfBirth!);
    await expect.element(getByTestId("patients-table-row-2-cell-weightKg")).toHaveTextContent(String(mockPatients[2].weightKg));
    await expect.element(getByTestId("patients-table-row-2-cell-heightCm")).toHaveTextContent(String(mockPatients[2].heightCm));

    
    await page.viewport(1024, 1024);
    await matchScreenshot(getByTestId("patients-table").element(), "patients-table-read");
});

test("click one and navigate to different page", async () => {
    const { getByTestId } = await renderPatientsTab();
    

    await expect.element(getByTestId("patients-table-row-0")).toBeInTheDocument();

    await getByTestId("patients-table-row-0").click();

    await expect.element(getByTestId("location-display")).toHaveTextContent(`/app/patients/${mockPatients[0].id}`);

    await page.viewport(1024, 1024);
    await matchScreenshot(getByTestId("patients-table").element(), "patients-navigate-click");
});
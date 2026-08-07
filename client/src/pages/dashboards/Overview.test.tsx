import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import Overview from "./Overview";
import { Provider } from "../../components/ui/provider";

// Overview only renders static Chakra components (InfoCard), no router/auth
// involved, so it only needs ChakraProvider.
function renderOverview() {
    return render(<Overview />, {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
    });
}

test("renders the overview page with its stat cards", async () => {
    const { getByTestId, container } = await renderOverview();

    await expect.element(getByTestId("overview-page-heading")).toBeInTheDocument();

    await expect
        .element(getByTestId("overview-card-0-title"))
        .toHaveTextContent("Patients");
    await expect
        .element(getByTestId("overview-card-0-value"))
        .toHaveTextContent("253");

    // Card index 2 ("rooms in use") is the only one with a `type` badge, so
    // it also exercises InfoCard's type-badge branch.
    await expect
        .element(getByTestId("overview-card-2-type"))
        .toHaveTextContent("B1");

    await expect(container).toMatchScreenshot("overview");
});

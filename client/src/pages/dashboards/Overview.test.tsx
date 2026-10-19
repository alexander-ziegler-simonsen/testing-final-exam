import { expect, test } from "vitest";
import { matchScreenshot } from "../../test-utils/matchScreenshot";
import { render } from "vitest-browser-react";
import Overview from "./Overview";
import { Provider } from "../../components/ui/provider";

function renderOverview() {
    return render(<Overview />, {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
    });
}

test("renders the overview front page", async () => {
    const { getByTestId, container } = await renderOverview();

    await expect
        .element(getByTestId("overview-page-heading"))
        .toHaveTextContent("Welcome to the Hospital System");
    await expect.element(getByTestId("overview-page-text")).toBeInTheDocument();

    await matchScreenshot(container, "overview");
});

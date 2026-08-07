import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import Shifts from "./Shifts";
import { Provider } from "../../components/ui/provider";

// Shifts only renders Chakra components (no router/auth involved), and
// fetches via ShiftService, served by the default MSW handler - see
// mocks/fixtures/shift.ts.
function renderShifts() {
    return render(<Shifts />, {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
    });
}

test("loads shifts and renders them on the timeline", async () => {
    const { getByTestId } = await renderShifts();

    await expect.element(getByTestId("shifts-page-heading")).toBeInTheDocument();
    await expect.element(getByTestId("shifts-timeline")).toBeInTheDocument();

    // mockShift (id 1) always renders as "Shift #1", regardless of which day
    // column it lands in.
    await expect
        .element(getByTestId("shifts-timeline-event-1"))
        .toHaveTextContent("Shift #1");
});

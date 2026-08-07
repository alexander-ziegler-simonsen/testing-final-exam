import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import Rooms from "./Rooms";

// Rooms is a static placeholder page - no providers needed.
test("renders the rooms page heading", async () => {
    const { getByTestId } = await render(<Rooms />);

    await expect
        .element(getByTestId("rooms-page-heading"))
        .toHaveTextContent("this is Rooms page");
});

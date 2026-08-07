import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import InfoCard from "./InfoCard";
import { Provider } from "../ui/provider";

// InfoCard renders plain Chakra components, so it only needs ChakraProvider
// (no router/auth involved), same as the other presentational components.
function renderInfoCard(props: React.ComponentProps<typeof InfoCard>) {
    return render(<InfoCard {...props} />, {
        wrapper: ({ children }) => <Provider>{children}</Provider>,
    });
}

test("renders the title, type badge, and value when a type is given", async () => {
    const { getByTestId } = await renderInfoCard({
        title: "Beds available",
        value: "12",
        type: "ward",
        testId: "info-card",
    });

    await expect
        .element(getByTestId("info-card-title"))
        .toHaveTextContent("Beds available");
    await expect
        .element(getByTestId("info-card-type"))
        .toHaveTextContent("ward");
    await expect
        .element(getByTestId("info-card-value"))
        .toHaveTextContent("12");
});

test("omits the type badge when no type is given", async () => {
    const { getByTestId } = await renderInfoCard({
        title: "Beds available",
        value: "12",
        testId: "info-card",
    });

    await expect
        .element(getByTestId("info-card-title"))
        .toHaveTextContent("Beds available");
    await expect
        .element(getByTestId("info-card-type"))
        .not.toBeInTheDocument();
});


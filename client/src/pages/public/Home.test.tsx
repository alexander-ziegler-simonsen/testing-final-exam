import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Home from "./Home";
import { Provider } from "../../components/ui/provider";

// Home renders Navbar/Footer, which use react-router <Link>s (needs a
// Router) and Chakra components (needs ChakraProvider), same wrapper
// pattern as the other public pages' tests.
function renderHome() {
    return render(<Home />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("renders the home page with its navbar, hero content, feature cards, and footer", async () => {
    const { getByTestId, getByText } = await renderHome();

    await expect.element(getByTestId("public-navbar")).toBeInTheDocument();
    await expect.element(getByTestId("home-page")).toBeInTheDocument();

    await expect
        .element(getByText("Compassionate care, modern medicine."))
        .toBeInTheDocument();
    await expect
        .element(getByTestId("home-explore-services-button"))
        .toBeInTheDocument();

    await expect
        .element(getByTestId("home-feature-emergency"))
        .toHaveTextContent("24/7 Emergency");
    await expect
        .element(getByTestId("home-feature-specialists"))
        .toHaveTextContent("120+ Specialists");
    await expect
        .element(getByTestId("home-feature-accredited"))
        .toHaveTextContent("Accredited care");

    await expect.element(getByTestId("home-hero-image")).toBeInTheDocument();
    await expect.element(getByTestId("public-footer")).toBeInTheDocument();
});

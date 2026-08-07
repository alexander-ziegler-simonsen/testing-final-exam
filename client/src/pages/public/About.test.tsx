import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import About from "./About";
import { Provider } from "../../components/ui/provider";

// About renders Navbar/Footer, which use react-router <Link>s (needs a
// Router) and Chakra components (needs ChakraProvider), same wrapper
// pattern as the component tests (e.g. Footer.test.tsx).
function renderAbout() {
    return render(<About />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("renders the about page with its navbar, content, and footer", async () => {
    const { getByTestId, getByText } = await renderAbout();

    await expect.element(getByTestId("public-navbar")).toBeInTheDocument();
    await expect.element(getByTestId("about-page")).toBeInTheDocument();
    await expect
        .element(getByText("A hospital built around the patient."))
        .toBeInTheDocument();
    await expect.element(getByTestId("public-footer")).toBeInTheDocument();
});
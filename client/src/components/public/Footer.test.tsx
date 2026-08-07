import Footer from "./Footer";
import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import { Provider } from "../ui/provider";

// Footer renders react-router <Link>s (needs a Router) and Chakra components
// (needs ChakraProvider), same wrapper pattern as LoginCompoent.test.tsx.
function renderFooter() {
    return render(<Footer />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("renders all quick links pointing at their expected routes", async () => {
    const { getByTestId } = await renderFooter();

    await expect.element(getByTestId("public-footer")).toBeInTheDocument();

    await expect
        .element(getByTestId("public-footer-home-link"))
        .toHaveAttribute("href", "/");
    await expect
        .element(getByTestId("public-footer-about-link"))
        .toHaveAttribute("href", "/about");
    await expect
        .element(getByTestId("public-footer-doctors-link"))
        .toHaveAttribute("href", "/doctors");
    await expect
        .element(getByTestId("public-footer-contact-link"))
        .toHaveAttribute("href", "/Contact");
    await expect
        .element(getByTestId("public-footer-login-link"))
        .toHaveAttribute("href", "/login");
});


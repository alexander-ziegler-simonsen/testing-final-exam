import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import { Provider } from "../ui/provider";
import Navbar from "./Navbar";

// Navbar renders react-router <Link>s (needs a Router) and Chakra components
// (needs ChakraProvider), same wrapper pattern as Footer.test.tsx.
function renderNavbar() {
    return render(<Navbar />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("renders all desktop nav links pointing at their expected routes", async () => {
    const { getByTestId } = await renderNavbar();

    await expect.element(getByTestId("public-navbar")).toBeInTheDocument();

    await expect.element(getByTestId("nav-home-link")).toHaveAttribute("href", "/");
    await expect.element(getByTestId("nav-about-link")).toHaveAttribute("href", "/about");
    await expect.element(getByTestId("nav-doctors-link")).toHaveAttribute("href", "/doctors");
    await expect.element(getByTestId("nav-contact-link")).toHaveAttribute("href", "/contact");
});

test("opens the mobile drawer when the menu toggle is clicked", async () => {
    const { getByTestId } = await renderNavbar();

    // Chakra's Drawer only mounts its content into the portal once opened,
    // so the drawer testid shouldn't exist in the DOM at all yet.
    await expect.element(getByTestId("nav-mobile-drawer")).not.toBeInTheDocument();

    await getByTestId("nav-mobile-menu-toggle").click();

    await expect.element(getByTestId("nav-mobile-drawer")).toBeVisible();
});


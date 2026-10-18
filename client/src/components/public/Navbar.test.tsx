import { expect, onTestFinished, test } from "vitest";
import { page, server } from "vitest/browser";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import { Provider } from "../ui/provider";
import Navbar from "./Navbar";

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
    const { width, height } = server.config.browser.viewport;
    await page.viewport(414, 896);
    onTestFinished(() => page.viewport(width, height));

    const { getByTestId } = await renderNavbar();

    await expect.element(getByTestId("nav-mobile-drawer")).not.toBeInTheDocument();

    await getByTestId("nav-mobile-menu-toggle").click();

    await expect.element(getByTestId("nav-mobile-drawer")).toBeVisible();
});


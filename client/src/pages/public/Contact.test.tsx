import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Contact from "./Contact";
import { Provider } from "../../components/ui/provider";

// Contact renders Navbar/Footer, which use react-router <Link>s (needs a
// Router) and Chakra components (needs ChakraProvider), same wrapper
// pattern as About.test.tsx.
function renderContact() {
    return render(<Contact />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("renders the contact page with its navbar, contact details, and footer", async () => {
    const { getByTestId } = await renderContact();

    await expect.element(getByTestId("public-navbar")).toBeInTheDocument();
    await expect.element(getByTestId("contact-page")).toBeInTheDocument();

    await expect
        .element(getByTestId("contact-detail-address"))
        .toHaveTextContent("Hospitalsvej 12");
    await expect
        .element(getByTestId("contact-detail-phone"))
        .toHaveTextContent("+45 33 12 45 67");
    await expect
        .element(getByTestId("contact-detail-email"))
        .toHaveTextContent("contact@fakemeridianhealth.dk");
    await expect
        .element(getByTestId("contact-detail-opening-hours"))
        .toHaveTextContent("Emergency room: 24/7");

    await expect.element(getByTestId("public-footer")).toBeInTheDocument();
});

test("lists each department's contact info in the directory", async () => {
    const { getByTestId } = await renderContact();

    await expect
        .element(getByTestId("contact-department-directory"))
        .toBeInTheDocument();

    // The department row markup renders twice (a desktop table row + a mobile
    // card sharing the same testid) with only one shown at a time via CSS
    // `display`, so pick the first match rather than assuming a single node.
    await expect
        .element(getByTestId("contact-department-cardiology").first())
        .toHaveTextContent("+45 33 12 45 68");
    await expect
        .element(getByTestId("contact-department-oncology").first())
        .toHaveTextContent("oncology@fakemeridianhealth.dk");
});

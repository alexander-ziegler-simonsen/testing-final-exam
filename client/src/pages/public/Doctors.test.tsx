import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Doctors from "./Doctors";
import { Provider } from "../../components/ui/provider";

// Doctors renders Navbar/Footer, which use react-router <Link>s (needs a
// Router) and Chakra components (needs ChakraProvider), same wrapper
// pattern as About.test.tsx / Contact.test.tsx.
function renderDoctors() {
    return render(<Doctors />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

test("renders the doctors page with its navbar, doctor cards, and footer", async () => {
    const { getByTestId } = await renderDoctors();

    await expect.element(getByTestId("public-navbar")).toBeInTheDocument();
    await expect.element(getByTestId("doctors-page")).toBeInTheDocument();

    await expect
        .element(getByTestId("doctors-card-dr.-elena-marsh-name"))
        .toHaveTextContent("Dr. Elena Marsh");
    await expect
        .element(getByTestId("doctors-card-dr.-elena-marsh-specialty"))
        .toHaveTextContent("Cardiology");
    await expect
        .element(getByTestId("doctors-card-dr.-elena-marsh-department"))
        .toHaveTextContent("Heart & Vascular Center");
    await expect
        .element(getByTestId("doctors-card-dr.-elena-marsh-rating"))
        .toHaveTextContent("4.9");
    await expect
        .element(getByTestId("doctors-card-dr.-elena-marsh-years"))
        .toHaveTextContent("14 yrs experience");

    await expect.element(getByTestId("public-footer")).toBeInTheDocument();
});

import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import Navbar from "./Navbar";
import { Provider } from "../ui/provider";
import { useAuthStore } from "../../stores/AuthStore";

// Navbar reads the user off useAuthStore and renders a react-router <Link>,
// same wrapper pattern as LoginCompoent.test.tsx.
function renderNavbar() {
    return render(<Navbar />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

// The zustand auth store persists across tests in the same browser tab.
afterEach(() => {
    useAuthStore.getState().clearSession();
});

test("greets the logged-in user by name", async () => {
    useAuthStore.getState().setSession("fake-token", {
        staffId: 1,
        patientId: null,
        firstName: "Nancy",
        lastName: "Nurse",
        role: "nurse",
    });

    const { getByTestId } = await renderNavbar();

    await expect
        .element(getByTestId("dashboard-navbar-user-greeting"))
        .toHaveTextContent("Hello Nancy Nurse");
});

test("clears the session when the logout button is clicked", async () => {
    useAuthStore.getState().setSession("fake-token", {
        staffId: 1,
        patientId: null,
        firstName: "Nancy",
        lastName: "Nurse",
        role: "nurse",
    });

    const { getByTestId } = await renderNavbar();

    await getByTestId("dashboard-navbar-logout-button").click();

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
});


import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import MySidebar from "./Sidebar";
import { Provider } from "./ui/provider";
import { useAuthStore } from "../stores/AuthStore";

function renderSidebar() {
    return render(<MySidebar />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

afterEach(() => {
    useAuthStore.getState().clearSession();
});

test("only shows navigation links allowed for the logged-in user's role", async () => {
    useAuthStore.getState().setSession("fake-token", {
        staffId: 1,
        patientId: null,
        firstName: "Nancy",
        lastName: "Nurse",
        role: "nurse",
    });

    const { getByTestId } = await renderSidebar();

    await expect
        .element(getByTestId("sidebar-desktop-room-booking-link"))
        .toBeInTheDocument();

    await expect
        .element(getByTestId("sidebar-desktop-staff-link"))
        .not.toBeInTheDocument();
});

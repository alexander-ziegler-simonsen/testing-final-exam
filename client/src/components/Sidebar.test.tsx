import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import MySidebar from "./Sidebar";
import { Provider } from "./ui/provider";
import { useAuthStore } from "../stores/AuthStore";

// MySidebar reads the role off useAuthStore and renders react-router <Link>s /
// Chakra components, so it needs the same Provider + MemoryRouter wrapper as
// LoginCompoent.test.tsx.
function renderSidebar() {
    return render(<MySidebar />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

// The zustand auth store persists across tests in the same browser tab, so a
// role set in one test would otherwise leak into the next.
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

    // "shifts" allows nurses.
    await expect
        .element(getByTestId("sidebar-desktop-shifts-link"))
        .toBeInTheDocument();

    // "staff" is admin-only, so a nurse should never see it.
    await expect
        .element(getByTestId("sidebar-desktop-staff-link"))
        .not.toBeInTheDocument();
});

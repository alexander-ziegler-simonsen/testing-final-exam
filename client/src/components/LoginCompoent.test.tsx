import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import LoginCompoent from "./LoginCompoent";
import { Provider } from "./ui/provider";
import { useAuthStore } from "../stores/AuthStore";

// The default MSW auth handler accepts the credentials in
// mocks/fixtures/requests/LoginFixture.ts (username = role, password
// "password") and answers anything else with a 401.
function renderLogin() {
    return render(<LoginCompoent />, {
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

test("shows an error when the password is wrong", async () => {
    const { getByTestId } = await renderLogin();

    await getByTestId("login-username-input").fill("doctor");
    await getByTestId("login-password-input").fill("wrong-password");
    await getByTestId("login-submit-button").click();

    await expect
        .element(getByTestId("login-feedback-text"))
        .toHaveTextContent('"Wrong username or password."');

    // And no session should have been created.
    expect(useAuthStore.getState().accessToken).toBeNull();
});

test("logs in successfully with a correct username and password", async () => {
    const { getByTestId } = await renderLogin();

    await getByTestId("login-username-input").fill("doctor");
    await getByTestId("login-password-input").fill("password");
    await getByTestId("login-submit-button").click();

    await expect
        .poll(() => useAuthStore.getState().accessToken)
        .toBe("mock-access-token");
});

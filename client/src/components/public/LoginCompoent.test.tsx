import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { HttpResponse } from "msw";
import { MemoryRouter } from "react-router";
import LoginCompoent from "./LoginCompoent";
import { Provider } from "../ui/provider";
import { worker } from "../../mocks/Browser";
import { handleAuthLogin } from "../../api/msw.gen";
import { useAuthStore } from "../../stores/AuthStore";

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
    // Override just the authLogin handler for this test. 
    worker.use(
        handleAuthLogin(() =>
            HttpResponse.json({ message: "Invalid username or password" }, { status: 401 }),
        ),
    );

    const { getByTestId } = await renderLogin();

    await getByTestId("login-username-input").fill("karen");
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

    await getByTestId("login-username-input").fill("karen");
    await getByTestId("login-password-input").fill("correct-password");
    await getByTestId("login-submit-button").click();

    await expect
        .poll(() => useAuthStore.getState().accessToken)
        .toBe("eyJhbGciOiJIUzI1NiJ9.fake.signature");
});

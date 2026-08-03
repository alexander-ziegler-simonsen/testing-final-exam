import { afterEach, expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { HttpResponse } from "msw";
import { MemoryRouter } from "react-router";
import LoginCompoent from "./LoginCompoent";
import { Provider } from "./ui/provider";
import { worker } from "../mocks/Browser";
import { handleAuthLogin } from "../api/msw.gen";
import { useAuthStore } from "../stores/AuthStore";

// "Browser mode" (vs. jsdom/happy-dom "unit" mode) renders this component into a
// real Chromium tab via Playwright. That's why we get real layout, real <input>
// elements, and can drive them with the same `.fill()` / `.click()` a user would
// perform - no DOM emulation involved. The tradeoff is speed, which is why we keep
// these for user-facing flows and leave plain logic (see Patient.unit.test.ts) to
// the fast jsdom project.

// LoginCompoent calls useNavigate() (needs a Router) and renders Chakra
// components (needs ChakraProvider). Wiring those up is app setup, not something
// under test, so it lives in one small helper instead of every test.
function renderLogin() {
    return render(<LoginCompoent />, {
        wrapper: ({ children }) => (
            <Provider>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        ),
    });
}

// The MSW worker and the zustand auth store both persist across tests in the same
// browser tab (worker.resetHandlers() in vitest-setup only removes *handler
// overrides*, it doesn't touch app state). Without this, a successful login in one
// test would leave a session token that leaks into the next test.
afterEach(() => {
    useAuthStore.getState().clearSession();
});

test("shows an error when the password is wrong", async () => {
    // Override just the authLogin handler for this test. `handleAuthLogin` is
    // generated from the OpenAPI spec by msw.gen.ts, so it stays in sync with the
    // real endpoint shape. Passing a resolver function (instead of `{ body, status }`)
    // gives full control over the response.
    worker.use(
        handleAuthLogin(() =>
            HttpResponse.json({ message: "Invalid username or password" }, { status: 401 }),
        ),
    );

    const { getByTestId } = await renderLogin();

    await getByTestId("login-username-input").fill("karen");
    await getByTestId("login-password-input").fill("wrong-password");
    await getByTestId("login-submit-button").click();

    // AuthService.login() re-throws any failed request as a plain `Error`, without
    // the original response body attached. So LoginCompoent's `error.response?.data?.message`
    // lookup always comes back undefined here, and it always falls back to this
    // fixed string - the mocked status (401) is what matters, not the mocked body.
    // (The component wraps that fallback in JSON.stringify(), which is why the
    // literal quote characters show up around the sentence below - a real quirk
    // this test caught, not a typo.)
    await expect
        .element(getByTestId("login-feedback-text"))
        .toHaveTextContent('feedback: "Wrong username or password."');

    // And no session should have been created.
    expect(useAuthStore.getState().accessToken).toBeNull();
});

test("logs in successfully with a correct username and password", async () => {
    // No worker.use() override needed: handlers.ts already wires authLogin to
    // return fx.mockLogin with a 200 by default, which is exactly a "correct
    // credentials" response.

    const { getByTestId } = await renderLogin();

    await getByTestId("login-username-input").fill("karen");
    await getByTestId("login-password-input").fill("correct-password");
    await getByTestId("login-submit-button").click();

    await expect
        .element(getByTestId("login-feedback-text"))
        .toHaveTextContent("feedback: Login successful!");

    // The component's job isn't just to show text - it also has to hand the
    // token off to the auth store. Asserting on both is what actually proves
    // the login flow worked end to end.
    expect(useAuthStore.getState().accessToken).toBe("eyJhbGciOiJIUzI1NiJ9.fake.signature");
});

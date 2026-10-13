import { createMswHandlers } from "../../api/msw.gen";
import { mockLogin } from "../fixtures/auth";

const { pick } = createMswHandlers();

export const authHandlers = [
    pick.authLogin({ body: mockLogin }),
    pick.authRefresh(),
    pick.authLogout(),
];

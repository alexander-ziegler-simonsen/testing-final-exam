import { createMswHandlers } from "../../api/msw.gen";
import { mockUsers } from "../fixtures/user";

const { pick } = createMswHandlers();

export const userHandlers = [
    pick.userGetAll({ body: mockUsers }),
    pick.userRegister({ body: true }),
    pick.userChangePassword({ body: null }),
    pick.userDelete({ body: null }),
];

import { z } from "zod";
import { fail, http } from "../client";
import { type RegisterUserRequest, RegisterUserRequestSchema } from "../Requests/RegisterUserRequest";
import { type UserResponse, UserResponseSchema } from "../Responses/UserResponse";

export const UserService = {
  getAll: async (): Promise<UserResponse[]> => {
    const { data } = await http.get("/api/User").catch(fail("Failed to load users"));
    return z.array(UserResponseSchema).parse(data);
  },

  register: async (newUser: RegisterUserRequest): Promise<void> => {
    const body = RegisterUserRequestSchema.parse(newUser);
    await http.post("/api/User/register", body).catch(fail("Failed to register user"));
  },

  changePassword: async (id: number, password: string): Promise<void> => {
    // the api takes the bare password as a JSON string ("\"secret\""), so it is encoded by hand -
    // axios would send a plain string body as-is (and a password like "12345678" would arrive as a number)
    const body = JSON.stringify(z.string().parse(password));
    await http
      .put(`/api/User/${id}/password`, body, { headers: { "Content-Type": "application/json" } })
      .catch(fail(`Failed to change password for user ${id}`));
  },

  delete: async (id: number): Promise<void> => {
    await http.delete(`/api/User/${id}`).catch(fail(`Failed to delete user ${id}`));
  },
};

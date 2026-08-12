import { userGetAll, userRegister, userChangePassword, userDelete } from "../api";
import { zUserRegisterBody, zUserChangePasswordBody } from "../api/zod.gen";
import type { HospitalApiDtosOutputsUserOutputDto, HospitalApiDtosInputsRegisterInputDto } from "../api";

export const UserService = {
  getAll: async (): Promise<HospitalApiDtosOutputsUserOutputDto[]> => {
    const { data, error } = await userGetAll();
    if (error) throw new Error("Failed to load users");
    return data;
  },

  register: async (newUser: HospitalApiDtosInputsRegisterInputDto): Promise<void> => {
    const body = zUserRegisterBody.parse(newUser);
    const { error } = await userRegister({ body });
    if (error) throw new Error("Failed to register user");
  },

  changePassword: async (id: number, password: string): Promise<void> => {
    const body = zUserChangePasswordBody.parse(password);
    const { error } = await userChangePassword({ path: { id }, body });
    if (error) throw new Error(`Failed to change password for user ${id}`);
  },

  delete: async (id: number): Promise<void> => {
    const { error } = await userDelete({ path: { id } });
    if (error) throw new Error(`Failed to delete user ${id}`);
  },
};

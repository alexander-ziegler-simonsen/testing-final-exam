import type { Department } from '../entites/Department';
import type { LoginRequest } from '../entites/LoginRequest';
import { api } from './Api';

const basePath = "/Auth";

export const AuthService = {
    login: (loginInput : LoginRequest) =>
        api.post<Department[]>(`${basePath}/login`, loginInput)
            .then(r => r.data),
}
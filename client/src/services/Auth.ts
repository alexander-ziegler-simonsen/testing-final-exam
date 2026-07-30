import type { LoginRequest } from '../entites/LoginRequest';
import type { LoginResponse } from '../entites/LoginResponse';
import { api } from './Api';

const basePath = "/Auth";

export const AuthService = {
    login: (loginInput : LoginRequest) =>
        api.post<LoginResponse>(`${basePath}/login`, loginInput)
            .then(r => r.data),
}
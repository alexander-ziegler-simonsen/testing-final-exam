import { apiFetch } from "../api/client"

const BASE = "/user"

export interface UserAccount {
    id: number
    username: string
    fkStaffId: number
}

export interface RegisterInput {
    username: string
    password: string
    fkStaffId: number
}

export const userService = {
    getAll: async (): Promise<UserAccount[]> => apiFetch<UserAccount[]>(BASE),
    register: async (input: RegisterInput): Promise<void> =>
        apiFetch<void>(`${BASE}/register`, { method: "POST", body: JSON.stringify(input) }),
    changePassword: async (id: number, newPassword: string): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}/password`, { method: "PUT", body: JSON.stringify(newPassword) }),
    delete: async (id: number): Promise<void> =>
        apiFetch<void>(`${BASE}/${id}`, { method: "DELETE" }),
}

import { apiFetch } from "../api/client"
import type { LoginResponse } from "../entites/LoginResponse"

const BASE = "/auth"

export const authService = {
    login: async (username: string, password: string): Promise<LoginResponse> => {
        return apiFetch<LoginResponse>(`${BASE}/login`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
        })
    },

    logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("staffId")
        localStorage.removeItem("firstname")
        localStorage.removeItem("lastname")
    },

    getToken: (): string | null => localStorage.getItem("token"),
    getRole: (): string | null => localStorage.getItem("role"),
    getStaffId: (): number | null => {
        const id = localStorage.getItem("staffId")
        return id ? parseInt(id) : null
    },
    getPatientId: (): number | null => {
        const id = localStorage.getItem("patientId")
        return id ? parseInt(id) : null
    },
    getFirstname: (): string | null => localStorage.getItem("firstname"),
    getLastname: (): string | null => localStorage.getItem("lastname"),
    getFullName: (): string => {
        const first = localStorage.getItem("firstname") ?? ""
        const last  = localStorage.getItem("lastname")  ?? ""
        return `${first} ${last}`.trim()
    },

    isLoggedIn: (): boolean => localStorage.getItem("token") !== null,
}

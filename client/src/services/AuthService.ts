import { apiFetch } from "../api/client"
import type { LoginResponse } from "../entites/LoginResponse"

const BASE = "/auth"
const SESSION_DURATION_MS = 6 * 60 * 60 * 1000

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
        localStorage.removeItem("loginTime")
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

    isLoggedIn: (): boolean => {
        const token = localStorage.getItem("token")
        const loginTime = localStorage.getItem("loginTime")
        if (!token || !loginTime) return false
        if (Date.now() - parseInt(loginTime) > SESSION_DURATION_MS) {
            authService.logout()
            return false
        }
        return true
    },
}

export interface LoginResponse {
    token: string
    staffId: number
    firstname: string | null
    lastname: string | null
    role: string
}

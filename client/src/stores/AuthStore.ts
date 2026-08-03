import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"

interface UserProfile {
    staffId: number | null
    firstName: string
    lastName: string
    role: 'doctor' | 'nurse' | 'admin' | 'patient'
}

interface AuthState {
    accessToken: string | null
    user: UserProfile | null
    setSession: (token: string, user: UserProfile) => void
    clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            user: null,
            setSession: (accessToken, user) => set({ accessToken, user }),
            clearSession: () => set({ accessToken: null, user: null }),
        }),
        {
            name: 'hospital-session-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
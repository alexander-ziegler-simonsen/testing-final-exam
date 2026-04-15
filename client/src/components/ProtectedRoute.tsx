import { Navigate, Outlet } from "react-router"
import { authService } from "../services/AuthService"

interface Props {
    allowedRoles?: string[]
}

export default function ProtectedRoute({ allowedRoles }: Props) {
    if (!authService.isLoggedIn()) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(authService.getRole() ?? "")) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

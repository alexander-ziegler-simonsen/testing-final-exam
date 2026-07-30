import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../../stores/AuthStore'

interface RoleProtectedRouteProps {
    allowedRoles: ('doctor' | 'nurse' | 'admin' | 'patient')[]
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ allowedRoles }) => {
    const user = useAuthStore((state) => state.user)

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(user.role)) {
        // If a patient wanders into staff pages, redirect them to treatments
        return <Navigate to="/app/treatment" replace />
    }

    return <Outlet />
}

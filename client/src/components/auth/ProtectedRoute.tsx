import React from 'react'
import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../../stores/AuthStore'

export const ProtectedRoute: React.FC = () => {
    const token = useAuthStore((state) => state.accessToken)

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

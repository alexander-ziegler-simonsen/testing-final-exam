// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

vi.mock('../services/AuthService', () => ({
    authService: {
        isLoggedIn: vi.fn(),
        getRole: vi.fn(),
    },
}))

import { authService } from '../services/AuthService'
import ProtectedRoute from './ProtectedRoute'

const mockIsLoggedIn = authService.isLoggedIn as ReturnType<typeof vi.fn>
const mockGetRole = authService.getRole as ReturnType<typeof vi.fn>

function renderRoutes(allowedRoles?: string[]) {
    return render(
        <ChakraProvider value={defaultSystem}>
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                        <Route path="/protected" element={<div>Protected Content</div>} />
                    </Route>
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        </ChakraProvider>
    )
}

describe('ProtectedRoute', () => {
    beforeEach(() => vi.clearAllMocks())

    it('redirects to /login when the user is not logged in', () => {
        // Arrange
        mockIsLoggedIn.mockReturnValue(false)

        // Act
        renderRoutes(['doctor'])

        // Assert
        expect(screen.getByText('Login Page')).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('redirects to /login when logged in but the role is not in allowedRoles', () => {
        // Arrange
        mockIsLoggedIn.mockReturnValue(true)
        mockGetRole.mockReturnValue('nurse')

        // Act
        renderRoutes(['doctor', 'admin'])

        // Assert
        expect(screen.getByText('Login Page')).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('renders the Outlet when logged in with a matching role', () => {
        // Arrange
        mockIsLoggedIn.mockReturnValue(true)
        mockGetRole.mockReturnValue('doctor')

        // Act
        renderRoutes(['doctor'])

        // Assert
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
        expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    })

    it('renders the Outlet when the role is one of several allowed roles', () => {
        // Arrange
        mockIsLoggedIn.mockReturnValue(true)
        mockGetRole.mockReturnValue('admin')

        // Act
        renderRoutes(['doctor', 'nurse', 'admin'])

        // Assert
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('renders the Outlet when no allowedRoles restriction is given', () => {
        // Arrange
        mockIsLoggedIn.mockReturnValue(true)
        mockGetRole.mockReturnValue('nurse')

        // Act
        renderRoutes(undefined)

        // Assert
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })
})

// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent } from '../test-utils'
import { renderWithProviders } from '../test-utils'

vi.mock('../services/AuthService', () => ({
    authService: {
        isLoggedIn: vi.fn(),
        getRole: vi.fn(),
        logout: vi.fn(),
    },
}))

const mockNavigate = vi.fn()
vi.mock('react-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router')>()
    return { ...actual, useNavigate: () => mockNavigate }
})

import { authService } from '../services/AuthService'
import Navbar from './Navbar'

const mockIsLoggedIn = authService.isLoggedIn as ReturnType<typeof vi.fn>
const mockGetRole = authService.getRole as ReturnType<typeof vi.fn>

describe('Navbar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsLoggedIn.mockReturnValue(false)
        mockGetRole.mockReturnValue(null)
    })

    describe('when not logged in', () => {
        it('shows a Login button', () => {
            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.getByText('Login')).toBeInTheDocument()
        })

        it('does not show a Logout button', () => {
            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.queryByText('Logout')).not.toBeInTheDocument()
        })

        it('does not show a Dashboard button', () => {
            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
        })

        it('shows the standard nav links', () => {
            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.getByText('Home')).toBeInTheDocument()
            expect(screen.getByText('About')).toBeInTheDocument()
            expect(screen.getByText('Contact')).toBeInTheDocument()
        })
    })

    describe('when logged in', () => {
        beforeEach(() => {
            mockIsLoggedIn.mockReturnValue(true)
            mockGetRole.mockReturnValue('doctor')
        })

        it('shows a Logout button', () => {
            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.getByText('Logout')).toBeInTheDocument()
        })

        it('does not show a Login button', () => {
            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.queryByText('Login')).not.toBeInTheDocument()
        })

        it('shows a Dashboard button', () => {
            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.getByText('Dashboard')).toBeInTheDocument()
        })

        it('shows the doctor role icon', () => {
            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.getByText('🩺')).toBeInTheDocument()
        })

        it('calls authService.logout and navigates home when Logout is clicked', () => {
            // Arrange
            renderWithProviders(<Navbar />)

            // Act
            fireEvent.click(screen.getByText('Logout'))

            // Assert
            expect(authService.logout).toHaveBeenCalledOnce()
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
        })
    })

    describe('role icons', () => {
        it('shows the nurse icon for the nurse role', () => {
            // Arrange
            mockIsLoggedIn.mockReturnValue(true)
            mockGetRole.mockReturnValue('nurse')

            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.getByText('💉')).toBeInTheDocument()
        })

        it('shows the admin icon for the admin role', () => {
            // Arrange
            mockIsLoggedIn.mockReturnValue(true)
            mockGetRole.mockReturnValue('admin')

            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.getByText('🛡️')).toBeInTheDocument()
        })

        it('shows no role icon for an unknown role', () => {
            // Arrange
            mockIsLoggedIn.mockReturnValue(true)
            mockGetRole.mockReturnValue('unknown')

            // Act
            renderWithProviders(<Navbar />)

            // Assert
            expect(screen.queryByText('🩺')).not.toBeInTheDocument()
            expect(screen.queryByText('💉')).not.toBeInTheDocument()
        })
    })
})

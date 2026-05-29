// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '../test-utils'
import { renderWithProviders } from '../test-utils'

vi.mock('../services/AuthService', () => ({
    authService: {
        login: vi.fn(),
    },
}))

const mockNavigate = vi.fn()
vi.mock('react-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router')>()
    return { ...actual, useNavigate: () => mockNavigate }
})

import { authService } from '../services/AuthService'
import Login from './Login'

const mockLogin = authService.login as ReturnType<typeof vi.fn>

describe('Login page', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('rendering', () => {
        it('renders a username input', () => {
            // Act
            renderWithProviders(<Login />)

            // Assert
            expect(screen.getByPlaceholderText('username')).toBeInTheDocument()
        })

        it('renders a password input', () => {
            // Act
            renderWithProviders(<Login />)

            // Assert
            expect(screen.getByPlaceholderText('password')).toBeInTheDocument()
        })

        it('renders a Login button', () => {
            // Act
            renderWithProviders(<Login />)

            // Assert
            expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
        })

        it('does not show an error message on initial render', () => {
            // Act
            renderWithProviders(<Login />)

            // Assert
            expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument()
        })
    })

    describe('successful login', () => {
        it('calls authService.login with the entered username and password', async () => {
            // Arrange
            mockLogin.mockResolvedValue({ token: 'tok', role: 'doctor', staffId: 1, firstname: 'Alice', lastname: 'Smith' })
            renderWithProviders(<Login />)
            fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'alice' } })
            fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'secret' } })

            // Act
            fireEvent.click(screen.getByRole('button', { name: /Login/i }))

            // Assert
            await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('alice', 'secret'))
        })

        it('navigates to /doctor after a successful doctor login', async () => {
            // Arrange
            mockLogin.mockResolvedValue({ token: 'tok', role: 'doctor', staffId: 1, firstname: 'Alice', lastname: 'Smith' })
            renderWithProviders(<Login />)

            // Act
            fireEvent.click(screen.getByRole('button', { name: /Login/i }))

            // Assert
            await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/doctor'))
        })

        it('navigates to /nurse after a successful nurse login', async () => {
            // Arrange
            mockLogin.mockResolvedValue({ token: 'tok', role: 'nurse', staffId: 2, firstname: 'Bob', lastname: 'Jones' })
            renderWithProviders(<Login />)

            // Act
            fireEvent.click(screen.getByRole('button', { name: /Login/i }))

            // Assert
            await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/nurse'))
        })

        it('navigates to /admin after a successful admin login', async () => {
            // Arrange
            mockLogin.mockResolvedValue({ token: 'tok', role: 'admin', staffId: 3, firstname: 'Carol', lastname: 'White' })
            renderWithProviders(<Login />)

            // Act
            fireEvent.click(screen.getByRole('button', { name: /Login/i }))

            // Assert
            await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin'))
        })

        it('navigates to / for an unrecognised role', async () => {
            // Arrange
            mockLogin.mockResolvedValue({ token: 'tok', role: 'unknown', staffId: 4, firstname: '', lastname: '' })
            renderWithProviders(<Login />)

            // Act
            fireEvent.click(screen.getByRole('button', { name: /Login/i }))

            // Assert
            await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
        })
    })

    describe('failed login', () => {
        it('shows an error message when login throws', async () => {
            // Arrange
            mockLogin.mockRejectedValue(new Error('Unauthorized'))
            renderWithProviders(<Login />)

            // Act
            fireEvent.click(screen.getByRole('button', { name: /Login/i }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Invalid username or password')).toBeInTheDocument()
            )
        })

        it('does not navigate when login fails', async () => {
            // Arrange
            mockLogin.mockRejectedValue(new Error('Unauthorized'))
            renderWithProviders(<Login />)

            // Act
            fireEvent.click(screen.getByRole('button', { name: /Login/i }))
            await waitFor(() => expect(mockLogin).toHaveBeenCalled())

            // Assert
            expect(mockNavigate).not.toHaveBeenCalled()
        })
    })
})

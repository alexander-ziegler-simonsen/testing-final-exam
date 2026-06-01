// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/UserService', () => ({
    userService: {
        getAll: vi.fn(),
        register: vi.fn(),
        changePassword: vi.fn(),
        delete: vi.fn(),
    },
}))
vi.mock('../services/StaffService', () => ({
    staffService: { getAll: vi.fn() },
}))

import { userService } from '../services/UserService'
import { staffService } from '../services/StaffService'
import UserManagement from './UserManagement'

const mockUserGetAll = userService.getAll as ReturnType<typeof vi.fn>
const mockRegister = userService.register as ReturnType<typeof vi.fn>
const mockChangePw = userService.changePassword as ReturnType<typeof vi.fn>
const mockDelete = userService.delete as ReturnType<typeof vi.fn>
const mockStaffGetAll = staffService.getAll as ReturnType<typeof vi.fn>

const sampleStaff = [{ id: 1, firstname: 'Jane', lastname: 'Doe', fkRoleId: 2 }]
const sampleUsers = [{ id: 10, username: 'jdoe', fkStaffId: 1 }]

describe('UserManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockUserGetAll.mockResolvedValue(sampleUsers)
        mockStaffGetAll.mockResolvedValue(sampleStaff)
        mockRegister.mockResolvedValue(undefined)
        mockChangePw.mockResolvedValue(undefined)
        mockDelete.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockUserGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<UserManagement />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockUserGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<UserManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load users.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders each username in the table', async () => {
            // Act
            renderWithChakra(<UserManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('jdoe')).toBeInTheDocument())
        })

        it('resolves staff name from the staff list', async () => {
            // Act
            renderWithChakra(<UserManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument())
        })

        it('shows "No accounts yet." when list is empty', async () => {
            // Arrange
            mockUserGetAll.mockResolvedValue([])

            // Act
            renderWithChakra(<UserManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('No accounts yet.')).toBeInTheDocument()
            )
        })
    })

    describe('register validation', () => {
        it('shows error when username is empty', async () => {
            // Act
            renderWithChakra(<UserManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Create Account' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Username is required.')).toBeInTheDocument()
            )
            expect(mockRegister).not.toHaveBeenCalled()
        })
    })

    describe('change password', () => {
        it('shows inline password input when Change Password is clicked', async () => {
            // Act
            renderWithChakra(<UserManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: /Change Password/i })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: /Change Password/i }))

            // Assert
            expect(screen.getByPlaceholderText('New password')).toBeInTheDocument()
        })

        it('shows password error when empty password is submitted', async () => {
            // Act
            renderWithChakra(<UserManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: /Change Password/i })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: /Change Password/i }))
            fireEvent.click(screen.getByRole('button', { name: /^Save$/i }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Password cannot be empty.')).toBeInTheDocument()
            )
        })

        it('calls userService.changePassword with correct args', async () => {
            // Act
            renderWithChakra(<UserManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: /Change Password/i })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: /Change Password/i }))
            fireEvent.change(screen.getByPlaceholderText('New password'), { target: { value: 'newpass123' } })
            fireEvent.click(screen.getByRole('button', { name: /^Save$/i }))

            // Assert
            await waitFor(() =>
                expect(mockChangePw).toHaveBeenCalledWith(10, 'newpass123')
            )
        })
    })

    describe('delete', () => {
        it('calls userService.delete when Delete is clicked', async () => {
            // Act
            renderWithChakra(<UserManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

            // Assert
            await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(10))
        })

        it('shows an error when delete fails', async () => {
            // Arrange
            mockDelete.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<UserManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to delete account.')).toBeInTheDocument()
            )
        })
    })
})

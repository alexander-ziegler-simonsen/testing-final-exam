// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/StaffService', () => ({
    staffService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}))

import { staffService } from '../services/StaffService'
import StaffManagement from './StaffManagement'

const mockGetAll = staffService.getAll as ReturnType<typeof vi.fn>
const mockCreate = staffService.create as ReturnType<typeof vi.fn>
const mockUpdate = staffService.update as ReturnType<typeof vi.fn>
const mockDelete = staffService.delete as ReturnType<typeof vi.fn>

const sampleStaff = [
    { id: 1, firstname: 'Jane', lastname: 'Doe', fkRoleId: 2 },
    { id: 2, firstname: 'John', lastname: 'Smith', fkRoleId: 1 },
]

describe('StaffManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetAll.mockResolvedValue(sampleStaff)
        mockCreate.mockResolvedValue(undefined)
        mockUpdate.mockResolvedValue(undefined)
        mockDelete.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<StaffManagement />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<StaffManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load staff.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders each staff member name in the table', async () => {
            // Act
            renderWithChakra(<StaffManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText(/Jane.*Doe/)).toBeInTheDocument())
            expect(screen.getByText(/John.*Smith/)).toBeInTheDocument()
        })

        it('renders the role label for each staff member', async () => {
            // Act
            renderWithChakra(<StaffManagement />)

            // Assert
            await waitFor(() => {
                const cells = document.querySelectorAll('#role-cell')
                const texts = Array.from(cells).map(c => c.textContent)
                expect(texts).toContain('Nurse')
                expect(texts).toContain('Doctor')
            })
        })

        it('shows "No staff members yet." when list is empty', async () => {
            // Arrange
            mockGetAll.mockResolvedValue([])

            // Act
            renderWithChakra(<StaffManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('No staff members yet.')).toBeInTheDocument()
            )
        })
    })

    describe('validation', () => {
        it('shows a validation error when first name is missing', async () => {
            // Act
            renderWithChakra(<StaffManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Add Staff' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Add Staff' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('First name and last name are required.')).toBeInTheDocument()
            )
            expect(mockCreate).not.toHaveBeenCalled()
        })
    })

    describe('edit', () => {
        it('switches heading to "Editing: Jane Doe" when Edit is clicked', async () => {
            // Act
            renderWithChakra(<StaffManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])

            // Assert
            expect(screen.getByText('Editing: Jane Doe')).toBeInTheDocument()
        })

        it('Cancel button restores the Add Staff Member heading', async () => {
            // Act
            renderWithChakra(<StaffManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

            // Assert
            expect(screen.getByText('Add Staff Member')).toBeInTheDocument()
        })

        it('calls staffService.update on Save Changes', async () => {
            // Act
            renderWithChakra(<StaffManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

            // Assert
            await waitFor(() =>
                expect(mockUpdate).toHaveBeenCalledWith(1, expect.objectContaining({ firstname: 'Jane' }))
            )
        })
    })

    describe('delete', () => {
        it('calls staffService.delete when Delete is clicked', async () => {
            // Act
            renderWithChakra(<StaffManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

            // Assert
            await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(1))
        })

        it('shows an error message when delete fails', async () => {
            // Arrange
            mockDelete.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<StaffManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to delete staff member.')).toBeInTheDocument()
            )
        })
    })
})

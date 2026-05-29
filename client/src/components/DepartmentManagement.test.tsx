// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/DepartmentService', () => ({
    departmentService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}))

import { departmentService } from '../services/DepartmentService'
import DepartmentManagement from './DepartmentManagement'

const mockGetAll = departmentService.getAll as ReturnType<typeof vi.fn>
const mockCreate = departmentService.create as ReturnType<typeof vi.fn>
const mockUpdate = departmentService.update as ReturnType<typeof vi.fn>
const mockDelete = departmentService.delete as ReturnType<typeof vi.fn>

const sampleDepts = [
    { id: 1, name: 'Cardiology', type: 'Medical' },
    { id: 2, name: 'Orthopedics', type: 'Surgical' },
]

describe('DepartmentManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetAll.mockResolvedValue(sampleDepts)
        mockCreate.mockResolvedValue(undefined)
        mockUpdate.mockResolvedValue(undefined)
        mockDelete.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<DepartmentManagement />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockGetAll.mockRejectedValue(new Error('Network error'))

            // Act
            renderWithChakra(<DepartmentManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load departments.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders each department name in the table', async () => {
            // Act
            renderWithChakra(<DepartmentManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('Cardiology')).toBeInTheDocument())
            expect(screen.getByText('Orthopedics')).toBeInTheDocument()
        })

        it('renders each department type in the table', async () => {
            // Act
            renderWithChakra(<DepartmentManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('Medical')).toBeInTheDocument())
            expect(screen.getByText('Surgical')).toBeInTheDocument()
        })

        it('shows "No departments yet." when the list is empty', async () => {
            // Arrange
            mockGetAll.mockResolvedValue([])

            // Act
            renderWithChakra(<DepartmentManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('No departments yet.')).toBeInTheDocument()
            )
        })

        it('shows the Add Department form heading by default', async () => {
            // Act
            renderWithChakra(<DepartmentManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('Add Department')).toBeInTheDocument())
        })
    })

    describe('create', () => {
        it('shows validation error when name is empty on submit', async () => {
            // Act
            renderWithChakra(<DepartmentManagement />)
            await waitFor(() => expect(screen.getByText('Add Department')).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Add Department' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Department name is required.')).toBeInTheDocument()
            )
            expect(mockCreate).not.toHaveBeenCalled()
        })

        it('calls departmentService.create when form is submitted with a name', async () => {
            // Arrange
            mockGetAll
                .mockResolvedValueOnce(sampleDepts)
                .mockResolvedValue([...sampleDepts, { id: 3, name: 'Neurology', type: 'Medical' }])

            // Act
            renderWithChakra(<DepartmentManagement />)
            await waitFor(() => expect(screen.getByPlaceholderText('e.g. Cardiology')).toBeInTheDocument())
            fireEvent.change(screen.getByPlaceholderText('e.g. Cardiology'), { target: { value: 'Neurology' } })
            fireEvent.click(screen.getByRole('button', { name: 'Add Department' }))

            // Assert
            await waitFor(() => expect(mockCreate).toHaveBeenCalledWith({ name: 'Neurology', type: '' }))
        })
    })

    describe('edit', () => {
        it('clicking Edit switches the form heading to "Editing: <name>"', async () => {
            // Act
            renderWithChakra(<DepartmentManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])

            // Assert
            expect(screen.getByText('Editing: Cardiology')).toBeInTheDocument()
        })

        it('clicking Cancel restores the Add Department heading', async () => {
            // Act
            renderWithChakra(<DepartmentManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

            // Assert
            expect(screen.getByText('Add Department')).toBeInTheDocument()
        })

        it('calls departmentService.update on Save Changes submit', async () => {
            // Act
            renderWithChakra(<DepartmentManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

            // Assert
            await waitFor(() =>
                expect(mockUpdate).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Cardiology' }))
            )
        })
    })

    describe('delete', () => {
        it('calls departmentService.delete and removes the row', async () => {
            // Act
            renderWithChakra(<DepartmentManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

            // Assert
            await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(1))
        })

        it('shows a delete error message when delete fails', async () => {
            // Arrange
            mockDelete.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<DepartmentManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to delete department.')).toBeInTheDocument()
            )
        })
    })
})

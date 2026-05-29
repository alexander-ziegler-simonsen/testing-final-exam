// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/TreatmentStaffService', () => ({
    treatmentStaffService: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('../services/TreatmentService', () => ({
    treatmentService: { getAll: vi.fn() },
}))
vi.mock('../services/StaffService', () => ({
    staffService: { getAll: vi.fn() },
}))

import { treatmentStaffService } from '../services/TreatmentStaffService'
import { treatmentService } from '../services/TreatmentService'
import { staffService } from '../services/StaffService'
import TreatmentStaffManagement from './TreatmentStaffManagement'

const mockTsGetAll = treatmentStaffService.getAll as ReturnType<typeof vi.fn>
const mockTsCreate = treatmentStaffService.create as ReturnType<typeof vi.fn>
const mockTsUpdate = treatmentStaffService.update as ReturnType<typeof vi.fn>
const mockTsDelete = treatmentStaffService.delete as ReturnType<typeof vi.fn>
const mockTreatGetAll = treatmentService.getAll as ReturnType<typeof vi.fn>
const mockStaffGetAll = staffService.getAll as ReturnType<typeof vi.fn>

const sampleTreatments = [{ id: 10, fkPatientId: 1, description: 'Post-op', time: '2025-01-01T08:00:00' }]
const sampleStaff = [{ id: 5, firstname: 'Alice', lastname: 'Nurse', fkRoleId: 2 }]
const sampleAssignments = [
    { id: 1, fkTreatmentId: 10, fkStaffId: 5 },
]

describe('TreatmentStaffManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockTsGetAll.mockResolvedValue(sampleAssignments)
        mockTreatGetAll.mockResolvedValue(sampleTreatments)
        mockStaffGetAll.mockResolvedValue(sampleStaff)
        mockTsCreate.mockResolvedValue(undefined)
        mockTsUpdate.mockResolvedValue(undefined)
        mockTsDelete.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockTsGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<TreatmentStaffManagement />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockTsGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<TreatmentStaffManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load treatment staff assignments.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders each assignment ID in the table', async () => {
            // Act
            renderWithChakra(<TreatmentStaffManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())
        })

        it('resolves staff name in the table', async () => {
            // Act
            renderWithChakra(<TreatmentStaffManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText(/Alice.*Nurse/)).toBeInTheDocument())
        })

        it('shows "No assignments yet." when list is empty', async () => {
            // Arrange
            mockTsGetAll.mockResolvedValue([])

            // Act
            renderWithChakra(<TreatmentStaffManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('No assignments yet.')).toBeInTheDocument()
            )
        })
    })

    describe('validation', () => {
        it('shows error when required fields are missing on submit', async () => {
            // Act
            renderWithChakra(<TreatmentStaffManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Assign' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Assign' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Both treatment and staff are required.')).toBeInTheDocument()
            )
            expect(mockTsCreate).not.toHaveBeenCalled()
        })
    })

    describe('edit', () => {
        it('switches heading to "Editing assignment #1"', async () => {
            // Act
            renderWithChakra(<TreatmentStaffManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

            // Assert
            expect(screen.getByText('Editing assignment #1')).toBeInTheDocument()
        })

        it('Cancel restores "Assign Staff to Treatment" heading', async () => {
            // Act
            renderWithChakra(<TreatmentStaffManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

            // Assert
            expect(screen.getByText('Assign Staff to Treatment')).toBeInTheDocument()
        })
    })

    describe('delete', () => {
        it('calls treatmentStaffService.delete when Remove is clicked', async () => {
            // Act
            renderWithChakra(<TreatmentStaffManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

            // Assert
            await waitFor(() => expect(mockTsDelete).toHaveBeenCalledWith(1))
        })

        it('shows an error when delete fails', async () => {
            // Arrange
            mockTsDelete.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<TreatmentStaffManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Remove' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to remove assignment.')).toBeInTheDocument()
            )
        })
    })
})

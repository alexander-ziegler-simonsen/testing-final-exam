// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/PrescriptionService', () => ({
    prescriptionService: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}))
vi.mock('../services/MedicationService', () => ({
    medicationService: { getAll: vi.fn() },
}))
vi.mock('../services/TreatmentService', () => ({
    treatmentService: { getAll: vi.fn() },
}))
vi.mock('../services/StaffService', () => ({
    staffService: { getAll: vi.fn() },
}))

import { prescriptionService } from '../services/PrescriptionService'
import { medicationService } from '../services/MedicationService'
import { treatmentService } from '../services/TreatmentService'
import { staffService } from '../services/StaffService'
import PrescriptionManagement from './PrescriptionManagement'

const mockPresGetAll = prescriptionService.getAll as ReturnType<typeof vi.fn>
const mockPresCreate = prescriptionService.create as ReturnType<typeof vi.fn>
const mockPresUpdate = prescriptionService.update as ReturnType<typeof vi.fn>
const mockPresDelete = prescriptionService.delete as ReturnType<typeof vi.fn>
const mockMedGetAll = medicationService.getAll as ReturnType<typeof vi.fn>
const mockTreatGetAll = treatmentService.getAll as ReturnType<typeof vi.fn>
const mockStaffGetAll = staffService.getAll as ReturnType<typeof vi.fn>

const sampleMeds = [{ id: 1, name: 'Aspirin', strength: '100mg' }]
const sampleTreatments = [{ id: 10, fkPatientId: 1, description: 'Follow-up', time: '2025-01-01T10:00:00' }]
const sampleStaff = [{ id: 5, firstname: 'Dr', lastname: 'House', fkRoleId: 1 }]
const samplePrescriptions = [
    { id: 100, fkMedicationId: 1, fkTreatmentId: 10, fkPrescribedByStaffId: 5, doses: 2 },
]

describe('PrescriptionManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockPresGetAll.mockResolvedValue(samplePrescriptions)
        mockMedGetAll.mockResolvedValue(sampleMeds)
        mockTreatGetAll.mockResolvedValue(sampleTreatments)
        mockStaffGetAll.mockResolvedValue(sampleStaff)
        mockPresCreate.mockResolvedValue(undefined)
        mockPresUpdate.mockResolvedValue(undefined)
        mockPresDelete.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockPresGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<PrescriptionManagement />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockPresGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<PrescriptionManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load prescriptions.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders each prescription row in the table', async () => {
            // Act
            renderWithChakra(<PrescriptionManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('100')).toBeInTheDocument())
            expect(screen.getByText('2')).toBeInTheDocument()
        })

        it('resolves medication name from medications list', async () => {
            // Act
            renderWithChakra(<PrescriptionManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument())
        })

        it('shows "No prescriptions yet." when list is empty', async () => {
            // Arrange
            mockPresGetAll.mockResolvedValue([])

            // Act
            renderWithChakra(<PrescriptionManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('No prescriptions yet.')).toBeInTheDocument()
            )
        })
    })

    describe('validation', () => {
        it('shows error when required fields are missing', async () => {
            // Act
            renderWithChakra(<PrescriptionManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Add Prescription' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Add Prescription' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('All fields are required.')).toBeInTheDocument()
            )
            expect(mockPresCreate).not.toHaveBeenCalled()
        })
    })

    describe('edit', () => {
        it('switches form heading to "Editing prescription #100" when Edit clicked', async () => {
            // Act
            renderWithChakra(<PrescriptionManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

            // Assert
            expect(screen.getByText('Editing prescription #100')).toBeInTheDocument()
        })

        it('Cancel restores Add Prescription heading', async () => {
            // Act
            renderWithChakra(<PrescriptionManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

            // Assert
            expect(screen.getByText('Add Prescription')).toBeInTheDocument()
        })
    })

    describe('delete', () => {
        it('calls prescriptionService.delete when Delete is clicked', async () => {
            // Act
            renderWithChakra(<PrescriptionManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

            // Assert
            await waitFor(() => expect(mockPresDelete).toHaveBeenCalledWith(100))
        })
    })
})

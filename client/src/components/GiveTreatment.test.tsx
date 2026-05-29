// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/TreatmentService', () => ({
    treatmentService: { create: vi.fn() },
}))
vi.mock('../services/PrescriptionService', () => ({
    prescriptionService: { create: vi.fn() },
}))
vi.mock('../services/StorageService', () => ({
    storageService: { getAll: vi.fn(), update: vi.fn() },
}))
vi.mock('../services/MedicationService', () => ({
    medicationService: { getAll: vi.fn() },
}))
vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

import { treatmentService } from '../services/TreatmentService'
import { prescriptionService } from '../services/PrescriptionService'
import { storageService } from '../services/StorageService'
import { medicationService } from '../services/MedicationService'
import { apiFetch } from '../api/client'
import GiveTreatment from './GiveTreatment'
import type { Patient } from '../entites/Patient'

const mockTreatCreate = treatmentService.create as ReturnType<typeof vi.fn>
const mockPresCreate = prescriptionService.create as ReturnType<typeof vi.fn>
const mockStorageGetAll = storageService.getAll as ReturnType<typeof vi.fn>
const mockStorageUpdate = storageService.update as ReturnType<typeof vi.fn>
const mockMedGetAll = medicationService.getAll as ReturnType<typeof vi.fn>
const mockApiFetch = apiFetch as ReturnType<typeof vi.fn>

const patients: Patient[] = [
    { id: 1, firstname: 'Alice', lastname: 'Smith', gender: 'F', cprNumber: '0101901234' },
]

const sampleMeds = [
    { id: 10, name: 'Aspirin', genericName: null, strength: '100mg', form: 'Tablet', brand: null, category: null, description: null },
]

const sampleStorages = [
    { id: 100, fkMedicationId: 10, amount: 50 },
]

function renderGiveTreatment(onSuccess?: () => void) {
    return renderWithChakra(<GiveTreatment patients={patients} onSuccess={onSuccess} />)
}

describe('GiveTreatment', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockMedGetAll.mockResolvedValue(sampleMeds)
        mockStorageGetAll.mockResolvedValue(sampleStorages)
        mockTreatCreate.mockResolvedValue(42)
        mockPresCreate.mockResolvedValue(undefined)
        mockStorageUpdate.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while medications and storages are loading', () => {
            // Arrange
            mockMedGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderGiveTreatment()

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('loaded state', () => {
        it('renders the Give Treatment heading', async () => {
            // Act
            renderGiveTreatment()

            // Assert
            await waitFor(() =>
                expect(screen.getByRole('heading', { name: /Give Treatment/i })).toBeInTheDocument()
            )
        })

        it('renders the patient dropdown with patient names', async () => {
            // Act
            renderGiveTreatment()

            // Assert
            await waitFor(() =>
                expect(screen.getByText(/Alice Smith/)).toBeInTheDocument()
            )
        })

        it('renders the medication select with available medications', async () => {
            // Act
            renderGiveTreatment()

            // Assert
            await waitFor(() =>
                expect(screen.getByText(/Aspirin.*50 in stock/)).toBeInTheDocument()
            )
        })
    })

    describe('treatment without prescription', () => {
        it('calls treatmentService.create and shows success message', async () => {
            // Act
            renderGiveTreatment()
            await waitFor(() => expect(screen.getByRole('heading', { name: /Give Treatment/i })).toBeInTheDocument())

            // Select a patient
            const patientSelect = screen.getAllByRole('combobox')[0]
            fireEvent.change(patientSelect, { target: { value: '1' } })

            fireEvent.click(screen.getByRole('button', { name: /Give Treatment/i }))

            // Assert
            await waitFor(() =>
                expect(mockTreatCreate).toHaveBeenCalledWith(
                    expect.objectContaining({ fkPatientId: 1 })
                )
            )
            await waitFor(() =>
                expect(screen.getByText('Treatment recorded successfully.')).toBeInTheDocument()
            )
        })
    })

    describe('medication approval flow', () => {
        it('shows the approval required panel when a medication is selected', async () => {
            // Act
            renderGiveTreatment()
            await waitFor(() => expect(screen.getByRole('heading', { name: /Give Treatment/i })).toBeInTheDocument())

            const medSelect = screen.getAllByRole('combobox')[1]
            fireEvent.change(medSelect, { target: { value: '10' } })

            // Assert
            await waitFor(() =>
                expect(screen.getByText(/requires a doctor to sign off/i)).toBeInTheDocument()
            )
        })

        it('"Doctor sign-off" button transitions to the signing panel', async () => {
            // Act
            renderGiveTreatment()
            await waitFor(() => expect(screen.getByRole('heading', { name: /Give Treatment/i })).toBeInTheDocument())

            const medSelect = screen.getAllByRole('combobox')[1]
            fireEvent.change(medSelect, { target: { value: '10' } })
            await waitFor(() => expect(screen.getByRole('button', { name: /Doctor sign-off/i })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: /Doctor sign-off/i }))

            // Assert
            expect(screen.getByPlaceholderText('Doctor username')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        })

        it('shows error when non-doctor credentials are used', async () => {
            // Arrange
            mockApiFetch.mockResolvedValue({ role: 'nurse', staffId: 9, firstname: 'Bob', lastname: 'Nurse' })

            // Act
            renderGiveTreatment()
            await waitFor(() => expect(screen.getByRole('heading', { name: /Give Treatment/i })).toBeInTheDocument())

            const medSelect = screen.getAllByRole('combobox')[1]
            fireEvent.change(medSelect, { target: { value: '10' } })
            await waitFor(() => expect(screen.getByRole('button', { name: /Doctor sign-off/i })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: /Doctor sign-off/i }))

            fireEvent.change(screen.getByPlaceholderText('Doctor username'), { target: { value: 'nurse1' } })
            fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } })
            fireEvent.click(screen.getByRole('button', { name: /Authenticate/i }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Only a doctor can approve medication use.')).toBeInTheDocument()
            )
        })

        it('shows approved banner after successful doctor authentication', async () => {
            // Arrange
            mockApiFetch.mockResolvedValue({ role: 'doctor', staffId: 7, firstname: 'Dr', lastname: 'House' })

            // Act
            renderGiveTreatment()
            await waitFor(() => expect(screen.getByRole('heading', { name: /Give Treatment/i })).toBeInTheDocument())

            const medSelect = screen.getAllByRole('combobox')[1]
            fireEvent.change(medSelect, { target: { value: '10' } })
            await waitFor(() => expect(screen.getByRole('button', { name: /Doctor sign-off/i })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: /Doctor sign-off/i }))

            fireEvent.change(screen.getByPlaceholderText('Doctor username'), { target: { value: 'drhouse' } })
            fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } })
            fireEvent.click(screen.getByRole('button', { name: /Authenticate/i }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText(/Approved by Dr\. Dr House/)).toBeInTheDocument()
            )
        })
    })
})

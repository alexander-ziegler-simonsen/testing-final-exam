// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/MissingStorageService', () => ({
    missingStorageService: {
        create: vi.fn(),
        getAll: vi.fn(),
    },
}))

import { missingStorageService } from '../services/MissingStorageService'
import ReportMissingForm from './ReportMissingForm'
import type { MedicationStorage } from '../entites/MedicationStorage'
import type { Medication } from '../entites/Medication'
import type { MedicationStorageMissing } from '../entites/MedicationStorageMissing'

const mockCreate = missingStorageService.create as ReturnType<typeof vi.fn>
const mockGetAll = missingStorageService.getAll as ReturnType<typeof vi.fn>

const storages: MedicationStorage[] = [
    { id: 10, fkMedicationId: 1, amount: 50 },
    { id: 11, fkMedicationId: 2, amount: 5 },
]

const medications: Medication[] = [
    { id: 1, name: 'Aspirin' },
    { id: 2, name: 'Ibuprofen' },
]

const onReported = vi.fn()

function renderForm() {
    return renderWithChakra(
        <ReportMissingForm storages={storages} medications={medications} onReported={onReported} />
    )
}

describe('ReportMissingForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockCreate.mockResolvedValue(undefined)
        mockGetAll.mockResolvedValue([
            { id: 1, fkMedicationStorageId: 10, amountMissing: 3, wentMissingAt: '2025-01-01T10:00:00' },
        ] as MedicationStorageMissing[])
    })

    it('renders the Report Missing Medicine heading', () => {
        // Act
        renderForm()

        // Assert
        expect(screen.getByRole('heading', { name: /Report Missing Medicine/i })).toBeInTheDocument()
    })

    it('renders a storage option for each storage entry', () => {
        // Act
        renderForm()

        // Assert
        expect(screen.getByText(/Aspirin.*Storage #10.*stock: 50/)).toBeInTheDocument()
        expect(screen.getByText(/Ibuprofen.*Storage #11.*stock: 5/)).toBeInTheDocument()
    })

    it('submit button is disabled when no storage is selected', () => {
        // Act
        renderForm()

        // Assert
        const btn = screen.getByRole('button', { name: /Report Missing/i })
        expect(btn).toBeDisabled()
    })

    it('shows validation error when amount is not a positive number', async () => {
        // Act
        renderForm()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '10' } })
        fireEvent.change(screen.getByPlaceholderText('e.g. 5'), { target: { value: '-1' } })
        fireEvent.click(screen.getByRole('button', { name: /Report Missing/i }))

        // Assert
        await waitFor(() =>
            expect(screen.getByText('Amount missing must be a positive number.')).toBeInTheDocument()
        )
        expect(mockCreate).not.toHaveBeenCalled()
    })

    it('calls missingStorageService.create with correct data on submit', async () => {
        // Act
        renderForm()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '10' } })
        fireEvent.change(screen.getByPlaceholderText('e.g. 5'), { target: { value: '3' } })
        fireEvent.click(screen.getByRole('button', { name: /Report Missing/i }))

        // Assert
        await waitFor(() =>
            expect(mockCreate).toHaveBeenCalledWith(
                expect.objectContaining({ fkMedicationStorageId: 10, amountMissing: 3 })
            )
        )
    })

    it('shows success message after successful submission', async () => {
        // Act
        renderForm()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '10' } })
        fireEvent.change(screen.getByPlaceholderText('e.g. 5'), { target: { value: '3' } })
        fireEvent.click(screen.getByRole('button', { name: /Report Missing/i }))

        // Assert
        await waitFor(() =>
            expect(screen.getByText('Missing medicine reported successfully.')).toBeInTheDocument()
        )
    })

    it('calls onReported callback with the latest entry', async () => {
        // Act
        renderForm()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '10' } })
        fireEvent.change(screen.getByPlaceholderText('e.g. 5'), { target: { value: '3' } })
        fireEvent.click(screen.getByRole('button', { name: /Report Missing/i }))

        // Assert
        await waitFor(() => expect(onReported).toHaveBeenCalled())
    })

    it('shows error message when create fails', async () => {
        // Arrange
        mockCreate.mockRejectedValue(new Error('fail'))

        // Act
        renderForm()
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '10' } })
        fireEvent.change(screen.getByPlaceholderText('e.g. 5'), { target: { value: '3' } })
        fireEvent.click(screen.getByRole('button', { name: /Report Missing/i }))

        // Assert
        await waitFor(() =>
            expect(screen.getByText('Failed to report missing medicine. Please try again.')).toBeInTheDocument()
        )
    })
})

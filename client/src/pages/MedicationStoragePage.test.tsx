// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/StorageService', () => ({
    storageService: { getAll: vi.fn() },
}))
vi.mock('../services/MedicationService', () => ({
    medicationService: { getAll: vi.fn() },
}))
vi.mock('../services/MissingStorageService', () => ({
    missingStorageService: { getAll: vi.fn(), create: vi.fn() },
}))

import { storageService } from '../services/StorageService'
import { medicationService } from '../services/MedicationService'
import { missingStorageService } from '../services/MissingStorageService'
import MedicationStoragePage from './MedicationStoragePage'

const mockStorageGetAll = storageService.getAll as ReturnType<typeof vi.fn>
const mockMedGetAll = medicationService.getAll as ReturnType<typeof vi.fn>
const mockMissingGetAll = missingStorageService.getAll as ReturnType<typeof vi.fn>
const mockMissingCreate = missingStorageService.create as ReturnType<typeof vi.fn>

const sampleStorages = [
    { id: 1, fkMedicationId: 10, amount: 50 },
    { id: 2, fkMedicationId: 11, amount: 5 },
]

const sampleMeds = [
    { id: 10, name: 'Aspirin', genericName: null, brand: null, category: null, form: null, strength: null, description: null },
    { id: 11, name: 'Ibuprofen', genericName: null, brand: null, category: null, form: null, strength: null, description: null },
]

const sampleMissing = [
    { id: 1, fkMedicationStorageId: 1, amountMissing: 3, wentMissingAt: '2025-01-01T10:00:00' },
]

describe('MedicationStoragePage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockStorageGetAll.mockResolvedValue(sampleStorages)
        mockMedGetAll.mockResolvedValue(sampleMeds)
        mockMissingGetAll.mockResolvedValue(sampleMissing)
        mockMissingCreate.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockStorageGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<MedicationStoragePage />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockStorageGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<MedicationStoragePage />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load medication storage data.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders the Medication Storage heading', async () => {
            // Act
            renderWithChakra(<MedicationStoragePage />)

            // Assert
            await waitFor(() =>
                expect(screen.getByRole('heading', { name: /Medication Storage/i })).toBeInTheDocument()
            )
        })

        it('renders medication names in the stock table', async () => {
            // Act
            renderWithChakra(<MedicationStoragePage />)

            // Assert
            await waitFor(() => expect(screen.getByText('Aspirin')).toBeInTheDocument())
            expect(screen.getByText('Ibuprofen')).toBeInTheDocument()
        })

        it('renders the Report Missing Medicine form', async () => {
            // Act
            renderWithChakra(<MedicationStoragePage />)

            // Assert
            await waitFor(() =>
                expect(screen.getByRole('heading', { name: /Report Missing Medicine/i })).toBeInTheDocument()
            )
        })

        it('shows the missing reports count in the toggle heading', async () => {
            // Act
            renderWithChakra(<MedicationStoragePage />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText(/Missing Reports \(1\)/)).toBeInTheDocument()
            )
        })

        it('shows missing reports table when Show is clicked', async () => {
            // Act
            renderWithChakra(<MedicationStoragePage />)
            await waitFor(() => expect(screen.getByRole('button', { name: /Show/i })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: /Show/i }))

            // Assert
            expect(screen.getByText('3')).toBeInTheDocument()
        })

        it('hides missing reports when Hide is clicked', async () => {
            // Act
            renderWithChakra(<MedicationStoragePage />)
            await waitFor(() => expect(screen.getByRole('button', { name: /Show/i })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: /Show/i }))
            fireEvent.click(screen.getByRole('button', { name: /Hide/i }))

            // Assert
            expect(screen.queryByText('Amount Missing')).not.toBeInTheDocument()
        })
    })
})

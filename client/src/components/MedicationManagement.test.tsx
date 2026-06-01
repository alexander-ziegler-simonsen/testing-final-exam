// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/MedicationService', () => ({
    medicationService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}))

import { medicationService } from '../services/MedicationService'
import MedicationManagement from './MedicationManagement'

const mockGetAll = medicationService.getAll as ReturnType<typeof vi.fn>
const mockCreate = medicationService.create as ReturnType<typeof vi.fn>
const mockUpdate = medicationService.update as ReturnType<typeof vi.fn>
const mockDelete = medicationService.delete as ReturnType<typeof vi.fn>

const sampleMeds = [
    { id: 1, name: 'Paracetamol', genericName: 'Acetaminophen', brand: 'Panodil', category: 'Analgesic', form: 'Tablet', strength: '500mg', description: '' },
    { id: 2, name: 'Ibuprofen', genericName: 'ibuprofen', brand: 'Brufen', category: 'NSAID', form: 'Capsule', strength: '200mg', description: '' },
]

describe('MedicationManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetAll.mockResolvedValue(sampleMeds)
        mockCreate.mockResolvedValue(undefined)
        mockUpdate.mockResolvedValue(undefined)
        mockDelete.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<MedicationManagement />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<MedicationManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load medications.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders each medication name in the table', async () => {
            // Act
            renderWithChakra(<MedicationManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('Paracetamol')).toBeInTheDocument())
            expect(screen.getByText('Ibuprofen')).toBeInTheDocument()
        })

        it('renders brand and category columns', async () => {
            // Act
            renderWithChakra(<MedicationManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('Panodil')).toBeInTheDocument())
            expect(screen.getByText('Analgesic')).toBeInTheDocument()
        })

        it('shows "No medications yet." when list is empty', async () => {
            // Arrange
            mockGetAll.mockResolvedValue([])

            // Act
            renderWithChakra(<MedicationManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('No medications yet.')).toBeInTheDocument()
            )
        })

        it('shows the Add Medication heading by default', async () => {
            // Act
            renderWithChakra(<MedicationManagement />)

            // Assert
            await waitFor(() => expect(document.getElementById('form-heading')).toHaveTextContent('Add Medication'))
        })
    })

    describe('validation', () => {
        it('shows validation error when name is empty on submit', async () => {
            // Act
            renderWithChakra(<MedicationManagement />)
            await waitFor(() => expect(screen.getByRole('button', { name: 'Add Medication' })).toBeInTheDocument())
            fireEvent.click(screen.getByRole('button', { name: 'Add Medication' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Medication name is required.')).toBeInTheDocument()
            )
            expect(mockCreate).not.toHaveBeenCalled()
        })
    })

    describe('edit', () => {
        it('switches form heading to "Editing: <name>" when Edit is clicked', async () => {
            // Act
            renderWithChakra(<MedicationManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])

            // Assert
            expect(screen.getByText('Editing: Paracetamol')).toBeInTheDocument()
        })

        it('Cancel button restores the Add Medication heading', async () => {
            // Act
            renderWithChakra(<MedicationManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

            // Assert
            expect(document.getElementById('form-heading')).toHaveTextContent('Add Medication')
        })

        it('calls medicationService.update on Save Changes', async () => {
            // Act
            renderWithChakra(<MedicationManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
            fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

            // Assert
            await waitFor(() =>
                expect(mockUpdate).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Paracetamol' }))
            )
        })
    })

    describe('delete', () => {
        it('calls medicationService.delete when Delete is clicked', async () => {
            // Act
            renderWithChakra(<MedicationManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

            // Assert
            await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(1))
        })

        it('shows error message when delete fails', async () => {
            // Arrange
            mockDelete.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<MedicationManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to delete medication.')).toBeInTheDocument()
            )
        })
    })
})

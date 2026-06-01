// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/ShiftService', () => ({
    shiftService: {
        getAll: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}))

import { shiftService } from '../services/ShiftService'
import ShiftManagement from './ShiftManagement'

const mockGetAll = shiftService.getAll as ReturnType<typeof vi.fn>
const mockCreate = shiftService.create as ReturnType<typeof vi.fn>
const mockUpdate = shiftService.update as ReturnType<typeof vi.fn>
const mockDelete = shiftService.delete as ReturnType<typeof vi.fn>

const sampleShifts = [
    { id: 1, startTime: '2025-06-01T08:00:00', endTime: '2025-06-01T16:00:00' },
    { id: 2, startTime: '2025-06-02T08:00:00', endTime: '2025-06-02T16:00:00' },
]

describe('ShiftManagement', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetAll.mockResolvedValue(sampleShifts)
        mockCreate.mockResolvedValue(undefined)
        mockUpdate.mockResolvedValue(undefined)
        mockDelete.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<ShiftManagement />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<ShiftManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load shifts.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders each shift ID in the table', async () => {
            // Act
            renderWithChakra(<ShiftManagement />)

            // Assert
            await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())
            expect(screen.getByText('2')).toBeInTheDocument()
        })

        it('shows "No shifts yet." when list is empty', async () => {
            // Arrange
            mockGetAll.mockResolvedValue([])

            // Act
            renderWithChakra(<ShiftManagement />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('No shifts yet.')).toBeInTheDocument()
            )
        })

        it('shows the Add Shift form heading by default', async () => {
            // Act
            renderWithChakra(<ShiftManagement />)

            // Assert
            await waitFor(() => expect(document.getElementById('form-heading')).toHaveTextContent('Add Shift'))
        })
    })

    describe('validation', () => {
        it('shows an error if end time is not after start time', async () => {
            // Act
            renderWithChakra(<ShiftManagement />)
            await waitFor(() => expect(document.getElementById('form-heading')).toHaveTextContent('Add Shift'))

            // Set start = end
            const [startInput, endInput] = screen.getAllByDisplayValue(/T/)
            fireEvent.change(startInput, { target: { value: '2025-06-01T10:00' } })
            fireEvent.change(endInput, { target: { value: '2025-06-01T10:00' } })
            fireEvent.click(screen.getByRole('button', { name: 'Add Shift' }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('End time must be after start time.')).toBeInTheDocument()
            )
            expect(mockCreate).not.toHaveBeenCalled()
        })
    })

    describe('edit', () => {
        it('switches the heading to "Editing shift #1" when Edit is clicked', async () => {
            // Act
            renderWithChakra(<ShiftManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])

            // Assert
            expect(screen.getByText('Editing shift #1')).toBeInTheDocument()
        })

        it('Cancel button restores the Add Shift heading', async () => {
            // Act
            renderWithChakra(<ShiftManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Edit' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0])
            fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

            // Assert
            expect(document.getElementById('form-heading')).toHaveTextContent('Add Shift')
        })
    })

    describe('delete', () => {
        it('calls shiftService.delete when Delete is clicked', async () => {
            // Act
            renderWithChakra(<ShiftManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

            // Assert
            await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(1))
        })

        it('shows error message when delete fails', async () => {
            // Arrange
            mockDelete.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<ShiftManagement />)
            await waitFor(() => expect(screen.getAllByRole('button', { name: 'Delete' })[0]).toBeInTheDocument())
            fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to delete shift.')).toBeInTheDocument()
            )
        })
    })
})

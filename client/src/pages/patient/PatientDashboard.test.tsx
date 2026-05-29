// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithChakra } from '../../test-utils'

vi.mock('../../services/PatientService', () => ({
    patientService: { getAll: vi.fn() },
}))

import { patientService } from '../../services/PatientService'
import PatientDashboard from './PatientDashboard'

const mockGetAll = patientService.getAll as ReturnType<typeof vi.fn>

const samplePatients = [
    { id: 1, firstname: 'Alice', lastname: 'Smith', gender: 'Female', cprNumber: '0101901234' },
    { id: 2, firstname: 'Bob', lastname: 'Jones', gender: 'Male', cprNumber: '0202901234' },
]

describe('PatientDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetAll.mockResolvedValue(samplePatients)
    })

    describe('loading state', () => {
        it('shows a spinner while patients are loading', () => {
            // Arrange
            mockGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<PatientDashboard />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<PatientDashboard />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load patients')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders the Patients heading', async () => {
            // Act
            renderWithChakra(<PatientDashboard />)

            // Assert
            await waitFor(() =>
                expect(screen.getByRole('heading', { name: /Patients/i })).toBeInTheDocument()
            )
        })

        it('renders a row for each patient plus the header row', async () => {
            // Act
            renderWithChakra(<PatientDashboard />)

            // Assert
            await waitFor(() =>
                expect(screen.getAllByRole('row')).toHaveLength(3)
            )
        })

        it('renders patient first and last names', async () => {
            // Act
            renderWithChakra(<PatientDashboard />)

            // Assert
            await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument())
            expect(screen.getByText('Smith')).toBeInTheDocument()
            expect(screen.getByText('Bob')).toBeInTheDocument()
            expect(screen.getByText('Jones')).toBeInTheDocument()
        })

        it('renders patient gender', async () => {
            // Act
            renderWithChakra(<PatientDashboard />)

            // Assert
            await waitFor(() => expect(screen.getByText('Female')).toBeInTheDocument())
            expect(screen.getByText('Male')).toBeInTheDocument()
        })

        it('renders patient CPR numbers', async () => {
            // Act
            renderWithChakra(<PatientDashboard />)

            // Assert
            await waitFor(() => expect(screen.getByText('0101901234')).toBeInTheDocument())
            expect(screen.getByText('0202901234')).toBeInTheDocument()
        })

        it('renders the table column headers', async () => {
            // Act
            renderWithChakra(<PatientDashboard />)

            // Assert
            await waitFor(() => expect(screen.getByText('First Name')).toBeInTheDocument())
            expect(screen.getByText('Last Name')).toBeInTheDocument()
            expect(screen.getByText('Gender')).toBeInTheDocument()
            expect(screen.getByText('CPR')).toBeInTheDocument()
        })
    })
})

// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders, screen, waitFor, fireEvent } from '../../test-utils'

vi.mock('../../services/PatientService', () => ({ patientService: { getAll: vi.fn() } }))
vi.mock('../../services/ShiftService',   () => ({ shiftService:   { getAll: vi.fn() } }))
vi.mock('../../services/AuthService',    () => ({ authService:    { getFullName: vi.fn() } }))
vi.mock('../../components/GiveTreatment', () => ({ default: () => <div>GiveTreatment</div> }))
vi.mock('../../components/RoomBookings',  () => ({ default: () => <div>RoomBookings</div> }))
vi.mock('../MedicationStoragePage',       () => ({ default: () => <div>MedicationStoragePage</div> }))

const mockNavigate = vi.fn()
vi.mock('react-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router')>()
    return { ...actual, useNavigate: () => mockNavigate }
})

import { patientService } from '../../services/PatientService'
import { shiftService }   from '../../services/ShiftService'
import { authService }    from '../../services/AuthService'
import NurseDashboard from './NurseDashboard'

const mockPatientGetAll = patientService.getAll as ReturnType<typeof vi.fn>
const mockShiftGetAll   = shiftService.getAll   as ReturnType<typeof vi.fn>
const mockGetFullName   = authService.getFullName as ReturnType<typeof vi.fn>

describe('NurseDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockPatientGetAll.mockReturnValue(new Promise(() => {}))
        mockShiftGetAll.mockReturnValue(new Promise(() => {}))
        mockGetFullName.mockReturnValue('Jane Nurse')
    })

    describe('heading and welcome', () => {
        it('renders the Nurse Dashboard heading', () => {
            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            expect(screen.getByRole('heading', { name: 'Nurse Dashboard' })).toBeInTheDocument()
        })

        it('shows a welcome message with the nurse name', () => {
            // Arrange
            mockGetFullName.mockReturnValue('Emma Nurse')

            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            expect(screen.getByText(/Emma Nurse/)).toBeInTheDocument()
        })
    })

    describe('tab triggers', () => {
        it('shows the Patients tab', () => {
            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: /Patients/ })).toBeInTheDocument()
        })

        it('shows the Shifts tab', () => {
            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: /Shifts/ })).toBeInTheDocument()
        })

        it('shows the Give Treatment tab', () => {
            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Give Treatment' })).toBeInTheDocument()
        })

        it('shows the Book Room tab', () => {
            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Book Room' })).toBeInTheDocument()
        })

        it('shows the Medication Storage tab', () => {
            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Medication Storage' })).toBeInTheDocument()
        })
    })

    describe('patients tab', () => {
        it('shows a spinner while patients are loading', () => {
            // Arrange - mockPatientGetAll returns a never-resolving promise from beforeEach

            // Act
            const { container } = renderWithProviders(<NurseDashboard />)

            // Assert - Chakra Spinner renders as <span class="chakra-spinner">, no ARIA role
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })

        it('shows an error message when patients fail to load', async () => {
            // Arrange
            mockPatientGetAll.mockRejectedValue(new Error('Network error'))

            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load data')).toBeInTheDocument()
            )
        })

        it('renders a row for each patient when loaded', async () => {
            // Arrange
            mockPatientGetAll.mockResolvedValue([
                { id: 1, firstname: 'Alice', lastname: 'Smith' },
                { id: 2, firstname: 'Bob',   lastname: 'Jones' },
            ])

            // Act
            renderWithProviders(<NurseDashboard />)

            // Assert
            await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument())
            expect(screen.getByText('Bob')).toBeInTheDocument()
        })

        it('navigates to the patient detail page when View is clicked', async () => {
            // Arrange
            mockPatientGetAll.mockResolvedValue([
                { id: 5, firstname: 'Carol', lastname: 'White' },
            ])
            renderWithProviders(<NurseDashboard />)
            await waitFor(() => expect(screen.getByText('Carol')).toBeInTheDocument())

            // Act
            fireEvent.click(screen.getByRole('button', { name: 'View' }))

            // Assert
            expect(mockNavigate).toHaveBeenCalledWith('/patients/5')
        })
    })

    describe('shifts tab', () => {
        it('renders a row for each shift when loaded', async () => {
            // Arrange
            mockPatientGetAll.mockResolvedValue([])
            mockShiftGetAll.mockResolvedValue([
                { id: 1, startTime: '2025-01-01T08:00:00', endTime: '2025-01-01T16:00:00' },
            ])
            renderWithProviders(<NurseDashboard />)

            // Act
            fireEvent.click(screen.getByRole('tab', { name: /Shifts/ }))

            // Assert - header row + 1 data row visible
            await waitFor(() =>
                expect(screen.getAllByRole('row').length).toBeGreaterThanOrEqual(2)
            )
        })
    })
})

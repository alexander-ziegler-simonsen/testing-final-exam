// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { renderWithProviders, screen, waitFor, fireEvent } from '../../test-utils'

vi.mock('../../services/PatientService', () => ({ patientService: { getAll: vi.fn() } }))
vi.mock('../../services/TreatmentService', () => ({ treatmentService: { getAll: vi.fn(), update: vi.fn(), delete: vi.fn() } }))
vi.mock('../../services/AuthService', () => ({ authService: { getFullName: vi.fn() } }))
vi.mock('../../components/RoomBookings', () => ({ default: () => <div>RoomBookings</div> }))
vi.mock('../MedicationStoragePage', () => ({ default: () => <div>MedicationStoragePage</div> }))

import { patientService } from '../../services/PatientService'
import { treatmentService } from '../../services/TreatmentService'
import { authService } from '../../services/AuthService'
import DoctorDashboard from './DoctorDashboard'

const mockPatientGetAll   = patientService.getAll   as ReturnType<typeof vi.fn>
const mockTreatmentGetAll = treatmentService.getAll  as ReturnType<typeof vi.fn>
const mockGetFullName     = authService.getFullName  as ReturnType<typeof vi.fn>

describe('DoctorDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockPatientGetAll.mockReturnValue(new Promise(() => {}))
        mockTreatmentGetAll.mockReturnValue(new Promise(() => {}))
        mockGetFullName.mockReturnValue('Alice Smith')
    })

    describe('heading and welcome', () => {
        it('renders the Doctor Dashboard heading', () => {
            // Act
            renderWithProviders(<DoctorDashboard />)

            // Assert
            expect(screen.getByRole('heading', { name: 'Doctor Dashboard' })).toBeInTheDocument()
        })

        it('shows a welcome message with the doctor name', () => {
            // Arrange
            mockGetFullName.mockReturnValue('Jane Doe')

            // Act
            renderWithProviders(<DoctorDashboard />)

            // Assert
            expect(screen.getByText(/Dr\. Jane Doe/)).toBeInTheDocument()
        })
    })

    describe('tab triggers', () => {
        it('shows the Patients tab', () => {
            // Act
            renderWithProviders(<DoctorDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: /Patients/ })).toBeInTheDocument()
        })

        it('shows the Treatments tab', () => {
            // Act
            renderWithProviders(<DoctorDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: /Treatments/ })).toBeInTheDocument()
        })

        it('shows the Book Room tab', () => {
            // Act
            renderWithProviders(<DoctorDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Book Room' })).toBeInTheDocument()
        })

        it('shows the Medication Storage tab', () => {
            // Act
            renderWithProviders(<DoctorDashboard />)

            // Assert
            expect(screen.getByRole('tab', { name: 'Medication Storage' })).toBeInTheDocument()
        })
    })

    describe('patients tab', () => {
        it('shows a spinner while patients are loading', () => {
            // Arrange - mockPatientGetAll already returns a never-resolving promise from beforeEach

            // Act
            const { container } = renderWithProviders(<DoctorDashboard />)

            // Assert - Chakra Spinner renders as <span class="chakra-spinner">, no ARIA role
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })

        it('shows an error message when patients fail to load', async () => {
            // Arrange
            mockPatientGetAll.mockRejectedValue(new Error('Network error'))

            // Act
            renderWithProviders(<DoctorDashboard />)

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
            renderWithProviders(<DoctorDashboard />)

            // Assert
            await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument())
            expect(screen.getByText('Bob')).toBeInTheDocument()
        })

        it('displays patient firstname, lastname, gender and CPR columns', async () => {
            // Arrange
            mockPatientGetAll.mockResolvedValue([
                { id: 3, firstname: 'Carol', lastname: 'White', gender: 'F', cprNumber: '0101901234' },
            ])

            // Act
            renderWithProviders(<DoctorDashboard />)

            // Assert
            await waitFor(() => expect(screen.getByText('Carol')).toBeInTheDocument())
            expect(screen.getByText('White')).toBeInTheDocument()
            expect(screen.getByText('F')).toBeInTheDocument()
            expect(screen.getByText('0101901234')).toBeInTheDocument()
        })
    })

    describe('treatments tab', () => {
        it('shows a spinner while treatments are loading', () => {
            // Arrange - patients resolve immediately; treatments never resolve
            mockPatientGetAll.mockResolvedValue([])
            mockTreatmentGetAll.mockReturnValue(new Promise(() => {}))

            // Act - Chakra v3 pre-renders all tab panels, so the treatments spinner is in the DOM on mount
            const { container } = renderWithProviders(<DoctorDashboard />)

            // Assert - Chakra Spinner renders as <span class="chakra-spinner">, no ARIA role
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })

        it('renders a row for each treatment when loaded', async () => {
            // Arrange
            mockPatientGetAll.mockResolvedValue([{ id: 1, firstname: 'Alice', lastname: 'Smith' }])
            mockTreatmentGetAll.mockResolvedValue([
                { id: 10, fkPatientId: 1, description: 'checkup', time: '2025-01-01T09:00:00' },
            ])
            renderWithProviders(<DoctorDashboard />)

            // Act
            fireEvent.click(screen.getByRole('tab', { name: /Treatments/ }))

            // Assert
            await waitFor(() => expect(screen.getByText('checkup')).toBeInTheDocument())
        })
    })
})

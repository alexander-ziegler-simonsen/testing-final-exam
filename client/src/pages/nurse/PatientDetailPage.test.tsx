// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { fireEvent } from '@testing-library/react'

vi.mock('../../services/PatientService',     () => ({ patientService:     { getById: vi.fn(), getAll: vi.fn() } }))
vi.mock('../../services/TreatmentService',   () => ({ treatmentService:   { getAll: vi.fn() } }))
vi.mock('../../services/RoomBookingService', () => ({ roomBookingService: { getAll: vi.fn() } }))
vi.mock('../../services/LocationService',    () => ({ locationService:    { getAll: vi.fn() } }))
vi.mock('../../services/AuthService',        () => ({
    authService: { getRole: vi.fn(), getPatientId: vi.fn() },
}))

const mockNavigate = vi.fn()
vi.mock('react-router', async (importOriginal) => {
    const actual = await importOriginal<typeof import('react-router')>()
    return { ...actual, useParams: () => ({ id: '42' }), useNavigate: () => mockNavigate }
})

import { patientService }     from '../../services/PatientService'
import { treatmentService }   from '../../services/TreatmentService'
import { roomBookingService } from '../../services/RoomBookingService'
import { locationService }    from '../../services/LocationService'
import { authService }        from '../../services/AuthService'
import PatientDetailPage from './PatientDetailPage'

const mockGetById         = patientService.getById       as ReturnType<typeof vi.fn>
const mockTreatmentGetAll = treatmentService.getAll      as ReturnType<typeof vi.fn>
const mockBookingGetAll   = roomBookingService.getAll    as ReturnType<typeof vi.fn>
const mockLocationGetAll  = locationService.getAll       as ReturnType<typeof vi.fn>
const mockGetRole         = authService.getRole          as ReturnType<typeof vi.fn>
const mockGetPatientId    = authService.getPatientId     as ReturnType<typeof vi.fn>

const samplePatient = { id: 42, firstname: 'Alice', lastname: 'Smith', gender: 'F', cprNumber: '0101901234' }

function renderPage() {
    return render(
        <ChakraProvider value={defaultSystem}>
            <MemoryRouter initialEntries={['/patients/42']}>
                <Routes>
                    <Route path="/patients/:id" element={<PatientDetailPage />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        </ChakraProvider>
    )
}

describe('PatientDetailPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetRole.mockReturnValue('nurse')
        mockGetPatientId.mockReturnValue(null)
        mockGetById.mockReturnValue(new Promise(() => {}))
        mockTreatmentGetAll.mockResolvedValue([])
        mockBookingGetAll.mockResolvedValue([])
        mockLocationGetAll.mockResolvedValue([])
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange - mockGetById returns a never-resolving promise from beforeEach

            // Act
            const { container } = renderPage()

            // Assert - Chakra Spinner renders as <span class="chakra-spinner">, no ARIA role
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockGetById.mockRejectedValue(new Error('Network error'))

            // Act
            renderPage()

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load patient details.')).toBeInTheDocument()
            )
        })
    })

    describe('patient not found', () => {
        it('shows a not-found message when the patient is null', async () => {
            // Arrange
            mockGetById.mockResolvedValue(null)

            // Act
            renderPage()

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Patient not found.')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        beforeEach(() => {
            mockGetById.mockResolvedValue(samplePatient)
        })

        it('shows the patient full name', async () => {
            // Act
            renderPage()

            // Assert
            await waitFor(() =>
                expect(screen.getByRole('heading', { name: 'Alice Smith' })).toBeInTheDocument()
            )
        })

        it('shows the patient gender', async () => {
            // Act
            renderPage()

            // Assert
            await waitFor(() => expect(screen.getByText(/Gender: F/)).toBeInTheDocument())
        })

        it('shows the patient CPR number', async () => {
            // Act
            renderPage()

            // Assert
            await waitFor(() => expect(screen.getByText(/0101901234/)).toBeInTheDocument())
        })

        it('shows "no room bookings" message when the patient has no visits', async () => {
            // Arrange
            mockBookingGetAll.mockResolvedValue([])

            // Act
            renderPage()

            // Assert
            await waitFor(() =>
                expect(screen.getByText('No room bookings recorded for this patient.')).toBeInTheDocument()
            )
        })

        it('shows a visit card for each booking', async () => {
            // Arrange
            mockBookingGetAll.mockResolvedValue([
                { id: 1, fkPatientId: 42, fkRoomId: 1, startTime: '2025-01-01T08:00:00', endTime: '2025-01-05T10:00:00' },
            ])
            mockLocationGetAll.mockResolvedValue([])

            // Act
            renderPage()

            // Assert
            await waitFor(() =>
                expect(screen.getByText(/Visits \(1\)/)).toBeInTheDocument()
            )
        })

        it('shows an "Other treatments" section for treatments not linked to a booking', async () => {
            // Arrange
            mockBookingGetAll.mockResolvedValue([])
            mockTreatmentGetAll.mockResolvedValue([
                { id: 10, fkPatientId: 42, description: 'follow-up', time: '2025-03-01T09:00:00' },
            ])

            // Act
            renderPage()

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Other treatments')).toBeInTheDocument()
            )
            expect(screen.getByText('follow-up')).toBeInTheDocument()
        })

        it('renders the Back button', async () => {
            // Act
            renderPage()

            // Assert
            await waitFor(() =>
                expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument()
            )
        })

        it('calls navigate(-1) when the Back button is clicked', async () => {
            // Arrange
            renderPage()
            await waitFor(() => expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument())

            // Act
            fireEvent.click(screen.getByRole('button', { name: /Back/ }))

            // Assert
            expect(mockNavigate).toHaveBeenCalledWith(-1)
        })
    })

    describe('patient role access control', () => {
        it('redirects to / when a patient tries to view another patient\'s page', () => {
            // Arrange
            mockGetRole.mockReturnValue('patient')
            mockGetPatientId.mockReturnValue(99)

            // Act
            renderPage()

            // Assert
            expect(screen.getByText('Home Page')).toBeInTheDocument()
            expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument()
        })
    })
})

// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/RoomBookingService', () => ({
    roomBookingService: { getAll: vi.fn(), create: vi.fn(), delete: vi.fn() },
}))
vi.mock('../services/PatientService', () => ({
    patientService: { getAll: vi.fn() },
}))
vi.mock('../services/LocationService', () => ({
    locationService: { getAll: vi.fn() },
}))

import { roomBookingService } from '../services/RoomBookingService'
import { patientService } from '../services/PatientService'
import { locationService } from '../services/LocationService'
import RoomBookings from './RoomBookings'

const mockBookingGetAll = roomBookingService.getAll as ReturnType<typeof vi.fn>
const mockBookingCreate = roomBookingService.create as ReturnType<typeof vi.fn>
const mockBookingDelete = roomBookingService.delete as ReturnType<typeof vi.fn>
const mockPatientGetAll = patientService.getAll as ReturnType<typeof vi.fn>
const mockLocationGetAll = locationService.getAll as ReturnType<typeof vi.fn>

const samplePatients = [
    { id: 1, firstname: 'Alice', lastname: 'Smith', gender: 'F', cprNumber: '0101901234' },
]

const sampleLocations = [
    {
        building: { id: 1, name: 'Main Building', address: '123 St' },
        floorsWithRooms: [
            {
                floor: { id: 1, name: 'Ground Floor', fkBuildingId: 1 },
                rooms: [{ id: 10, name: 'Room 101', fkFloorId: 1 }],
            },
        ],
    },
]

const sampleBookings = [
    { id: 1, fkPatientId: 1, fkRoomId: 10, startTime: '2025-01-01T08:00:00', endTime: '2025-01-01T10:00:00' },
]

describe('RoomBookings', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockBookingGetAll.mockResolvedValue(sampleBookings)
        mockPatientGetAll.mockResolvedValue(samplePatients)
        mockLocationGetAll.mockResolvedValue(sampleLocations)
        mockBookingCreate.mockResolvedValue(undefined)
        mockBookingDelete.mockResolvedValue(undefined)
    })

    describe('loading state', () => {
        it('shows a spinner while data is loading', () => {
            // Arrange
            mockBookingGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<RoomBookings />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('error state', () => {
        it('shows an error message when loading fails', async () => {
            // Arrange
            mockBookingGetAll.mockRejectedValue(new Error('fail'))

            // Act
            renderWithChakra(<RoomBookings />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText('Failed to load data')).toBeInTheDocument()
            )
        })
    })

    describe('loaded state', () => {
        it('renders the New Booking heading', async () => {
            // Act
            renderWithChakra(<RoomBookings />)

            // Assert
            await waitFor(() =>
                expect(screen.getByRole('heading', { name: /New Booking/i })).toBeInTheDocument()
            )
        })

        it('renders patient names in the patient dropdown', async () => {
            // Act
            renderWithChakra(<RoomBookings />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText(/Alice Smith/)).toBeInTheDocument()
            )
        })

        it('renders room options with building/floor hierarchy label', async () => {
            // Act
            renderWithChakra(<RoomBookings />)
            await waitFor(() => expect(screen.getByText(/Alice Smith/)).toBeInTheDocument())

            // Select patient first to enable room dropdown
            const patientSelect = screen.getAllByRole('combobox')[0]
            fireEvent.change(patientSelect, { target: { value: '1' } })

            // Assert
            expect(screen.getByText('Main Building — Ground Floor — Room 101')).toBeInTheDocument()
        })

        it('shows the existing bookings count', async () => {
            // Act
            renderWithChakra(<RoomBookings />)

            // Assert
            await waitFor(() =>
                expect(screen.getByText(/Existing Bookings \(1\)/)).toBeInTheDocument()
            )
        })
    })

    describe('validation', () => {
        it('shows error when end time is not after start time', async () => {
            // Act
            renderWithChakra(<RoomBookings />)
            await waitFor(() => expect(screen.getByText(/Alice Smith/)).toBeInTheDocument())

            // Select patient and room
            fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: '1' } })
            fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: '10' } })

            // Set start = end time
            const timeInputs = screen.getAllByDisplayValue(/T/)
            fireEvent.change(timeInputs[0], { target: { value: '2025-06-01T10:00' } })
            fireEvent.change(timeInputs[1], { target: { value: '2025-06-01T10:00' } })

            fireEvent.click(screen.getByRole('button', { name: /Book Room/i }))

            // Assert
            await waitFor(() =>
                expect(screen.getByText('End time must be after start time.')).toBeInTheDocument()
            )
            expect(mockBookingCreate).not.toHaveBeenCalled()
        })
    })

    describe('existing bookings table', () => {
        it('shows bookings when the Show button is clicked', async () => {
            // Act
            renderWithChakra(<RoomBookings />)
            await waitFor(() =>
                expect(screen.getByRole('button', { name: /Show/i })).toBeInTheDocument()
            )
            fireEvent.click(screen.getByRole('button', { name: /Show/i }))

            // Assert — booking id appears in the table
            expect(screen.getByText('1')).toBeInTheDocument()
        })

        it('hides bookings when the Hide button is clicked', async () => {
            // Act
            renderWithChakra(<RoomBookings />)
            await waitFor(() =>
                expect(screen.getByRole('button', { name: /Show/i })).toBeInTheDocument()
            )
            fireEvent.click(screen.getByRole('button', { name: /Show/i }))
            fireEvent.click(screen.getByRole('button', { name: /Hide/i }))

            // Assert
            expect(screen.queryByRole('table')).not.toBeInTheDocument()
        })
    })
})

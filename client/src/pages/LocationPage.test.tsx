// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/LocationService', () => ({
    locationService: {
        getAll: vi.fn(),
    },
}))

import { locationService } from '../services/LocationService'
import LocationsPage from './LocationPage'

const mockGetAll = locationService.getAll as ReturnType<typeof vi.fn>

const sampleLocations = [
    {
        building: { id: 1, name: 'Main Building', address: '123 Hospital St' },
        floorsWithRooms: [
            {
                floor: { id: 1, name: 'Ground Floor', fkBuildingId: 1 },
                rooms: [
                    { id: 10, name: 'Room 101', fkFloorId: 1 },
                    { id: 11, name: 'Room 102', fkFloorId: 1 },
                ],
            },
            {
                floor: { id: 2, name: 'First Floor', fkBuildingId: 1 },
                rooms: [
                    { id: 20, name: 'Room 201', fkFloorId: 2 },
                ],
            },
        ],
    },
    {
        building: { id: 2, name: 'East Wing', address: '456 East Ave' },
        floorsWithRooms: [],
    },
]

describe('LocationsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockGetAll.mockResolvedValue(sampleLocations)
    })

    describe('loading state', () => {
        it('shows a spinner while locations are loading', () => {
            // Arrange
            mockGetAll.mockReturnValue(new Promise(() => {}))

            // Act
            const { container } = renderWithChakra(<LocationsPage />)

            // Assert
            expect(container.querySelector('.chakra-spinner')).not.toBeNull()
        })
    })

    describe('loaded state', () => {
        it('renders the Locations heading', async () => {
            // Act
            renderWithChakra(<LocationsPage />)

            // Assert
            await waitFor(() =>
                expect(screen.getByRole('heading', { name: /Locations/i })).toBeInTheDocument()
            )
        })

        it('renders each building name', async () => {
            // Act
            renderWithChakra(<LocationsPage />)

            // Assert
            await waitFor(() => expect(screen.getByText('Main Building')).toBeInTheDocument())
            expect(screen.getByText('East Wing')).toBeInTheDocument()
        })

        it('renders building addresses', async () => {
            // Act
            renderWithChakra(<LocationsPage />)

            // Assert
            await waitFor(() => expect(screen.getByText('123 Hospital St')).toBeInTheDocument())
            expect(screen.getByText('456 East Ave')).toBeInTheDocument()
        })

        it('renders floor names', async () => {
            // Act
            renderWithChakra(<LocationsPage />)

            // Assert
            await waitFor(() => expect(screen.getByText('Ground Floor')).toBeInTheDocument())
            expect(screen.getByText('First Floor')).toBeInTheDocument()
        })

        it('renders room names under each floor', async () => {
            // Act
            renderWithChakra(<LocationsPage />)

            // Assert
            await waitFor(() => expect(screen.getByText(/Room 101/)).toBeInTheDocument())
            expect(screen.getByText(/Room 102/)).toBeInTheDocument()
            expect(screen.getByText(/Room 201/)).toBeInTheDocument()
        })
    })
})

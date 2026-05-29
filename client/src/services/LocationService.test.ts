import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { locationService } = await import('./LocationService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('locationService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /location', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await locationService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/location')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, name: 'Main Building' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await locationService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /location/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 1 })

            // Act
            await locationService.getById(1)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/location/1')
        })
    })

    describe('getAllFloors', () => {
        it('calls GET /location/floor', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await locationService.getAllFloors()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/location/floor')
        })

        it('returns the floor list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, name: 'Ground Floor', fkBuildingId: 1 }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await locationService.getAllFloors()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getFloorById', () => {
        it('calls GET /location/floor/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 2 })

            // Act
            await locationService.getFloorById(2)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/location/floor/2')
        })
    })

    describe('createFloor', () => {
        it('calls POST /location/floor', async () => {
            // Arrange
            mockFetch.mockResolvedValue(1)

            // Act
            await locationService.createFloor({ name: 'Floor 1', fkBuildingId: 10 })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/location/floor',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('injects id: 0 in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(1)

            // Act
            await locationService.createFloor({ name: 'Floor 1', fkBuildingId: 10 })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toEqual({ id: 0, name: 'Floor 1', fkBuildingId: 10 })
        })
    })

    describe('updateFloor', () => {
        it('calls PUT /location/floor/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await locationService.updateFloor(3, { id: 3, name: 'Floor 2', fkBuildingId: 10 })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/location/floor/3',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('sends the full input as the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)
            const input = { id: 3, name: 'Floor 2', fkBuildingId: 10 }

            // Act
            await locationService.updateFloor(3, input)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify(input))
        })
    })

    describe('deleteFloor', () => {
        it('calls DELETE /location/floor/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await locationService.deleteFloor(4)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/location/floor/4',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

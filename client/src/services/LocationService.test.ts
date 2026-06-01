import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { locationService } = await import('./LocationService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('locationService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('getAllFloors calls GET /location/floor', async () => {
        mockFetch.mockResolvedValue([])
        await locationService.getAllFloors()
        expect(mockFetch).toHaveBeenCalledWith('/location/floor')
    })

    it('getFloorById calls GET /location/floor/{id}', async () => {
        mockFetch.mockResolvedValue({ id: 2 })
        await locationService.getFloorById(2)
        expect(mockFetch).toHaveBeenCalledWith('/location/floor/2')
    })

    it('createFloor injects id: 0 in the body', async () => {
        // Arrange
        mockFetch.mockResolvedValue(1)

        // Act
        await locationService.createFloor({ name: 'Floor 1', fkBuildingId: 10 })

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(JSON.parse(options.body as string)).toEqual({ id: 0, name: 'Floor 1', fkBuildingId: 10 })
    })

    it('updateFloor calls PUT /location/floor/{id} with the full input as body', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)
        const input = { id: 3, name: 'Floor 2', fkBuildingId: 10 }

        // Act
        await locationService.updateFloor(3, input)

        // Assert
        const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(url).toBe('/location/floor/3')
        expect(options.body).toBe(JSON.stringify(input))
    })

    it('deleteFloor calls DELETE /location/floor/{id}', async () => {
        mockFetch.mockResolvedValue(undefined)
        await locationService.deleteFloor(4)
        expect(mockFetch).toHaveBeenCalledWith('/location/floor/4', expect.objectContaining({ method: 'DELETE' }))
    })
})

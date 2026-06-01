import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { shiftService } = await import('./ShiftService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('shiftService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('calls GET /shift with no query string by default', async () => {
        mockFetch.mockResolvedValue([])
        await shiftService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/shift')
    })

    it('appends query string when TableQuery is provided', async () => {
        mockFetch.mockResolvedValue([])
        await shiftService.getAll({ sortBy: 'startTime', sortDir: 'desc' })
        expect(mockFetch).toHaveBeenCalledWith('/shift?sortBy=startTime&sortDir=desc')
    })

    it('create injects id: 0 in the body', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)

        // Act
        await shiftService.create({ startTime: '08:00', endTime: '16:00' })

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(JSON.parse(options.body as string)).toEqual({ id: 0, startTime: '08:00', endTime: '16:00' })
    })

    it('update injects the id in the body', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)

        // Act
        await shiftService.update(4, { startTime: '09:00', endTime: '17:00' })

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(JSON.parse(options.body as string)).toEqual({ id: 4, startTime: '09:00', endTime: '17:00' })
    })
})

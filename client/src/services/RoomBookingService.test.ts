import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { roomBookingService } = await import('./RoomBookingService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

const sampleInput = { fkRoomId: 1, startTime: '2025-01-01T08:00:00', endTime: '2025-01-01T10:00:00', fkPatientId: 3 }

describe('roomBookingService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('uses /roombooking as the base URL', async () => {
        mockFetch.mockResolvedValue([])
        await roomBookingService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/roombooking')
    })

    it('create injects id: 0 in the body', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)

        // Act
        await roomBookingService.create(sampleInput)

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(JSON.parse(options.body as string)).toEqual({ id: 0, ...sampleInput })
    })

    it('update sends the full input object as the body (no id re-injection)', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)
        const input = { id: 5, ...sampleInput }

        // Act
        await roomBookingService.update(5, input)

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(options.body).toBe(JSON.stringify(input))
    })
})

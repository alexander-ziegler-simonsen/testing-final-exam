import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { roomBookingService } = await import('./RoomBookingService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

const sampleInput = { fkRoomId: 1, startTime: '2025-01-01T08:00:00', endTime: '2025-01-01T10:00:00', fkPatientId: 3 }

describe('roomBookingService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /roombooking', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await roomBookingService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/roombooking')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, ...sampleInput }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await roomBookingService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /roombooking/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 2 })

            // Act
            await roomBookingService.getById(2)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/roombooking/2')
        })
    })

    describe('create', () => {
        it('calls POST /roombooking', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await roomBookingService.create(sampleInput)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/roombooking',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('injects id: 0 in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await roomBookingService.create(sampleInput)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toEqual({ id: 0, ...sampleInput })
        })
    })

    describe('update', () => {
        it('calls PUT /roombooking/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)
            const input = { id: 5, ...sampleInput }

            // Act
            await roomBookingService.update(5, input)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/roombooking/5',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('sends the full input object as the body', async () => {
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

    describe('delete', () => {
        it('calls DELETE /roombooking/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await roomBookingService.delete(8)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/roombooking/8',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

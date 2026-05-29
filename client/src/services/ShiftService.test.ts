import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { shiftService } = await import('./ShiftService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('shiftService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /shift with no query string when called with no args', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await shiftService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/shift')
        })

        it('appends sort params when provided', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await shiftService.getAll({ sortBy: 'startTime', sortDir: 'desc' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/shift?sortBy=startTime&sortDir=desc')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, startTime: '08:00', endTime: '16:00' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await shiftService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /shift/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 2 })

            // Act
            await shiftService.getById(2)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/shift/2')
        })

        it('returns the item from apiFetch', async () => {
            // Arrange
            const shift = { id: 2, startTime: '08:00', endTime: '16:00' }
            mockFetch.mockResolvedValue(shift)

            // Act
            const result = await shiftService.getById(2)

            // Assert
            expect(result).toEqual(shift)
        })
    })

    describe('create', () => {
        it('calls POST /shift', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await shiftService.create({ startTime: '08:00', endTime: '16:00' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/shift',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('includes id: 0 in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await shiftService.create({ startTime: '08:00', endTime: '16:00' })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toEqual({ id: 0, startTime: '08:00', endTime: '16:00' })
        })
    })

    describe('update', () => {
        it('calls PUT /shift/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await shiftService.update(4, { startTime: '09:00', endTime: '17:00' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/shift/4',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('includes the id in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await shiftService.update(4, { startTime: '09:00', endTime: '17:00' })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toEqual({ id: 4, startTime: '09:00', endTime: '17:00' })
        })
    })

    describe('delete', () => {
        it('calls DELETE /shift/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await shiftService.delete(6)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/shift/6',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { storageService } = await import('./StorageService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('storageService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /storage', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await storageService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/storage')
        })

        it('returns the response from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, fkMedicationId: 10, amount: 50 }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await storageService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /storage/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 3, fkMedicationId: 10, amount: 30 })

            // Act
            await storageService.getById(3)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/storage/3')
        })
    })

    describe('update', () => {
        it('calls PUT /storage/{id} with the correct method', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await storageService.update(5, { fkMedicationId: 10, amount: 35 })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/storage/5',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('serialises the input as JSON in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)
            const input = { fkMedicationId: 10, amount: 35 }

            // Act
            await storageService.update(5, input)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify(input))
        })

        it('uses the correct id in the URL', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await storageService.update(99, { fkMedicationId: 1, amount: 0 })

            // Assert
            const [url] = mockFetch.mock.calls[0] as [string]
            expect(url).toBe('/storage/99')
        })
    })
})

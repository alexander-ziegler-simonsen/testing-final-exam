import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { missingStorageService } = await import('./MissingStorageService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('missingStorageService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /MissingStorage', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await missingStorageService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/MissingStorage')
        })

        it('returns the response from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, fkMedicationStorageId: 5, amountMissing: 3, wentMissingAt: '2025-06-01' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await missingStorageService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /MissingStorage/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 7 })

            // Act
            await missingStorageService.getById(7)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/MissingStorage/7')
        })
    })

    describe('create', () => {
        it('calls POST /MissingStorage', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)
            const input = { fkMedicationStorageId: 5, amountMissing: 8, wentMissingAt: '2025-06-01T10:00:00' }

            // Act
            await missingStorageService.create(input)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/MissingStorage',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('serialises the input as JSON in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)
            const input = { fkMedicationStorageId: 5, amountMissing: 8, wentMissingAt: '2025-06-01T10:00:00' }

            // Act
            await missingStorageService.create(input)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify(input))
        })

        it('does not include an id in the URL', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await missingStorageService.create({ fkMedicationStorageId: 1, amountMissing: 1, wentMissingAt: '' })

            // Assert
            const [url] = mockFetch.mock.calls[0] as [string]
            expect(url).toBe('/MissingStorage')
        })
    })
})

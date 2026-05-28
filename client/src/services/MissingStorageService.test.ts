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
            mockFetch.mockResolvedValue([])

            await missingStorageService.getAll()

            expect(mockFetch).toHaveBeenCalledWith('/MissingStorage')
        })

        it('returns the response from apiFetch', async () => {
            const data = [{ id: 1, fkMedicationStorageId: 5, amountMissing: 3, wentMissingAt: '2025-06-01' }]
            mockFetch.mockResolvedValue(data)

            const result = await missingStorageService.getAll()

            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /MissingStorage/{id}', async () => {
            mockFetch.mockResolvedValue({ id: 7 })

            await missingStorageService.getById(7)

            expect(mockFetch).toHaveBeenCalledWith('/MissingStorage/7')
        })
    })

    describe('create', () => {
        it('calls POST /MissingStorage', async () => {
            mockFetch.mockResolvedValue(undefined)
            const input = { fkMedicationStorageId: 5, amountMissing: 8, wentMissingAt: '2025-06-01T10:00:00' }

            await missingStorageService.create(input)

            expect(mockFetch).toHaveBeenCalledWith(
                '/MissingStorage',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('serialises the input as JSON in the body', async () => {
            mockFetch.mockResolvedValue(undefined)
            const input = { fkMedicationStorageId: 5, amountMissing: 8, wentMissingAt: '2025-06-01T10:00:00' }

            await missingStorageService.create(input)

            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify(input))
        })

        it('does not include an id in the URL', async () => {
            mockFetch.mockResolvedValue(undefined)

            await missingStorageService.create({ fkMedicationStorageId: 1, amountMissing: 1, wentMissingAt: '' })

            const [url] = mockFetch.mock.calls[0] as [string]
            expect(url).toBe('/MissingStorage')
        })
    })
})

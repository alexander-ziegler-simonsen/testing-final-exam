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
            mockFetch.mockResolvedValue([])

            await storageService.getAll()

            expect(mockFetch).toHaveBeenCalledWith('/storage')
        })

        it('returns the response from apiFetch', async () => {
            const data = [{ id: 1, fkMedicationId: 10, amount: 50 }]
            mockFetch.mockResolvedValue(data)

            const result = await storageService.getAll()

            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /storage/{id}', async () => {
            mockFetch.mockResolvedValue({ id: 3, fkMedicationId: 10, amount: 30 })

            await storageService.getById(3)

            expect(mockFetch).toHaveBeenCalledWith('/storage/3')
        })
    })

    describe('update', () => {
        it('calls PUT /storage/{id} with the correct method', async () => {
            mockFetch.mockResolvedValue(undefined)

            await storageService.update(5, { fkMedicationId: 10, amount: 35 })

            expect(mockFetch).toHaveBeenCalledWith(
                '/storage/5',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('serialises the input as JSON in the body', async () => {
            mockFetch.mockResolvedValue(undefined)
            const input = { fkMedicationId: 10, amount: 35 }

            await storageService.update(5, input)

            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify(input))
        })

        it('uses the correct id in the URL', async () => {
            mockFetch.mockResolvedValue(undefined)

            await storageService.update(99, { fkMedicationId: 1, amount: 0 })

            const [url] = mockFetch.mock.calls[0] as [string]
            expect(url).toBe('/storage/99')
        })
    })
})

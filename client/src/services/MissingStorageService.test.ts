import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { missingStorageService } = await import('./MissingStorageService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('missingStorageService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('uses /MissingStorage as the base URL', async () => {
        mockFetch.mockResolvedValue([])
        await missingStorageService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/MissingStorage')
    })

    it('create sends input directly without injecting id', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)
        const input = { fkMedicationStorageId: 5, amountMissing: 8, wentMissingAt: '2025-06-01T10:00:00' }

        // Act
        await missingStorageService.create(input)

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(options.body).toBe(JSON.stringify(input))
    })
})

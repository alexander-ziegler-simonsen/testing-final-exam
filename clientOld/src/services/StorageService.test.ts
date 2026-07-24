import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { storageService } = await import('./StorageService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('storageService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('uses /storage as the base URL', async () => {
        mockFetch.mockResolvedValue([])
        await storageService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/storage')
    })

    it('update sends input directly without injecting id in the body', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)
        const input = { fkMedicationId: 10, amount: 35 }

        // Act
        await storageService.update(5, input)

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(options.body).toBe(JSON.stringify(input))
    })
})

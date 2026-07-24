import { describe, it, expect, vi } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { medicationService } = await import('./MedicationService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('medicationService', () => {
    it('uses /medicin as the base URL', async () => {
        mockFetch.mockResolvedValue([])
        await medicationService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/medicin')
    })
})

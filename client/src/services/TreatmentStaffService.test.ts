import { describe, it, expect, vi } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { treatmentStaffService } = await import('./TreatmentStaffService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('treatmentStaffService', () => {
    it('uses /treatmentstaff as the base URL', async () => {
        mockFetch.mockResolvedValue([])
        await treatmentStaffService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/treatmentstaff')
    })
})

import { describe, it, expect, vi } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { staffService } = await import('./StaffService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('staffService', () => {
    it('uses /staff as the base URL', async () => {
        mockFetch.mockResolvedValue([])
        await staffService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/staff')
    })
})

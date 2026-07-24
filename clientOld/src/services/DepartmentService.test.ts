import { describe, it, expect, vi } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { departmentService } = await import('./DepartmentService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('departmentService', () => {
    it('uses /department as the base URL', async () => {
        mockFetch.mockResolvedValue([])
        await departmentService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/department')
    })
})

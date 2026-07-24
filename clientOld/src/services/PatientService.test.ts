import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { patientService } = await import('./PatientService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('patientService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('calls GET /patient with no query string by default', async () => {
        mockFetch.mockResolvedValue([])
        await patientService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/patient')
    })

    it('appends query string when TableQuery is provided', async () => {
        mockFetch.mockResolvedValue([])
        await patientService.getAll({ sortBy: 'name', sortDir: 'asc', filters: { name: 'Alice' } })
        expect(mockFetch).toHaveBeenCalledWith('/patient?sortBy=name&sortDir=asc&name=Alice')
    })

    it('calls GET /patient/{id}', async () => {
        mockFetch.mockResolvedValue({ id: 3 })
        await patientService.getById(3)
        expect(mockFetch).toHaveBeenCalledWith('/patient/3')
    })
})

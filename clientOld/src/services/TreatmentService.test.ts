import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { treatmentService } = await import('./TreatmentService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

const sampleInput = { fkPatientId: 1, description: 'checkup', time: '2025-01-01T09:00:00' }

describe('treatmentService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('calls GET /treatment with no query string by default', async () => {
        mockFetch.mockResolvedValue([])
        await treatmentService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/treatment')
    })

    it('appends query string when TableQuery is provided', async () => {
        mockFetch.mockResolvedValue([])
        await treatmentService.getAll({ sortBy: 'time', sortDir: 'asc', filters: { description: 'checkup' } })
        expect(mockFetch).toHaveBeenCalledWith('/treatment?sortBy=time&sortDir=asc&description=checkup')
    })

    it('create sends input directly without injecting id', async () => {
        // Arrange
        mockFetch.mockResolvedValue(1)

        // Act
        await treatmentService.create(sampleInput)

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(options.body).toBe(JSON.stringify(sampleInput))
    })

    it('create returns the new treatment id', async () => {
        // Arrange
        mockFetch.mockResolvedValue(42)

        // Act
        const result = await treatmentService.create(sampleInput)

        // Assert
        expect(result).toBe(42)
    })

    it('update injects the id in the body', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)

        // Act
        await treatmentService.update(3, sampleInput)

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(JSON.parse(options.body as string)).toEqual({ id: 3, ...sampleInput })
    })
})

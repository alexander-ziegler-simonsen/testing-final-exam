import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { prescriptionService } = await import('./PrescriptionService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

const sampleInput = { fkMedicationId: 2, fkTreatmentId: 3, fkPrescribedByStaffId: 1, doses: 2 }

describe('prescriptionService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('uses /prescription as the base URL', async () => {
        mockFetch.mockResolvedValue([])
        await prescriptionService.getAll()
        expect(mockFetch).toHaveBeenCalledWith('/prescription')
    })

    it('create sends input directly without injecting id', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)

        // Act
        await prescriptionService.create(sampleInput)

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(options.body).toBe(JSON.stringify(sampleInput))
    })

    it('update injects the id in the body', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)

        // Act
        await prescriptionService.update(5, sampleInput)

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(JSON.parse(options.body as string)).toEqual({ id: 5, ...sampleInput })
    })
})

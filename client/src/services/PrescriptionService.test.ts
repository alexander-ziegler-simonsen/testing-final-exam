import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { prescriptionService } = await import('./PrescriptionService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

const sampleInput = { fkMedicationId: 2, fkTreatmentId: 3, fkPrescribedByStaffId: 1, doses: 2 }

describe('prescriptionService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /prescription', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await prescriptionService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/prescription')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, ...sampleInput }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await prescriptionService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /prescription/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 2 })

            // Act
            await prescriptionService.getById(2)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/prescription/2')
        })
    })

    describe('create', () => {
        it('calls POST /prescription', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await prescriptionService.create(sampleInput)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/prescription',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('serialises the input directly without injecting id', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await prescriptionService.create(sampleInput)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify(sampleInput))
        })
    })

    describe('update', () => {
        it('calls PUT /prescription/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await prescriptionService.update(5, sampleInput)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/prescription/5',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('injects the id in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await prescriptionService.update(5, sampleInput)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toEqual({ id: 5, ...sampleInput })
        })
    })

    describe('delete', () => {
        it('calls DELETE /prescription/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await prescriptionService.delete(9)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/prescription/9',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

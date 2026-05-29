import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { treatmentStaffService } = await import('./TreatmentStaffService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('treatmentStaffService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /treatmentstaff', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await treatmentStaffService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/treatmentstaff')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, fkTreatmentId: 10, fkStaffId: 100 }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await treatmentStaffService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /treatmentstaff/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 3 })

            // Act
            await treatmentStaffService.getById(3)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/treatmentstaff/3')
        })
    })

    describe('create', () => {
        it('calls POST /treatmentstaff', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await treatmentStaffService.create({ fkTreatmentId: 5, fkStaffId: 50 })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/treatmentstaff',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('sends assignment data in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await treatmentStaffService.create({ fkTreatmentId: 5, fkStaffId: 50 })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toMatchObject({ fkTreatmentId: 5, fkStaffId: 50 })
        })
    })

    describe('update', () => {
        it('calls PUT /treatmentstaff/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await treatmentStaffService.update(2, { fkTreatmentId: 99, fkStaffId: 999 })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/treatmentstaff/2',
                expect.objectContaining({ method: 'PUT' })
            )
        })
    })

    describe('delete', () => {
        it('calls DELETE /treatmentstaff/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await treatmentStaffService.delete(8)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/treatmentstaff/8',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

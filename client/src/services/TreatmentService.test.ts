import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { treatmentService } = await import('./TreatmentService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

const sampleInput = { fkPatientId: 1, description: 'checkup', time: '2025-01-01T09:00:00' }

describe('treatmentService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /treatment with no query string when called with no args', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await treatmentService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/treatment')
        })

        it('appends sort params when provided', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await treatmentService.getAll({ sortBy: 'time', sortDir: 'asc' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/treatment?sortBy=time&sortDir=asc')
        })

        it('appends filter params when provided', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await treatmentService.getAll({ filters: { description: 'checkup' } })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/treatment?description=checkup')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, ...sampleInput }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await treatmentService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /treatment/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 1 })

            // Act
            await treatmentService.getById(1)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/treatment/1')
        })
    })

    describe('create', () => {
        it('calls POST /treatment', async () => {
            // Arrange
            mockFetch.mockResolvedValue(1)

            // Act
            await treatmentService.create(sampleInput)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/treatment',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('serialises the input directly without injecting id', async () => {
            // Arrange
            mockFetch.mockResolvedValue(1)

            // Act
            await treatmentService.create(sampleInput)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify(sampleInput))
        })

        it('returns the new treatment id from apiFetch', async () => {
            // Arrange
            mockFetch.mockResolvedValue(42)

            // Act
            const result = await treatmentService.create(sampleInput)

            // Assert
            expect(result).toBe(42)
        })
    })

    describe('update', () => {
        it('calls PUT /treatment/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await treatmentService.update(3, sampleInput)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/treatment/3',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('injects the id in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await treatmentService.update(3, sampleInput)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toEqual({ id: 3, ...sampleInput })
        })
    })

    describe('delete', () => {
        it('calls DELETE /treatment/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await treatmentService.delete(7)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/treatment/7',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { medicationService } = await import('./MedicationService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('medicationService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /medicin', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await medicationService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/medicin')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, name: 'Paracetamol', genericName: 'Acetaminophen' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await medicationService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /medicin/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 4 })

            // Act
            await medicationService.getById(4)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/medicin/4')
        })
    })

    describe('create', () => {
        it('calls POST /medicin', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await medicationService.create({ name: 'Ibuprofen' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/medicin',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('sends medication data in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await medicationService.create({ name: 'Ibuprofen', genericName: 'ibuprofen' })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toMatchObject({ name: 'Ibuprofen' })
        })
    })

    describe('update', () => {
        it('calls PUT /medicin/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await medicationService.update(3, { name: 'Updated' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/medicin/3',
                expect.objectContaining({ method: 'PUT' })
            )
        })
    })

    describe('delete', () => {
        it('calls DELETE /medicin/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await medicationService.delete(9)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/medicin/9',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

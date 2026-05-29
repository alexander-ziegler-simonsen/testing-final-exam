import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { createCrudService } = await import('./crudService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

interface TestEntity { id: number; name: string }
const service = createCrudService<TestEntity, { name: string }>('/test')

describe('createCrudService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /test', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await service.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/test')
        })

        it('returns the response from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, name: 'Alpha' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await service.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /test/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 5, name: 'Beta' })

            // Act
            await service.getById(5)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/test/5')
        })

        it('returns the item from apiFetch', async () => {
            // Arrange
            const item = { id: 7, name: 'Gamma' }
            mockFetch.mockResolvedValue(item)

            // Act
            const result = await service.getById(7)

            // Assert
            expect(result).toEqual(item)
        })
    })

    describe('create', () => {
        it('calls POST /test', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await service.create({ name: 'Delta' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/test',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('injects id: 0 in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await service.create({ name: 'Delta' })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toEqual({ id: 0, name: 'Delta' })
        })
    })

    describe('update', () => {
        it('calls PUT /test/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await service.update(3, { name: 'Epsilon' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/test/3',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('injects the id in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await service.update(3, { name: 'Epsilon' })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toEqual({ id: 3, name: 'Epsilon' })
        })
    })

    describe('delete', () => {
        it('calls DELETE /test/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await service.delete(8)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/test/8',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

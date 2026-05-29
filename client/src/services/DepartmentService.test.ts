import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { departmentService } = await import('./DepartmentService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('departmentService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /department', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await departmentService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/department')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, name: 'Cardiology', type: 'Medical' }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await departmentService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /department/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 2, name: 'Pediatrics' })

            // Act
            await departmentService.getById(2)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/department/2')
        })

        it('returns the item from apiFetch', async () => {
            // Arrange
            const dept = { id: 3, name: 'Orthopedics', type: 'Surgical' }
            mockFetch.mockResolvedValue(dept)

            // Act
            const result = await departmentService.getById(3)

            // Assert
            expect(result).toEqual(dept)
        })
    })

    describe('create', () => {
        it('calls POST /department', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await departmentService.create({ name: 'Neurology', type: 'Medical' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/department',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('sends the department data in the request body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await departmentService.create({ name: 'Neurology', type: 'Medical' })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toMatchObject({ name: 'Neurology', type: 'Medical' })
        })
    })

    describe('update', () => {
        it('calls PUT /department/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await departmentService.update(5, { name: 'Updated' })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/department/5',
                expect.objectContaining({ method: 'PUT' })
            )
        })
    })

    describe('delete', () => {
        it('calls DELETE /department/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await departmentService.delete(7)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/department/7',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { staffService } = await import('./StaffService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('staffService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /staff', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await staffService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/staff')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, firstname: 'Jane', lastname: 'Doe', fkRoleId: 2 }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await staffService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('getById', () => {
        it('calls GET /staff/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue({ id: 5 })

            // Act
            await staffService.getById(5)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/staff/5')
        })
    })

    describe('create', () => {
        it('calls POST /staff', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await staffService.create({ firstname: 'John', lastname: 'Smith', fkRoleId: 1 })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/staff',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('sends staff data in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await staffService.create({ firstname: 'John', lastname: 'Smith', fkRoleId: 1 })

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(JSON.parse(options.body as string)).toMatchObject({ firstname: 'John', lastname: 'Smith' })
        })
    })

    describe('update', () => {
        it('calls PUT /staff/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await staffService.update(4, { firstname: 'Updated', lastname: 'Name', fkRoleId: 2 })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/staff/4',
                expect.objectContaining({ method: 'PUT' })
            )
        })
    })

    describe('delete', () => {
        it('calls DELETE /staff/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await staffService.delete(6)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/staff/6',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

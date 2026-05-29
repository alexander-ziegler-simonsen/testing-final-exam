import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const { apiFetch } = await import('../api/client')
const { userService } = await import('./UserService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('userService', () => {
    beforeEach(() => mockFetch.mockReset())

    describe('getAll', () => {
        it('calls GET /user', async () => {
            // Arrange
            mockFetch.mockResolvedValue([])

            // Act
            await userService.getAll()

            // Assert
            expect(mockFetch).toHaveBeenCalledWith('/user')
        })

        it('returns the list from apiFetch', async () => {
            // Arrange
            const data = [{ id: 1, username: 'alice', fkStaffId: 5 }]
            mockFetch.mockResolvedValue(data)

            // Act
            const result = await userService.getAll()

            // Assert
            expect(result).toEqual(data)
        })
    })

    describe('register', () => {
        it('calls POST /user/register', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await userService.register({ username: 'bob', password: 'secret', fkStaffId: 3 })

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/user/register',
                expect.objectContaining({ method: 'POST' })
            )
        })

        it('serialises the input as JSON in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)
            const input = { username: 'bob', password: 'secret', fkStaffId: 3 }

            // Act
            await userService.register(input)

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify(input))
        })
    })

    describe('changePassword', () => {
        it('calls PUT /user/{id}/password', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await userService.changePassword(7, 'newpass')

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/user/7/password',
                expect.objectContaining({ method: 'PUT' })
            )
        })

        it('sends the new password as a JSON-serialised string in the body', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await userService.changePassword(7, 'newpass')

            // Assert
            const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
            expect(options.body).toBe(JSON.stringify('newpass'))
        })
    })

    describe('delete', () => {
        it('calls DELETE /user/{id}', async () => {
            // Arrange
            mockFetch.mockResolvedValue(undefined)

            // Act
            await userService.delete(4)

            // Assert
            expect(mockFetch).toHaveBeenCalledWith(
                '/user/4',
                expect.objectContaining({ method: 'DELETE' })
            )
        })
    })
})

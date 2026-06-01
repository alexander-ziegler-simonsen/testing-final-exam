import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../api/client', () => ({ apiFetch: vi.fn() }))

const { apiFetch } = await import('../api/client')
const { userService } = await import('./UserService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('userService', () => {
    beforeEach(() => mockFetch.mockReset())

    it('register calls POST /user/register with serialised input', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)
        const input = { username: 'bob', password: 'secret', fkStaffId: 3 }

        // Act
        await userService.register(input)

        // Assert
        const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(url).toBe('/user/register')
        expect(options.body).toBe(JSON.stringify(input))
    })

    it('changePassword calls PUT /user/{id}/password with serialised password', async () => {
        // Arrange
        mockFetch.mockResolvedValue(undefined)

        // Act
        await userService.changePassword(7, 'newpass')

        // Assert
        const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(url).toBe('/user/7/password')
        expect(options.body).toBe(JSON.stringify('newpass'))
    })

    it('delete calls DELETE /user/{id}', async () => {
        mockFetch.mockResolvedValue(undefined)
        await userService.delete(4)
        expect(mockFetch).toHaveBeenCalledWith('/user/4', expect.objectContaining({ method: 'DELETE' }))
    })
})

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

function makeLocalStorageMock() {
    let store: Record<string, string> = {}
    return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { store = {} },
    }
}

const localStorageMock = makeLocalStorageMock()
vi.stubGlobal('localStorage', localStorageMock)

function makeResponse(ok: boolean, status: number, body: string) {
    return {
        ok,
        status,
        text: async () => body,
    }
}

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)

// Import after stubs so the module picks up the mocks
const { apiFetch } = await import('./client')

describe('apiFetch', () => {
    beforeEach(() => {
        localStorageMock.clear()
        fetchMock.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    // Authorization header

    it('injects Authorization header when token is stored', async () => {
        // Arrange
        localStorageMock.setItem('token', 'my-jwt-token')
        fetchMock.mockResolvedValue(makeResponse(true, 200, '"ok"'))

        // Act
        await apiFetch('/test')

        // Assert
        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
        const headers = options.headers as Record<string, string>
        expect(headers['Authorization']).toBe('Bearer my-jwt-token')
    })

    it('omits Authorization header when no token is stored', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(true, 200, '"ok"'))

        // Act
        await apiFetch('/test')

        // Assert
        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
        const headers = options.headers as Record<string, string>
        expect(headers['Authorization']).toBeUndefined()
    })

    // Content-Type header

    it('always sends Content-Type: application/json', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(true, 200, '"ok"'))

        // Act
        await apiFetch('/test')

        // Assert
        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
        const headers = options.headers as Record<string, string>
        expect(headers['Content-Type']).toBe('application/json')
    })

    // URL construction

    it('prepends the API base URL to the endpoint', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(true, 200, '""'))

        // Act
        await apiFetch('/patients')

        // Assert
        const [url] = fetchMock.mock.calls[0] as [string]
        expect(url).toMatch(/\/api\/patients$/)
    })

    // Response parsing

    it('returns parsed JSON on a 200 response with a body', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(true, 200, JSON.stringify({ id: 42, name: 'Test' })))

        // Act
        const result = await apiFetch<{ id: number; name: string }>('/resource')

        // Assert
        expect(result).toEqual({ id: 42, name: 'Test' })
    })

    it('returns undefined for an empty 200 body', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(true, 200, ''))

        // Act
        const result = await apiFetch<void>('/resource')

        // Assert
        expect(result).toBeUndefined()
    })

    // Error handling

    it('throws an error with the HTTP status on a 400 response', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(false, 400, 'Bad Request'))

        // Act & Assert
        await expect(apiFetch('/bad')).rejects.toThrow('API error: 400')
    })

    it('throws an error with status 401 on Unauthorized', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(false, 401, 'Unauthorized'))

        // Act
        const err = await apiFetch('/protected').catch((e: Error & { status?: number }) => e)

        // Assert
        expect((err as Error & { status?: number }).status).toBe(401)
    })

    it('throws an error with status 500 on server error', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(false, 500, 'Internal Server Error'))

        // Act
        const err = await apiFetch('/broken').catch((e: Error & { status?: number }) => e)

        // Assert
        expect((err as Error & { status?: number }).status).toBe(500)
    })

    // Method forwarding

    it('forwards the method and body from options', async () => {
        // Arrange
        fetchMock.mockResolvedValue(makeResponse(true, 200, '""'))

        // Act
        await apiFetch('/resource', { method: 'POST', body: JSON.stringify({ x: 1 }) })

        // Assert
        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
        expect(options.method).toBe('POST')
        expect(options.body).toBe(JSON.stringify({ x: 1 }))
    })
})

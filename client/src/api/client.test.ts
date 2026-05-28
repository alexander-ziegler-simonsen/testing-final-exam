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
        localStorageMock.setItem('token', 'my-jwt-token')
        fetchMock.mockResolvedValue(makeResponse(true, 200, '"ok"'))

        await apiFetch('/test')

        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
        const headers = options.headers as Record<string, string>
        expect(headers['Authorization']).toBe('Bearer my-jwt-token')
    })

    it('omits Authorization header when no token is stored', async () => {
        fetchMock.mockResolvedValue(makeResponse(true, 200, '"ok"'))

        await apiFetch('/test')

        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
        const headers = options.headers as Record<string, string>
        expect(headers['Authorization']).toBeUndefined()
    })

    // Content-Type header

    it('always sends Content-Type: application/json', async () => {
        fetchMock.mockResolvedValue(makeResponse(true, 200, '"ok"'))

        await apiFetch('/test')

        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
        const headers = options.headers as Record<string, string>
        expect(headers['Content-Type']).toBe('application/json')
    })

    // URL construction

    it('prepends the API base URL to the endpoint', async () => {
        fetchMock.mockResolvedValue(makeResponse(true, 200, '""'))

        await apiFetch('/patients')

        const [url] = fetchMock.mock.calls[0] as [string]
        expect(url).toMatch(/\/api\/patients$/)
    })

    // Response parsing

    it('returns parsed JSON on a 200 response with a body', async () => {
        fetchMock.mockResolvedValue(makeResponse(true, 200, JSON.stringify({ id: 42, name: 'Test' })))

        const result = await apiFetch<{ id: number; name: string }>('/resource')

        expect(result).toEqual({ id: 42, name: 'Test' })
    })

    it('returns undefined for an empty 200 body', async () => {
        fetchMock.mockResolvedValue(makeResponse(true, 200, ''))

        const result = await apiFetch<void>('/resource')

        expect(result).toBeUndefined()
    })

    // Error handling

    it('throws an error with the HTTP status on a 400 response', async () => {
        fetchMock.mockResolvedValue(makeResponse(false, 400, 'Bad Request'))

        await expect(apiFetch('/bad')).rejects.toThrow('API error: 400')
    })

    it('throws an error with status 401 on Unauthorized', async () => {
        fetchMock.mockResolvedValue(makeResponse(false, 401, 'Unauthorized'))

        const err = await apiFetch('/protected').catch((e: Error & { status?: number }) => e)

        expect((err as Error & { status?: number }).status).toBe(401)
    })

    it('throws an error with status 500 on server error', async () => {
        fetchMock.mockResolvedValue(makeResponse(false, 500, 'Internal Server Error'))

        const err = await apiFetch('/broken').catch((e: Error & { status?: number }) => e)

        expect((err as Error & { status?: number }).status).toBe(500)
    })

    // Method forwarding

    it('forwards the method and body from options', async () => {
        fetchMock.mockResolvedValue(makeResponse(true, 200, '""'))

        await apiFetch('/resource', { method: 'POST', body: JSON.stringify({ x: 1 }) })

        const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
        expect(options.method).toBe('POST')
        expect(options.body).toBe(JSON.stringify({ x: 1 }))
    })
})

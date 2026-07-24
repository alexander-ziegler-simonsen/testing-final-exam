import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const SESSION_DURATION_MS = 6 * 60 * 60 * 1000

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

const { apiFetch } = await import('../api/client')
const { authService } = await import('./AuthService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('authService.getStaffId', () => {
    beforeEach(() => localStorageMock.clear())

    it('returns null when not set', () => {
        expect(authService.getStaffId()).toBeNull()
    })

    it('parses and returns the stored integer', () => {
        localStorageMock.setItem('staffId', '42')
        expect(authService.getStaffId()).toBe(42)
    })
})

describe('authService.getPatientId', () => {
    beforeEach(() => localStorageMock.clear())

    it('returns null when not set', () => {
        expect(authService.getPatientId()).toBeNull()
    })

    it('parses and returns the stored integer', () => {
        localStorageMock.setItem('patientId', '7')
        expect(authService.getPatientId()).toBe(7)
    })
})

describe('authService.getFullName', () => {
    beforeEach(() => localStorageMock.clear())

    it('returns empty string when nothing is stored', () => {
        expect(authService.getFullName()).toBe('')
    })

    it('returns first name only when last name is absent', () => {
        localStorageMock.setItem('firstname', 'Alice')
        expect(authService.getFullName()).toBe('Alice')
    })

    it('returns last name only when first name is absent', () => {
        localStorageMock.setItem('lastname', 'Smith')
        expect(authService.getFullName()).toBe('Smith')
    })

    it('concatenates first and last with a space', () => {
        localStorageMock.setItem('firstname', 'Alice')
        localStorageMock.setItem('lastname', 'Smith')
        expect(authService.getFullName()).toBe('Alice Smith')
    })
})

describe('authService.isLoggedIn', () => {
    beforeEach(() => localStorageMock.clear())
    afterEach(() => vi.useRealTimers())

    it('returns false when no token is stored', () => {
        expect(authService.isLoggedIn()).toBe(false)
    })

    it('returns false when token exists but loginTime is missing', () => {
        localStorageMock.setItem('token', 'abc')
        expect(authService.isLoggedIn()).toBe(false)
    })

    it('returns true for a fresh session', () => {
        localStorageMock.setItem('token', 'abc')
        localStorageMock.setItem('loginTime', String(Date.now()))
        expect(authService.isLoggedIn()).toBe(true)
    })

    it('returns false and clears storage when session has expired', () => {
        const expiredTime = Date.now() - SESSION_DURATION_MS - 1
        localStorageMock.setItem('token', 'abc')
        localStorageMock.setItem('loginTime', String(expiredTime))

        expect(authService.isLoggedIn()).toBe(false)
        expect(localStorageMock.getItem('token')).toBeNull()
    })

    it('returns true when session is exactly at the boundary (not yet expired)', () => {
        vi.useFakeTimers()
        const now = Date.now()
        vi.setSystemTime(now)
        localStorageMock.setItem('token', 'abc')
        localStorageMock.setItem('loginTime', String(now - SESSION_DURATION_MS + 1000))
        expect(authService.isLoggedIn()).toBe(true)
    })
})

describe('authService.logout', () => {
    beforeEach(() => {
        localStorageMock.clear()
        localStorageMock.setItem('token', 'tok')
        localStorageMock.setItem('role', 'nurse')
        localStorageMock.setItem('staffId', '5')
        localStorageMock.setItem('firstname', 'Alice')
        localStorageMock.setItem('lastname', 'Smith')
        localStorageMock.setItem('loginTime', String(Date.now()))
    })

    it('clears all auth keys from storage', () => {
        authService.logout()
        expect(localStorageMock.getItem('token')).toBeNull()
        expect(localStorageMock.getItem('role')).toBeNull()
        expect(localStorageMock.getItem('staffId')).toBeNull()
        expect(localStorageMock.getItem('firstname')).toBeNull()
        expect(localStorageMock.getItem('lastname')).toBeNull()
        expect(localStorageMock.getItem('loginTime')).toBeNull()
    })
})

describe('authService.login', () => {
    beforeEach(() => mockFetch.mockReset())

    it('calls POST /auth/login with the credentials', async () => {
        mockFetch.mockResolvedValue({ token: 'tok', role: 'doctor' })
        await authService.login('alice', 'secret')
        expect(mockFetch).toHaveBeenCalledWith('/auth/login', expect.objectContaining({ method: 'POST' }))
    })

    it('sends username and password as JSON body', async () => {
        mockFetch.mockResolvedValue({ token: 'tok', role: 'doctor' })
        await authService.login('alice', 'secret')
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(options.body).toBe(JSON.stringify({ username: 'alice', password: 'secret' }))
    })

    it('returns the login response from apiFetch', async () => {
        const response = { token: 'tok', role: 'doctor', staffId: 1, firstname: 'Alice', lastname: 'Smith' }
        mockFetch.mockResolvedValue(response)
        const result = await authService.login('alice', 'secret')
        expect(result).toEqual(response)
    })
})

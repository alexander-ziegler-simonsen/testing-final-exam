import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

vi.mock('../api/client', () => ({
    apiFetch: vi.fn(),
}))

const SESSION_DURATION_MS = 6 * 60 * 60 * 1000

// Minimal localStorage mock for Node environment
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

// Import after stubbing so the module picks up the mock
const { apiFetch } = await import('../api/client')
const { authService } = await import('./AuthService')

const mockFetch = apiFetch as ReturnType<typeof vi.fn>

describe('authService.getStaffId', () => {
    beforeEach(() => localStorageMock.clear())

    it('returns null when not set', () => {
        // Act
        const result = authService.getStaffId()

        // Assert
        expect(result).toBeNull()
    })

    it('parses and returns the stored integer', () => {
        // Arrange
        localStorageMock.setItem('staffId', '42')

        // Act
        const result = authService.getStaffId()

        // Assert
        expect(result).toBe(42)
    })
})

describe('authService.getPatientId', () => {
    beforeEach(() => localStorageMock.clear())

    it('returns null when not set', () => {
        // Act
        const result = authService.getPatientId()

        // Assert
        expect(result).toBeNull()
    })

    it('parses and returns the stored integer', () => {
        // Arrange
        localStorageMock.setItem('patientId', '7')

        // Act
        const result = authService.getPatientId()

        // Assert
        expect(result).toBe(7)
    })
})

describe('authService.getFullName', () => {
    beforeEach(() => localStorageMock.clear())

    it('returns empty string when nothing is stored', () => {
        // Act
        const result = authService.getFullName()

        // Assert
        expect(result).toBe('')
    })

    it('returns first name only when last name is absent', () => {
        // Arrange
        localStorageMock.setItem('firstname', 'Alice')

        // Act
        const result = authService.getFullName()

        // Assert
        expect(result).toBe('Alice')
    })

    it('returns last name only when first name is absent', () => {
        // Arrange
        localStorageMock.setItem('lastname', 'Smith')

        // Act
        const result = authService.getFullName()

        // Assert
        expect(result).toBe('Smith')
    })

    it('concatenates first and last with a space', () => {
        // Arrange
        localStorageMock.setItem('firstname', 'Alice')
        localStorageMock.setItem('lastname', 'Smith')

        // Act
        const result = authService.getFullName()

        // Assert
        expect(result).toBe('Alice Smith')
    })
})

describe('authService.isLoggedIn', () => {
    beforeEach(() => localStorageMock.clear())
    afterEach(() => vi.useRealTimers())

    it('returns false when no token is stored', () => {
        // Act
        const result = authService.isLoggedIn()

        // Assert
        expect(result).toBe(false)
    })

    it('returns false when token exists but loginTime is missing', () => {
        // Arrange
        localStorageMock.setItem('token', 'abc')

        // Act
        const result = authService.isLoggedIn()

        // Assert
        expect(result).toBe(false)
    })

    it('returns true for a fresh session', () => {
        // Arrange
        localStorageMock.setItem('token', 'abc')
        localStorageMock.setItem('loginTime', String(Date.now()))

        // Act
        const result = authService.isLoggedIn()

        // Assert
        expect(result).toBe(true)
    })

    it('returns false and clears storage when session has expired', () => {
        // Arrange
        const expiredTime = Date.now() - SESSION_DURATION_MS - 1
        localStorageMock.setItem('token', 'abc')
        localStorageMock.setItem('loginTime', String(expiredTime))

        // Act
        const result = authService.isLoggedIn()

        // Assert
        expect(result).toBe(false)
        expect(localStorageMock.getItem('token')).toBeNull()
    })

    it('returns true when session is exactly at the boundary (not yet expired)', () => {
        // Arrange
        vi.useFakeTimers()
        const now = Date.now()
        vi.setSystemTime(now)
        localStorageMock.setItem('token', 'abc')
        localStorageMock.setItem('loginTime', String(now - SESSION_DURATION_MS + 1000))

        // Act
        const result = authService.isLoggedIn()

        // Assert
        expect(result).toBe(true)
    })
})

describe('authService.getToken', () => {
    beforeEach(() => localStorageMock.clear())

    it('returns null when no token is stored', () => {
        // Act
        const result = authService.getToken()

        // Assert
        expect(result).toBeNull()
    })

    it('returns the stored token string', () => {
        // Arrange
        localStorageMock.setItem('token', 'my-jwt')

        // Act
        const result = authService.getToken()

        // Assert
        expect(result).toBe('my-jwt')
    })
})

describe('authService.getRole', () => {
    beforeEach(() => localStorageMock.clear())

    it('returns null when no role is stored', () => {
        // Act
        const result = authService.getRole()

        // Assert
        expect(result).toBeNull()
    })

    it('returns the stored role string', () => {
        // Arrange
        localStorageMock.setItem('role', 'doctor')

        // Act
        const result = authService.getRole()

        // Assert
        expect(result).toBe('doctor')
    })
})

describe('authService.getFirstname / getLastname', () => {
    beforeEach(() => localStorageMock.clear())

    it('getFirstname returns null when not set', () => {
        // Act
        const result = authService.getFirstname()

        // Assert
        expect(result).toBeNull()
    })

    it('getFirstname returns the stored value', () => {
        // Arrange
        localStorageMock.setItem('firstname', 'Alice')

        // Act
        const result = authService.getFirstname()

        // Assert
        expect(result).toBe('Alice')
    })

    it('getLastname returns null when not set', () => {
        // Act
        const result = authService.getLastname()

        // Assert
        expect(result).toBeNull()
    })

    it('getLastname returns the stored value', () => {
        // Arrange
        localStorageMock.setItem('lastname', 'Smith')

        // Act
        const result = authService.getLastname()

        // Assert
        expect(result).toBe('Smith')
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

    it('removes token from storage', () => {
        // Act
        authService.logout()

        // Assert
        expect(localStorageMock.getItem('token')).toBeNull()
    })

    it('removes role from storage', () => {
        // Act
        authService.logout()

        // Assert
        expect(localStorageMock.getItem('role')).toBeNull()
    })

    it('removes staffId from storage', () => {
        // Act
        authService.logout()

        // Assert
        expect(localStorageMock.getItem('staffId')).toBeNull()
    })

    it('removes firstname and lastname from storage', () => {
        // Act
        authService.logout()

        // Assert
        expect(localStorageMock.getItem('firstname')).toBeNull()
        expect(localStorageMock.getItem('lastname')).toBeNull()
    })

    it('removes loginTime from storage', () => {
        // Act
        authService.logout()

        // Assert
        expect(localStorageMock.getItem('loginTime')).toBeNull()
    })
})

describe('authService.login', () => {
    beforeEach(() => mockFetch.mockReset())

    it('calls POST /auth/login with the credentials', async () => {
        // Arrange
        mockFetch.mockResolvedValue({ token: 'tok', role: 'doctor' })

        // Act
        await authService.login('alice', 'secret')

        // Assert
        expect(mockFetch).toHaveBeenCalledWith(
            '/auth/login',
            expect.objectContaining({ method: 'POST' })
        )
    })

    it('sends username and password as JSON body', async () => {
        // Arrange
        mockFetch.mockResolvedValue({ token: 'tok', role: 'doctor' })

        // Act
        await authService.login('alice', 'secret')

        // Assert
        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit]
        expect(options.body).toBe(JSON.stringify({ username: 'alice', password: 'secret' }))
    })

    it('returns the login response from apiFetch', async () => {
        // Arrange
        const response = { token: 'tok', role: 'doctor', staffId: 1, firstname: 'Alice', lastname: 'Smith' }
        mockFetch.mockResolvedValue(response)

        // Act
        const result = await authService.login('alice', 'secret')

        // Assert
        expect(result).toEqual(response)
    })
})

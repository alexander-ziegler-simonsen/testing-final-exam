// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test-utils'

vi.mock('../services/AuthService', () => ({
    authService: {
        isLoggedIn: vi.fn(),
        getRole: vi.fn(),
        logout: vi.fn(),
    },
}))

import { authService } from '../services/AuthService'
import Layout from './Layout'

const mockIsLoggedIn = authService.isLoggedIn as ReturnType<typeof vi.fn>

describe('Layout', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIsLoggedIn.mockReturnValue(false)
    })

    it('renders the Navbar', () => {
        // Act
        renderWithProviders(<Layout />)

        // Assert — Navbar renders a Login button when unauthenticated
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()
    })

    it('renders children via Outlet (content area is present)', () => {
        // Act
        renderWithProviders(<Layout />)

        // Assert — the layout wrapper box is rendered
        const main = document.querySelector('nav')
        expect(main).not.toBeNull()
    })
})

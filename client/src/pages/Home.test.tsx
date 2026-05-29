// @vitest-environment happy-dom
import { vi, describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithChakra } from '../test-utils'

vi.mock('../services/MedicinePriceService', () => ({
    medicinePriceService: {
        getByName: vi.fn(),
        getByIngredient: vi.fn(),
        getDetails: vi.fn(),
    },
}))

import Home from './Home'

describe('Home', () => {
    it('renders the Welcome heading', () => {
        // Act
        renderWithChakra(<Home />)

        // Assert
        expect(
            screen.getByRole('heading', { name: /Welcome to the Hospital System/i })
        ).toBeInTheDocument()
    })

    it('renders the descriptive text about the system', () => {
        // Act
        renderWithChakra(<Home />)

        // Assert
        expect(screen.getByText(/manage hospital operations efficiently/i)).toBeInTheDocument()
    })

    it('renders the Medicine Price Search section', () => {
        // Act
        renderWithChakra(<Home />)

        // Assert
        expect(
            screen.getByRole('heading', { name: /Medicine Price Search/i })
        ).toBeInTheDocument()
    })

    it('renders the search input for medicine lookup', () => {
        // Act
        renderWithChakra(<Home />)

        // Assert
        expect(screen.getByPlaceholderText(/e.g. Ibuprofen/i)).toBeInTheDocument()
    })
})

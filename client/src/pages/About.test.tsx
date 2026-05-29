// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { screen } from '../test-utils'
import { renderWithChakra } from '../test-utils'
import About from './About'

describe('About page', () => {
    it('renders the main heading', () => {
        // Act
        renderWithChakra(<About />)

        // Assert
        expect(screen.getByText('Welcome to Fake General Hospital')).toBeInTheDocument()
    })

    it('renders the Our Mission section', () => {
        // Act
        renderWithChakra(<About />)

        // Assert
        expect(screen.getByText('Our Mission')).toBeInTheDocument()
    })

    it('renders the Departments section', () => {
        // Act
        renderWithChakra(<About />)

        // Assert
        expect(screen.getByText('Departments')).toBeInTheDocument()
    })

    it('lists the Emergency & Trauma Care department', () => {
        // Act
        renderWithChakra(<About />)

        // Assert
        expect(screen.getByText(/Emergency & Trauma Care/)).toBeInTheDocument()
    })

    it('lists the Cardiology department', () => {
        // Act
        renderWithChakra(<About />)

        // Assert
        expect(screen.getByText(/Cardiology/)).toBeInTheDocument()
    })

    it('renders the Contact section with the hospital address', () => {
        // Act
        renderWithChakra(<About />)

        // Assert
        expect(screen.getByText(/Hospitalsvej 9999/)).toBeInTheDocument()
    })

    it('renders the hospital phone number', () => {
        // Act
        renderWithChakra(<About />)

        // Assert
        expect(screen.getByText(/\+45 12 34 56 78/)).toBeInTheDocument()
    })
})

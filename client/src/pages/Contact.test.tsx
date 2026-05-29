// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { screen } from '../test-utils'
import { renderWithChakra } from '../test-utils'
import Contact from './Contact'

describe('Contact page', () => {
    it('renders the main heading', () => {
        // Act
        renderWithChakra(<Contact />)

        // Assert
        expect(screen.getByText('Contact Us')).toBeInTheDocument()
    })

    it('renders the General Inquiries section', () => {
        // Act
        renderWithChakra(<Contact />)

        // Assert
        expect(screen.getByText('General Inquiries')).toBeInTheDocument()
    })

    it('renders the Emergency section', () => {
        // Act
        renderWithChakra(<Contact />)

        // Assert
        expect(screen.getByText('Emergency')).toBeInTheDocument()
    })

    it('shows the emergency phone number', () => {
        // Act
        renderWithChakra(<Contact />)

        // Assert
        expect(screen.getByText(/\+01 12 34 56 78/)).toBeInTheDocument()
    })

    it('renders the Visit Us section with the hospital address', () => {
        // Act
        renderWithChakra(<Contact />)

        // Assert
        expect(screen.getByText('Visit Us')).toBeInTheDocument()
        expect(screen.getByText(/Hospitalsvej 9999/)).toBeInTheDocument()
    })

    it('renders the Patient Relations section', () => {
        // Act
        renderWithChakra(<Contact />)

        // Assert
        expect(screen.getByText('Patient Relations')).toBeInTheDocument()
    })

    it('shows the booking email address', () => {
        // Act
        renderWithChakra(<Contact />)

        // Assert
        expect(screen.getByText(/book@fake-not-real-hospital\.dk/)).toBeInTheDocument()
    })
})

import React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { MemoryRouter } from 'react-router'

function ChakraWrapper({ children }: { children: React.ReactNode }) {
    return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}

function AllProviders({ children }: { children: React.ReactNode }) {
    return (
        <ChakraProvider value={defaultSystem}>
            <MemoryRouter>{children}</MemoryRouter>
        </ChakraProvider>
    )
}

// Use when the component uses react-router hooks (Link, useNavigate, Navigate, Outlet)
export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
    return render(ui, { wrapper: AllProviders, ...options })
}

// Use when the component only needs Chakra UI (no router hooks/components)
export function renderWithChakra(ui: React.ReactElement, options?: RenderOptions) {
    return render(ui, { wrapper: ChakraWrapper, ...options })
}

export * from '@testing-library/react'

// Craftlane — Landing page tests
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { LandingPage } from '@/pages/LandingPage'

describe('LandingPage', () => {
  it('renders branding and primary navigation', () => {
    render(<LandingPage />)
    const links = screen.getAllByRole('link', { name: /craftlane/i })
    console.log('CRAFTLANE COUNT:', links.length)
    expect(links.length > 0).toBe(true)
    expect(screen.getAllByRole('link', { name: /find work/i })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /sign in/i })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /get started/i })).toHaveLength(1)
  })
})

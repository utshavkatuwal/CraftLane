// Craftlane — Landing page tests
import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { LandingPage } from '@/pages/LandingPage'

describe('LandingPage', () => {
  it('renders branding and primary navigation', () => {
    render(<LandingPage />)
    expect(screen.getAllByRole('link', { name: /craftlane/i }).length > 0).toBe(
      true,
    )
    expect(screen.getAllByRole('link', { name: /find work/i }).length).toBe(3)
    expect(screen.getAllByRole('link', { name: /sign in/i }).length).toBe(2)
    expect(screen.getAllByRole('link', { name: /get started/i }).length).toBe(2)
  })

  it('renders headline and value proposition', () => {
    render(<LandingPage />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/Real skills/)
    expect(heading).toHaveTextContent(/Clear agreements/)
    expect(heading).toHaveTextContent(/Better work/)
    expect(screen.getByText(/connects clients with freelancers/i)).toBeInTheDocument()
  })

  it('has working internal navigation to sign up and browse', () => {
    render(<LandingPage />)
    expect(screen.getAllByRole('link', { name: /get started/i })[0]).toHaveAttribute(
      'href',
      '/sign-up',
    )
    expect(screen.getAllByRole('button', { name: /explore work/i })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: /browse projects/i }).length).toBe(2)
  })

  it('does not render fake testimonials, statistics, or user counts', () => {
    render(<LandingPage />)
    const text = document.body.textContent || ''
    expect(text).not.toMatch(/testimonial/i)
    expect(text).not.toMatch(/\d+\s*\+\s*(freelancers|clients|projects)/i)
    expect(text).not.toMatch(/10,000|100,000|1,000,000/i)
  })

  it('renders a footer with internal links', () => {
    render(<LandingPage />)
    expect(screen.getAllByRole('link', { name: /terms of service/i }).length).toBe(1)
    expect(screen.getAllByRole('link', { name: /privacy policy/i }).length).toBe(1)
  })
})

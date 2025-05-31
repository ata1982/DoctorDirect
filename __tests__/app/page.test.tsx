import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock the components
jest.mock('@/components/Hero', () => {
  return function MockHero() {
    return <div data-testid="hero">Hero Component</div>
  }
})

jest.mock('@/components/Features', () => {
  return function MockFeatures() {
    return <div data-testid="features">Features Component</div>
  }
})

jest.mock('@/components/CTA', () => {
  return function MockCTA() {
    return <div data-testid="cta">CTA Component</div>
  }
})

describe('Home Page', () => {
  it('renders all main sections', () => {
    render(<Home />)
    
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('features')).toBeInTheDocument()
    expect(screen.getByTestId('cta')).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<Home />)
    
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })
})
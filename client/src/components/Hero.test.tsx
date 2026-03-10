import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';

describe('Hero Component', () => {
  it('renders correctly', () => {
    render(<Hero />);
    expect(screen.getByText('TROVES')).toBeInTheDocument();
    expect(screen.getByText('Coves')).toBeInTheDocument();
    expect(screen.getByText(/Handcrafted Crystal Jewelry/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Hero />);
    const heroSection = screen.getByRole('region', { name: /Welcome/i });
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveAttribute('aria-label', 'Welcome');
  });

  it('displays mystical description', () => {
    render(<Hero />);
    expect(screen.getByText(/Discover the power of transformation/)).toBeInTheDocument();
    expect(screen.getByText(/blending elegance with raw beauty/)).toBeInTheDocument();
  });

  it('renders scroll indicator', () => {
    render(<Hero />);
    expect(screen.getByText(/Scroll/i)).toBeInTheDocument();
  });

  it('renders floating crystal elements', () => {
    render(<Hero />);
    // Check if the floating elements container exists with correct class
    const floatingElements = document.querySelectorAll('.animate-float');
    expect(floatingElements.length).toBeGreaterThan(0);
  });
});

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

  it('displays hero description', () => {
    render(<Hero />);
    expect(screen.getByText(/Handcrafted Crystal Jewelry/)).toBeInTheDocument();
    expect(screen.getByText(/Made in Canada/)).toBeInTheDocument();
  });

  it('renders scroll indicator', () => {
    render(<Hero />);
    expect(screen.getByText(/Scroll/i)).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    render(<Hero />);
    const ctaButton = screen.getByRole('link', { name: /Shop the Collection/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/products');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';

describe('Hero Component', () => {
  it('renders correctly', () => {
    render(<Hero />);
    expect(screen.getByText('Troves & Coves')).toBeInTheDocument();
    expect(screen.getByText(/Authentic crystal jewelry/)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Hero />);
    const heroSection = screen.getByRole('banner');
    expect(heroSection).toHaveAttribute('aria-label', 'Hero Section');
  });

  it('contains navigation links', () => {
    render(<Hero />);
    expect(
      screen.getByRole('link', { name: /browse our crystal jewelry/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /learn more about our spiritual/i })
    ).toBeInTheDocument();
  });

  it('has proper link destinations', () => {
    render(<Hero />);
    const exploreLink = screen.getByRole('link', {
      name: /browse our crystal jewelry/i,
    });
    const storyLink = screen.getByRole('link', {
      name: /learn more about our spiritual/i,
    });

    expect(exploreLink).toHaveAttribute('href', '/products');
    expect(storyLink).toHaveAttribute('href', '/about');
  });

  it('renders floating crystal elements', () => {
    render(<Hero />);
    // Check if the floating elements container exists
    const floatingElements = document.querySelectorAll('.absolute.w-2.h-2');
    expect(floatingElements.length).toBeGreaterThan(0);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotFound } from './NotFound';

// Mock window.location
const mockLocation = { href: '' };
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('NotFound', () => {
  beforeEach(() => {
    mockLocation.href = '';
    vi.clearAllMocks();
  });

  it('should render default 404 page for unknown type', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should render product not found page', () => {
    render(<NotFound type="product" resource="Amethyst Necklace" />);

    expect(screen.getByText('Product Not Found')).toBeInTheDocument();
    expect(screen.getByText(/Amethyst Necklace/)).toBeInTheDocument();
  });

  it('should render category not found page', () => {
    render(<NotFound type="category" resource="Rings" />);

    expect(screen.getByText('Category Not Found')).toBeInTheDocument();
    expect(screen.getByText(/Rings/)).toBeInTheDocument();
  });

  it('should render API error page', () => {
    render(<NotFound type="api" />);

    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText('API Error')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong while fetching data/)).toBeInTheDocument();
  });

  it('should render crystal emoji', () => {
    render(<NotFound />);

    expect(screen.getByText('💎')).toBeInTheDocument();
  });

  it('should render go home button', () => {
    render(<NotFound />);

    const homeButton = screen.getByRole('button', { name: /go home/i });
    expect(homeButton).toBeInTheDocument();
  });

  it('should render browse products button for non-API errors', () => {
    render(<NotFound type="product" />);

    const browseButton = screen.getByRole('button', { name: /browse products/i });
    expect(browseButton).toBeInTheDocument();
  });

  it('should not render browse products button for API errors', () => {
    render(<NotFound type="api" />);

    const browseButton = screen.queryByRole('button', { name: /browse products/i });
    expect(browseButton).not.toBeInTheDocument();
  });

  it('should render helpful links section', () => {
    render(<NotFound />);

    expect(screen.getByText(/Looking for something specific\?/i)).toBeInTheDocument();
    expect(screen.getByText('All Products')).toBeInTheDocument();
    expect(screen.getByText('Necklaces')).toBeInTheDocument();
    expect(screen.getByText('Bracelets')).toBeInTheDocument();
  });

  it('should display appropriate message for page not found', () => {
    render(<NotFound type="page" />);

    expect(screen.getByText(/We couldn't find the page you're looking for/)).toBeInTheDocument();
  });

  it('should display appropriate message for product not found', () => {
    render(<NotFound type="product" resource="Crystal Ring" />);

    expect(screen.getByText(/We couldn't find the product "Crystal Ring"/)).toBeInTheDocument();
    expect(screen.getByText(/It may have been removed or the URL is incorrect/)).toBeInTheDocument();
  });

  it('should display appropriate message for category not found', () => {
    render(<NotFound type="category" resource="Earrings" />);

    expect(screen.getByText(/We couldn't find the category "Earrings"/)).toBeInTheDocument();
    expect(screen.getByText(/Try browsing our collections/)).toBeInTheDocument();
  });

  it('should display appropriate message for API error', () => {
    render(<NotFound type="api" />);

    expect(screen.getByText(/Something went wrong while fetching data/)).toBeInTheDocument();
    expect(screen.getByText(/Please try again later/)).toBeInTheDocument();
  });

  it('should have proper accessibility structure', () => {
    render(<NotFound type="product" resource="Test Product" />);

    // Check for heading hierarchy
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);

    // Check for main action button
    const mainButton = screen.getByRole('button', { name: /go home/i });
    expect(mainButton).toBeInTheDocument();
  });

  it('should render links with correct href attributes', () => {
    render(<NotFound />);

    const allProductsLink = screen.getByText('All Products').closest('a');
    expect(allProductsLink).toHaveAttribute('href', '/products');

    const necklacesLink = screen.getByText('Necklaces').closest('a');
    expect(necklacesLink).toHaveAttribute('href', '/products?category=necklaces');
  });
});

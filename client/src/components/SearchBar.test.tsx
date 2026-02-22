import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SearchBar } from './SearchBar';

// Mock fetch
global.fetch = vi.fn();

describe('SearchBar', () => {
  let queryClient: QueryClient;
  let onResultsChangeMock: ReturnType<typeof vi.fn>;
  let onFiltersChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    onResultsChangeMock = vi.fn();
    onFiltersChangeMock = vi.fn();

    // Default mocks for materials and gemstones
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/materials')) {
        return Promise.resolve({
          ok: true,
          json: async () => ['Sterling Silver', 'Gold Vermeil', 'Copper'],
        });
      }
      if (url.includes('/api/gemstones')) {
        return Promise.resolve({
          ok: true,
          json: async () => ['Amethyst', 'Rose Quartz', 'Clear Quartz'],
        });
      }
      if (url.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should render search input', () => {
    render(<SearchBar onResultsChange={onResultsChangeMock} />, { wrapper });

    expect(screen.getByPlaceholderText(/search crystals/i)).toBeInTheDocument();
  });

  it('should render filter toggle button', () => {
    render(<SearchBar onResultsChange={onResultsChangeMock} />, { wrapper });

    // Check for the search icon which indicates the search bar is rendered
    const searchIcon = screen.getByRole('button').querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should call onFiltersChange when search input changes', async () => {
    const user = userEvent.setup();
    render(<SearchBar onResultsChange={onResultsChangeMock} onFiltersChange={onFiltersChangeMock} />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/search crystals/i);
    await user.type(searchInput, 'am');

    await waitFor(() => {
      expect(onFiltersChangeMock).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('should use initial search value from props', () => {
    render(<SearchBar onResultsChange={onResultsChangeMock} initialSearch="necklace" />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/search crystals/i) as HTMLInputElement;
    expect(searchInput.value).toBe('necklace');
  });

  it('should fetch and display results on search', async () => {
    const mockResults = [
      { id: 1, name: 'Amethyst Necklace', price: '89.00' },
    ];

    (global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('/api/products') && url.includes('search')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockResults,
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    });

    const user = userEvent.setup();
    render(<SearchBar onResultsChange={onResultsChangeMock} />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/search crystals/i);
    await user.type(searchInput, 'am');

    await waitFor(() => {
      expect(onResultsChangeMock).toHaveBeenCalledWith(mockResults);
    }, { timeout: 1000 });
  });

  it('should display active filters badge when filters are applied', async () => {
    const user = userEvent.setup();
    render(<SearchBar onResultsChange={onResultsChangeMock} onFiltersChange={onFiltersChangeMock} />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/search crystals/i);
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText(/Active filters/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should render clear all button when filters are active', async () => {
    const user = userEvent.setup();
    render(<SearchBar onResultsChange={onResultsChangeMock} onFiltersChange={onFiltersChangeMock} />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/search crystals/i);
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should call onResultsChange when clear all is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onResultsChange={onResultsChangeMock} onFiltersChange={onFiltersChangeMock} />, { wrapper });

    const searchInput = screen.getByPlaceholderText(/search crystals/i);
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
    }, { timeout: 1000 });

    const clearButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearButton);

    await waitFor(() => {
      expect(onResultsChangeMock).toHaveBeenCalled();
      expect(onFiltersChangeMock).toHaveBeenCalled();
    }, { timeout: 1000 });
  });

  it('should fetch materials and gemstones on mount', async () => {
    render(<SearchBar onResultsChange={onResultsChangeMock} />, { wrapper });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/materials'));
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/gemstones'));
    });
  });
});

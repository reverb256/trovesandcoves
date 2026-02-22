import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiError, QueryError } from './ApiError';

describe('ApiError Component', () => {
  const mockRetry = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render error title and message', () => {
    render(<ApiError title="Error Title" message="Error message" />);

    expect(screen.getByText('Error Title')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    render(<ApiError title="Error" message="Message" onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ApiError title="Error" message="Message" />);

    const retryButton = screen.queryByRole('button', { name: /try again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    render(<ApiError title="Error" message="Message" onRetry={mockRetry} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should show retrying state when isRetrying is true', () => {
    render(<ApiError title="Error" message="Message" onRetry={mockRetry} isRetrying={true} />);

    expect(screen.getByText('Retrying...')).toBeInTheDocument();
  });

  it('should show try again text when not retrying', () => {
    render(<ApiError title="Error" message="Message" onRetry={mockRetry} isRetrying={false} />);

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should disable retry button when retrying', () => {
    render(<ApiError title="Error" message="Message" onRetry={mockRetry} isRetrying={true} />);

    const retryButton = screen.getByRole('button', { name: /retrying/i });
    expect(retryButton).toBeDisabled();
  });
});

describe('QueryError Component', () => {
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render error message from error object', () => {
    const error = new Error('Test error');
    render(<QueryError error={error} resetErrorBoundary={mockReset} />);

    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  it('should render default error message when error is null', () => {
    render(<QueryError error={null} resetErrorBoundary={mockReset} />);

    expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
  });

  it('should render try again button when resetErrorBoundary is provided', () => {
    const error = new Error('Test error');
    render(<QueryError error={error} resetErrorBoundary={mockReset} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('should not render try again button when resetErrorBoundary is not provided', () => {
    const error = new Error('Test error');
    render(<QueryError error={error} />);

    const retryButton = screen.queryByRole('button', { name: /try again/i });
    expect(retryButton).not.toBeInTheDocument();
  });

  it('should call resetErrorBoundary when try again button is clicked', async () => {
    const user = userEvent.setup();
    const error = new Error('Test error');
    render(<QueryError error={error} resetErrorBoundary={mockReset} />);

    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should render error title', () => {
    const error = new Error('Test error');
    render(<QueryError error={error} resetErrorBoundary={mockReset} />);

    expect(screen.getByText('Error Loading Data')).toBeInTheDocument();
  });
});

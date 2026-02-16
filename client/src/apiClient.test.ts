import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch } from './apiClient';

// Mock fetch globally
global.fetch = vi.fn();

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a successful API call', async () => {
    const mockResponse = { success: true, data: 'test' };
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiFetch('/api/test');
    expect(result).toEqual(mockResponse);
  });

  it('should retry on failure', async () => {
    const mockResponse = { success: true, data: 'test' };
    
    // First call fails, second succeeds
    (global.fetch as any)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

    const result = await apiFetch('/api/test');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should throw error after all retries fail', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    await expect(apiFetch('/api/test')).rejects.toThrow('Network error');
  });
});

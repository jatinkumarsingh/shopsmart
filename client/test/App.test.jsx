import { render, screen } from '@testing-library/react';
import App from '../src/App';
import { describe, it, expect, vi } from 'vitest';

describe('App', () => {
  it('renders ShopSmart title', () => {
    // Mock fetch
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: 'ok', message: 'Test Msg', timestamp: 'now' }),
        })
      )
    );

    render(<App />);
    const elements = screen.getAllByText(/ShopSmart/i);
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toBeInTheDocument();
  });
});

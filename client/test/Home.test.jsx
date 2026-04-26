import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../src/pages/Home';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchApi } from '../src/utils/api';
import { useCart } from '../src/context/CartContext';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../src/utils/api', () => ({
  fetchApi: vi.fn(),
}));

vi.mock('../src/context/CartContext', () => ({
  useCart: vi.fn(),
}));

const mockProducts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  description: `Description ${i + 1}`,
  price: 100 + i,
  imageUrl: 'https://via.placeholder.com/150',
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCart.mockReturnValue({ addToCart: vi.fn() });
  });

  it('renders only 3 products initially and shows "View More" button', async () => {
    fetchApi.mockResolvedValue(mockProducts);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Should load 3 products initially
    await waitFor(() => {
      const productCards = screen.getAllByRole('heading', { level: 3 });
      expect(productCards).toHaveLength(3);
    });

    const viewMoreButton = screen.getByText(/View More/i);
    expect(viewMoreButton).toBeInTheDocument();
  });

  it('renders all products when "View More" is clicked', async () => {
    fetchApi.mockResolvedValue(mockProducts);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3));

    const viewMoreButton = screen.getByText(/View More/i);
    fireEvent.click(viewMoreButton);

    const productCards = screen.getAllByRole('heading', { level: 3 });
    expect(productCards).toHaveLength(10);
    expect(screen.queryByText(/View More/i)).not.toBeInTheDocument();
  });

  it('does not show "View More" if there are 3 or fewer products', async () => {
    fetchApi.mockResolvedValue(mockProducts.slice(0, 3));

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      const productCards = screen.getAllByRole('heading', { level: 3 });
      expect(productCards).toHaveLength(3);
    });

    expect(screen.queryByText(/View More/i)).not.toBeInTheDocument();
  });
});

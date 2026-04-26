import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkout from '../src/pages/Checkout';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContextModule from '../src/context/AuthContext';
import * as CartContextModule from '../src/context/CartContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Checkout Component', () => {
  const mockCartItems = [
    { id: 1, name: 'Product 1', price: 100, quantity: 2, imageUrl: 'p1.jpg' },
    { id: 2, name: 'Product 2', price: 200, quantity: 1, imageUrl: 'p2.jpg' },
  ];

  const mockUpdateQuantity = vi.fn();
  const mockRemoveFromCart = vi.fn();
  const mockGetCartTotal = vi.fn(() => 400);

  const mockAuthContext = {
    user: { name: 'Test User', email: 'test@example.com' },
    logout: vi.fn(),
    loading: false,
  };

  const mockCartContext = {
    cartItems: mockCartItems,
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    getCartTotal: mockGetCartTotal,
    clearCart: vi.fn(),
    getItemCount: vi.fn(() => 3),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue(mockAuthContext);
    vi.spyOn(CartContextModule, 'useCart').mockReturnValue(mockCartContext);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  const renderCheckout = () => {
    return render(
      <BrowserRouter>
        <Checkout />
      </BrowserRouter>
    );
  };

  it('renders the address form initially if no address is saved', () => {
    renderCheckout();
    expect(screen.getByText(/Shipping Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Street Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Save Address/i)).toBeInTheDocument();
  });

  it('validates address fields before saving', () => {
    renderCheckout();
    const saveButton = screen.getByText(/Save Address/i);
    fireEvent.click(saveButton);
    expect(screen.getByPlaceholderText(/Street Address/i)).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalled();
  });

  it('saves address and shows formatted details', () => {
    renderCheckout();

    fireEvent.change(screen.getByPlaceholderText(/Street Address/i), {
      target: { value: 'Main St' },
    });
    fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'San Jose' } });
    fireEvent.change(screen.getByPlaceholderText(/State\/Province/i), { target: { value: 'CA' } });
    fireEvent.change(screen.getByPlaceholderText(/Zip Code/i), { target: { value: '95112' } });

    fireEvent.click(screen.getByText(/Save Address/i));

    expect(screen.queryByPlaceholderText(/Street Address/i)).toBeNull();
    expect(screen.getByText(/SHIP TO/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Main St/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Edit Address/i)).toBeInTheDocument();
  });

  it('allows editing the address after saving', () => {
    renderCheckout();

    fireEvent.change(screen.getByPlaceholderText(/Street Address/i), {
      target: { value: 'Main St' },
    });
    fireEvent.change(screen.getByPlaceholderText(/City/i), { target: { value: 'San Jose' } });
    fireEvent.change(screen.getByPlaceholderText(/State\/Province/i), { target: { value: 'CA' } });
    fireEvent.change(screen.getByPlaceholderText(/Zip Code/i), { target: { value: '95112' } });
    fireEvent.click(screen.getByText(/Save Address/i));

    fireEvent.click(screen.getByText(/Edit Address/i));
    expect(screen.getByPlaceholderText(/Street Address/i)).toBeInTheDocument();
  });

  it('calls updateQuantity when quantity buttons are clicked', () => {
    renderCheckout();

    // Find buttons by their SVG icons (lucide-plus, lucide-minus)
    const plusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-plus'));
    fireEvent.click(plusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1);

    const minusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-minus'));
    fireEvent.click(minusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, -1);
  });

  it('calls removeFromCart when trash icon is clicked', () => {
    renderCheckout();

    // Find buttons by their SVG icons (lucide-trash-2)
    const removeButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-trash-2'));

    if (removeButtons.length > 0) {
      fireEvent.click(removeButtons[0]);
      expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
    } else {
      throw new Error('No remove buttons found');
    }
  });
});

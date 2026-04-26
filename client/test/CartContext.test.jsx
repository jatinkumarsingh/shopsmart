import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../src/context/CartContext';
import { AuthContext } from '../src/context/AuthContext';
import { NotificationContext } from '../src/context/NotificationContext';

// Simplified wrapper that provides required contexts for testing
const AllTheProviders = ({ children, authValue, notificationValue }) => (
  <NotificationContext.Provider value={notificationValue}>
    <AuthContext.Provider value={authValue}>
      <CartProvider>{children}</CartProvider>
    </AuthContext.Provider>
  </NotificationContext.Provider>
);

describe('CartContext', () => {
  const mockShowNotification = vi.fn();
  const mockNotificationValue = { showNotification: mockShowNotification };
  const mockAuthUser = { id: 1, name: 'Test User' };
  const mockAuthValue = { user: mockAuthUser };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Default mock implementation for localStorage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      clear: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should initialize with empty cart if localStorage is empty', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <AllTheProviders authValue={mockAuthValue} notificationValue={mockNotificationValue}>
          {children}
        </AllTheProviders>
      ),
    });
    expect(result.current.cartItems).toEqual([]);
  });

  it('should NOT add item to cart if user is not authenticated', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <AllTheProviders authValue={{ user: null }} notificationValue={mockNotificationValue}>
          {children}
        </AllTheProviders>
      ),
    });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(mockShowNotification).toHaveBeenCalledWith(
      expect.stringContaining('sign in'),
      'warning'
    );
  });

  it('should add item to cart if user is authenticated', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <AllTheProviders authValue={mockAuthValue} notificationValue={mockNotificationValue}>
          {children}
        </AllTheProviders>
      ),
    });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0]).toMatchObject({ ...product, quantity: 1 });
    expect(mockShowNotification).toHaveBeenCalledWith(
      expect.stringContaining('added to cart'),
      'success'
    );
  });

  it('should increment quantity if item already in cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <AllTheProviders authValue={mockAuthValue} notificationValue={mockNotificationValue}>
          {children}
        </AllTheProviders>
      ),
    });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(2);
  });

  it('should update quantity correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <AllTheProviders authValue={mockAuthValue} notificationValue={mockNotificationValue}>
          {children}
        </AllTheProviders>
      ),
    });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
    });

    act(() => {
      result.current.updateQuantity(1, 4);
    });
    expect(result.current.cartItems[0].quantity).toBe(5);

    act(() => {
      result.current.updateQuantity(1, -10);
    });
    expect(result.current.cartItems[0].quantity).toBe(1);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <AllTheProviders authValue={mockAuthValue} notificationValue={mockNotificationValue}>
          {children}
        </AllTheProviders>
      ),
    });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
    });
    expect(result.current.cartItems).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(1);
    });
    expect(result.current.cartItems).toHaveLength(0);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <AllTheProviders authValue={mockAuthValue} notificationValue={mockNotificationValue}>
          {children}
        </AllTheProviders>
      ),
    });

    act(() => {
      result.current.addToCart({ id: 1, price: 100, name: 'P1' });
      result.current.addToCart({ id: 2, price: 200, name: 'P2' });
      result.current.updateQuantity(1, 1);
    });

    expect(result.current.getCartTotal()).toBe(400);
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: ({ children }) => (
        <AllTheProviders authValue={mockAuthValue} notificationValue={mockNotificationValue}>
          {children}
        </AllTheProviders>
      ),
    });
    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      expect.stringContaining('Test Product')
    );
  });
});

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// More robust localStorage mock to avoid environment crashes
const store = {};

const mockLocalStorage = {
  getItem: vi.fn((key) => store[key] || null),
  setItem: vi.fn((key, value) => {
    store[key] = value.toString();
  }),
  removeItem: vi.fn((key) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    Object.keys(store).forEach((key) => delete store[key]);
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

// Mock matchMedia for components that use responsive hooks
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Clear localStorage before each test to ensure isolation
beforeEach(() => {
  localStorage.clear();
});

import '@testing-library/jest-dom';
import { vi } from 'vitest';

class ResizeObserverStub {
  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub);

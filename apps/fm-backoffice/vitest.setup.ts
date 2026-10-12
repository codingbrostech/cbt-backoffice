import '@testing-library/jest-dom';
import { vi } from 'vitest';

import { initI18n } from '#/i18n/config';

class ResizeObserverStub {
  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverStub);
initI18n();

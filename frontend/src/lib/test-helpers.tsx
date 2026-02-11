/**
 * Test Utilities
 *
 * Shared testing utilities and custom render functions.
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { ToastProvider } from '@/context/ToastContext';

/**
 * TestProviders wrapper component
 *
 * Wraps children with all required providers for testing.
 */
function TestProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}

/**
 * renderWithProviders
 *
 * Custom render function that wraps UI with all required providers.
 *
 * @param ui - The React element to render
 * @param options - Optional render options (wrapper is managed internally)
 * @returns Render result with queries and utilities
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestProviders, ...options });
}

// Re-export all React Testing Library utilities
export * from '@testing-library/react';

// Export userEvent for realistic user interaction simulation
export { default as userEvent } from '@testing-library/user-event';

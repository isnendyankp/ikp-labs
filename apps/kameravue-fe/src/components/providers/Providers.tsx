"use client";

/**
 * Providers Component
 *
 * Client-side wrapper for all app context providers.
 * This component is used in the root layout to provide global state.
 */

import { ToastProvider } from "@/context/ToastContext";
import { ToastContainer } from "@/components/ui/ToastContainer";

/**
 * Providers Props
 */
interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers Component
 *
 * Wraps the application with all necessary context providers.
 * Currently includes:
 * - ToastProvider: Global toast notification state
 * - ToastContainer: Displays active toast notifications
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}

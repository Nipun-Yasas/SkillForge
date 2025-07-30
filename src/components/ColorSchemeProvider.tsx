"use client";

import { useEffect } from 'react';

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure color scheme is properly set on client
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (!html.getAttribute('data-toolpad-color-scheme')) {
        html.setAttribute('data-toolpad-color-scheme', 'light');
      }
    }
  }, []);

  return <>{children}</>;
}

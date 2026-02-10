'use client';

import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import PrivyProvider from './PrivyProvider';

export default function ClientBoundary({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </PrivyProvider>
  );
}

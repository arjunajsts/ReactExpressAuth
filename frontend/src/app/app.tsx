import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Notifications } from '@/components/ui/notifications';
import { globalQueryClient } from '@/lib/react-query';
import { Router } from './router';


const RootErrorFallback = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center bg-red-50 text-red-900">
    <h1 className="text-xl font-bold">A critical system exception occurred.</h1>
    <button className="mt-4 rounded bg-red-600 px-4 py-2 text-white" onClick={() => window.location.reload()}>
      Reload Application
    </button>
  </div>
);

export const App = () => (
  <React.Suspense fallback={<div className="p-8">Loading Framework Context...</div>}>
    <ErrorBoundary FallbackComponent={RootErrorFallback}>
      <QueryClientProvider client={globalQueryClient}>
        <Notifications />
        <Router />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.Suspense>
);
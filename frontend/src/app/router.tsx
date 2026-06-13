import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppRoot, AppRootErrorBoundary } from '@/app/layout';
import { ProtectedRoute } from '@/components/protected';
import { GlobalSpinnerFallback } from '@/app/provider';
// Import your global fallback component


export const appRouterInstance = createBrowserRouter([
  {
    path: '/auth/register',
    HydrateFallback: GlobalSpinnerFallback, // Uses your Tailwind Spinner
    lazy: async () => {
      const { RegisterRoute } = await import('@/app/auth/register/page');
      return { Component: RegisterRoute };
    },
  },
  {
    path: "/auth/verify/email/:code",
    HydrateFallback: GlobalSpinnerFallback,
    lazy: async () => {
      const { VerifyEmailRoute } = await import("@/app/auth/verify-email/page");
      return { Component: VerifyEmailRoute };
    }
  },
  {
    path: '/auth/login',
    HydrateFallback: GlobalSpinnerFallback,
    lazy: async () => {
      const { LoginRoute } = await import('@/app/auth/login/page');
      return { Component: LoginRoute };
    },
  },
  {
    path: '/auth/password/forgot',
    HydrateFallback: GlobalSpinnerFallback,
    lazy: async () => {
      const { PasswordForgot } = await import('@/app/auth/password-forgot/page');
      return { Component: PasswordForgot };
    },
  },
  {
    path: '/auth/password/reset',
    HydrateFallback: GlobalSpinnerFallback,
    lazy: async () => {
      const { PasswordResetRoute } = await import('@/app/auth/password-reset/page');
      return { Component: PasswordResetRoute };
    },
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppRoot />
      </ProtectedRoute>
    ),
    ErrorBoundary: AppRootErrorBoundary,
    HydrateFallback: GlobalSpinnerFallback,
    children: [
      {
        path: 'dashboard',
        lazy: async () => {
          const { DashboardRoute } = await import('@/app/dashboard/page');
          return { Component: DashboardRoute };
        },
        ErrorBoundary: AppRootErrorBoundary,
      },
      {
        path: 'settings',
        lazy: async () => {
          const { SettingsRoute } = await import('@/app/settings/page');
          return { Component: SettingsRoute };
        },
        ErrorBoundary: AppRootErrorBoundary,
      },
    ],
  },
  {
    path: '*',
    HydrateFallback: GlobalSpinnerFallback,
    lazy: async () => {
      const { NotFoundRoute } = await import('@/components/not-found/not-found');
      return { Component: NotFoundRoute };
    },
    ErrorBoundary: AppRootErrorBoundary,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={appRouterInstance} />;
};

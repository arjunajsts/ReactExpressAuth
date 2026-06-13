import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AppRoot, AppRootErrorBoundary } from '@/app/layout';
import { ProtectedRoute } from '@/components/protected';
import { Spinner } from '@/components/spinner';

// Import your global fallback component
export const Fallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <Spinner size="xl" />
  </div>
);

export const appRouterInstance = createBrowserRouter([
  {
    path: '/auth/register',
    HydrateFallback: Fallback, // Uses your Tailwind Spinner
    lazy: async () => {
      const { RegisterRoute } = await import('@/app/auth/register/page');
      return { Component: RegisterRoute };
    },
  },
  {
    path: "/auth/verify/email/:code",
    HydrateFallback: Fallback,
    lazy: async () => {
      const { VerifyEmailRoute } = await import("@/app/auth/verify-email/page");
      return { Component: VerifyEmailRoute };
    }
  },
  {
    path: '/auth/login',
    HydrateFallback: Fallback,
    lazy: async () => {
      const { LoginRoute } = await import('@/app/auth/login/page');
      return { Component: LoginRoute };
    },
  },
  {
    path: '/auth/password/forgot',
    HydrateFallback: Fallback,
    lazy: async () => {
      const { PasswordForgot } = await import('@/app/auth/password-forgot/page');
      return { Component: PasswordForgot };
    },
  },
  {
    path: '/auth/password/reset',
    HydrateFallback: Fallback,
    lazy: async () => {
      const { PasswordResetRoute } = await import('@/app/auth/password-reset/page');
      return { Component: PasswordResetRoute };
    },
  },
  {
    path: '/',
    Component: ProtectedLayout,
    ErrorBoundary: AppRootErrorBoundary,
    HydrateFallback: Fallback,
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
    HydrateFallback: Fallback,
    lazy: async () => {
      const { NotFoundRoute } = await import('@/components/not-found/not-found');
      return { Component: NotFoundRoute };
    },
    ErrorBoundary: AppRootErrorBoundary,
  },
]);


function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <AppRoot />
    </ProtectedRoute>
  );
}

export const AppRouter = () => {
  return <RouterProvider router={appRouterInstance} />;
};

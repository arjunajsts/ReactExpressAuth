import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/useAuth';
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { Layout } from './layout';

export const Fallback = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
    <Spinner size="xl" />
  </div>
);

export function AppRootErrorBoundary() {
  return (
    <div className="p-4 text-red-500">
      <h2>Something went wrong loading this route layout.</h2>
    </div>
  );
}

// Wrapper layout to isolate React Router contexts cleanly
function ProtectedLayoutWrapper() {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) return <Fallback />;
  if (!user) return <Navigate to={`/auth/login?redirectTo=${encodeURIComponent(location.pathname)}`} replace />;

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <main className="flex-1">
        <Layout >
          <Outlet />
        </Layout>
      </main>
    </div>
  );
}

export const appRouterInstance = createBrowserRouter([
  // Public Auth Routes
  {
    path: '/auth/register',
    HydrateFallback: Fallback,
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

  // Protected Routes Shell
  {
    path: '/',
    element: <ProtectedLayoutWrapper />,
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

  // Fallback 404
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

export const Router = () => {
  return <RouterProvider router={appRouterInstance} />;
};

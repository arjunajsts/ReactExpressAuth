import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppRoot, AppRootErrorBoundary } from '@/app/layout';
import { ProtectedRoute } from '@/components/protected';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CreateAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    {
      path: '/auth/register',
      lazy: async () => {
        const { RegisterRoute } = await import('@/app/auth/register/page');
        return { Component: RegisterRoute };
      },
    },
    {
    path:"auth/verify/email/:code",
    lazy:async ()=> {
      const {VerifyEmailRoute} = await import("@/app/auth/verify-email/page")
      return { Component: VerifyEmailRoute}
    }
    },
    {
      path: '/auth/login',
      lazy: async () => {
        const { LoginRoute } = await import('@/app/auth/login/page');
        return { Component: LoginRoute };
      },
    },
    {
      path: '/auth/password/forgot',
      lazy: async () => {
        const {  PasswordForgot } = await import('@/app/auth/password-forgot/page');
        return { Component: PasswordForgot };
      },
    },
    {
      path: '/auth/password/reset',
      lazy: async () => {
        const {  PasswordResetRoute } = await import('@/app/auth/password-reset/page');
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
      children: [
        // {
        //   path: 'users',
        //   lazy: async () => {
        //     const { UsersRoute, usersLoader } = await import(
        //       './routes/app/users'
        //     );
        //     return {
        //       Component: UsersRoute,
        //       loader: usersLoader(queryClient),
        //     };
        //   },
        //   ErrorBoundary: AppRootErrorBoundary,
        // },
        {
          path: 'dashboard',
          lazy: async () => {
            const { DashboardRoute } = await import('@/app/dashboard/page');
            return {
              Component: DashboardRoute,
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
        {
          path: 'settings',
          lazy: async () => {
            const { SettingsRoute } = await import('@/app/settings/page');
            return {
              Component: SettingsRoute,
            };
          },
          ErrorBoundary: AppRootErrorBoundary,
        },
      ],
    },
    {
      path: '*',
      lazy: async () => {
        const { NotFoundRoute } = await import('@/components/not-found/not-found');
        return {
          Component: NotFoundRoute,
        };
      },
      ErrorBoundary: AppRootErrorBoundary,
    },
  ]);

export const AppRouter = () => {
  const queryClient = useQueryClient();
  const router = useMemo(() => CreateAppRouter(queryClient), [queryClient]);
  return <RouterProvider router={router} />;
};

import { UseMutationOptions, DefaultOptions } from '@tanstack/react-query';

// Define a generic type that extracts the return type of a promise-based function
export type ApiFnReturnType<FnType extends (...args: unknown[]) => Promise<unknown>> =
  Awaited<ReturnType<FnType>>;

// Default configuration for React Query
export const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60, // 1 minute
  },
};

// QueryConfig type that omits specific properties from the return type of a function
export type QueryConfig<T extends (...args: unknown[]) => Promise<unknown>> = Omit<
  Awaited<ReturnType<T>>, // Use Awaited to get the actual return type
  'queryKey' | 'queryFn' // Omit the properties you don't want
>;

// MutationConfig type for mutation options
export type MutationConfig<
  MutationFnType extends (...args: unknown[]) => Promise<unknown>,
> = UseMutationOptions<
  ApiFnReturnType<MutationFnType>, // Get the resolved return type of the mutation function
  Error, // Type of the error returned if the mutation fails
  Parameters<MutationFnType>[0] // Type of the first parameter of the mutation function
>;

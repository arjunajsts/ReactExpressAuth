let navigate: (path: string, options?: { state?: Record<string, unknown> }) => void = () => {};

export const setNavigate = (
  fn: (path: string, options?: { state?: Record<string, unknown> }) => void
): void => {
  navigate = fn;
};

export { navigate };
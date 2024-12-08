import { Outlet } from 'react-router-dom';
import {Header} from '@/components/ui/layout/header'
export const AppRoot = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export const AppRootErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

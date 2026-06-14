import { Header } from '@/components/ui/layout/header';
import React from 'react';

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      {/* Global Sidebar/Navbar can sit here */}
      <main>
        <Header />
        {children}
      </main>
    </div>
  );
}

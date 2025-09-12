'use client';

import { AuthProvider } from '@/lib/context/auth-context';
import { PlayerProvider } from '@/lib/context/player-context';
import { usePathname } from 'next/navigation';
import AppShell from '@/components/layout/app-shell';
import { ReactNode } from 'react';

function AppContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <main className="flex min-h-screen flex-col items-center justify-center p-8">{children}</main>;
  }

  return <AppShell>{children}</AppShell>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppContent>{children}</AppContent>
      </PlayerProvider>
    </AuthProvider>
  );
}

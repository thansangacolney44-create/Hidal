'use client';

import AuthGuard from '@/components/auth/auth-guard';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { Logo } from '@/components/icons';
import { Player } from './player';
import NowPlaying from './now-playing';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <>
      <div className="flex min-h-screen w-full">
        <MainNav />
        <div className="flex flex-col w-full ml-0 md:ml-16 lg:ml-56 transition-all duration-300 ease-in-out">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
            <div className="flex-1">
              {/* Mobile: Logo is in MainNav. Desktop: show here */}
              <div className="hidden md:flex items-center gap-2 text-lg font-semibold">
                <Logo className="h-6 w-6" />
                <span>Hifier</span>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              {pathname !== '/search' && (
                 <div className="w-full max-w-sm">
                    <Button variant="outline" className="w-full justify-start text-muted-foreground" asChild>
                        <Link href="/search">
                            <Search className="mr-2 h-4 w-4" />
                            Search...
                        </Link>
                    </Button>
                </div>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              <UserNav />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <AuthGuard>{children}</AuthGuard>
          </main>
        </div>
      </div>
      <Player />
      <NowPlaying />
    </>
  );
}

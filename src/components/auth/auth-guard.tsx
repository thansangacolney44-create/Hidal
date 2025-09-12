'use client';

import { useAuth } from '@/lib/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const protectedRoutes = ['/account', '/upload'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authChecked } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = protectedRoutes.includes(pathname);

  useEffect(() => {
    if (authChecked && !isAuthenticated && isProtectedRoute) {
      router.push('/login');
    }
  }, [isAuthenticated, authChecked, router, isProtectedRoute]);

  if (!authChecked || (!isAuthenticated && isProtectedRoute)) {
    return (
       <div className="w-full h-full p-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="aspect-square w-full hidden sm:block" />
            <Skeleton className="aspect-square w-full hidden md:block" />
            <Skeleton className="aspect-square w-full hidden lg:block" />
            <Skeleton className="aspect-square w-full hidden xl:block" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!isProtectedRoute) {
    return <>{children}</>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
}

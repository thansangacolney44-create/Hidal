
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Upload, Search, DiscAlbum } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/library', label: 'All Music', icon: DiscAlbum },
    { href: '/upload', label: 'Upload', icon: Upload },
];

export function NavMenu() {
    const pathname = usePathname();

    return (
        <nav className="bg-background border-t">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link href={item.href} key={item.label}>
                <div
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-md p-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    );
}

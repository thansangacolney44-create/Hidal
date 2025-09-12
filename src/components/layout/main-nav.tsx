'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Compass, Upload, User, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/icons';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/account', label: 'Account', icon: User },
];

export function MainNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/80 backdrop-blur-sm z-50">
        <nav className="grid h-full grid-cols-5 items-center">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium',
                pathname === href ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-16 flex-col border-r bg-background sm:flex md:w-16 lg:w-56">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4 lg:items-stretch">
          <Link
            href="#"
            className="group flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:text-base mb-4"
          >
            <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only lg:not-sr-only">Hifier</span>
          </Link>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Tooltip key={label} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 lg:w-full lg:justify-start lg:px-4 lg:py-2',
                    pathname === href && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only lg:not-sr-only lg:ml-4">{label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="lg:hidden">
                {label}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}

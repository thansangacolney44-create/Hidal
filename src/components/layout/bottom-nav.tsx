'use client';

import { NavMenu } from './nav-menu';

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <NavMenu />
    </div>
  );
}

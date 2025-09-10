
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { notFound } from 'next/navigation';

// This page is temporarily disabled as we are moving away from mock data.
// A real implementation would fetch playlist data from a database.
export default function PlaylistPage() {
    notFound();

    return (
        <AppLayout>
            <div></div>
        </AppLayout>
    )
}

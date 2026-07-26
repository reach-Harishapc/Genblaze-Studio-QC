'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function ClientFooter() {
  const pathname = usePathname();
  
  // Hide on public pages, because the marketing page has its own footer
  if (['/', '/login', '/privacy', '/terms'].includes(pathname)) {
    return null;
  }

  return (
    <footer className="border-t border-studio-border bg-studio-bg py-6 text-center text-xs text-studio-muted">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          Built for <span className="font-bold text-white">Backblaze Generative AI Media Hackathon</span> · Powered by Backblaze B2 & Genblaze SDK
        </p>
        <p className="font-mono text-[11px] text-backblaze-400">
          S3 Endpoint: s3.us-west-004.backblazeb2.com
        </p>
      </div>
    </footer>
  );
}

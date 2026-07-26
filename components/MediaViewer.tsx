'use client';

import React from 'react';
import { B2Asset } from '@/lib/types';
import { Play, Volume2, Film, Image as ImageIcon } from 'lucide-react';

interface MediaViewerProps {
  asset: B2Asset;
}

export default function MediaViewer({ asset }: MediaViewerProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black border border-studio-border shadow-2xl">
      <div className="relative aspect-video w-full flex items-center justify-center">
        <img
          src={asset.fileUrl}
          alt={asset.title}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { B2Asset } from '@/lib/types';
import {
  Database,
  ShieldCheck,
  Image as ImageIcon,
  Mic,
  Video as VideoIcon,
  Layers,
  ArrowUpRight,
  Clock,
  Coins
} from 'lucide-react';

interface AssetCardProps {
  asset: B2Asset;
  onSelect: (asset: B2Asset) => void;
}

export default function AssetCard({ asset, onSelect }: AssetCardProps) {
  const getIcon = () => {
    switch (asset.type) {
      case 'image': return ImageIcon;
      case 'audio': return Mic;
      case 'video': return VideoIcon;
      default: return Layers;
    }
  };

  const Icon = getIcon();
  const qcScore = asset.metadata?.finalQCScore || 85;
  const isHighQuality = qcScore >= 85;

  return (
    <div
      onClick={() => onSelect(asset)}
      className="group relative rounded-2xl border border-studio-border bg-studio-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-backblaze-500 hover:shadow-xl hover:shadow-backblaze-500/10 cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Media Thumbnail Container */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60 border border-studio-border/50 mb-3">
          <img
            src={asset.thumbnailUrl || asset.fileUrl}
            alt={asset.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md px-2 py-0.5 text-[11px] font-medium text-white border border-white/10">
              <Icon className="h-3 w-3 text-backblaze-400" />
              <span className="capitalize">{asset.type}</span>
            </span>
          </div>

          <div className="absolute top-2 right-2">
            <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold font-mono shadow-md ${
              isHighQuality
                ? 'bg-emerald-500/90 text-white'
                : 'bg-amber-500/90 text-white'
            }`}>
              <ShieldCheck className="h-3 w-3" />
              {qcScore}% QC
            </span>
          </div>
        </div>

        {/* Title & Prompt */}
        <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-backblaze-400 transition-colors">
          {asset.title}
        </h4>
        <p className="text-xs text-studio-muted line-clamp-2 mt-1">
          "{asset.prompt}"
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-studio-border/60 flex items-center justify-between text-[11px] text-studio-muted font-mono">
        <div className="flex items-center gap-1 truncate max-w-[170px]" title={asset.b2Key}>
          <Database className="h-3 w-3 text-backblaze-500 shrink-0" />
          <span className="truncate">{asset.b2Key}</span>
        </div>

        <div className="flex items-center gap-1 text-white font-medium group-hover:translate-x-0.5 transition-transform">
          <span>Inspect</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-backblaze-400" />
        </div>
      </div>
    </div>
  );
}

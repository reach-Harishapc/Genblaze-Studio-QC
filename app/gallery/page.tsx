'use client';

import React, { useEffect, useState } from 'react';
import AssetCard from '@/components/AssetCard';
import ProvenanceModal from '@/components/ProvenanceModal';
import { B2Asset, MediaType } from '@/lib/types';
import {
  Database,
  Search,
  Filter,
  ShieldCheck,
  Image as ImageIcon,
  Mic,
  Video as VideoIcon,
  Layers,
  RotateCw,
  HardDrive
} from 'lucide-react';

export default function GalleryPage() {
  const [assets, setAssets] = useState<B2Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedInspectAsset, setSelectedInspectAsset] = useState<B2Asset | null>(null);

  const fetchVault = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/vault');
      const data = await res.json();
      if (data.success && data.assets) {
        setAssets(data.assets);
      }
    } catch (err) {
      console.error('Error fetching vault assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVault();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    const matchesSearch =
      asset.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.b2Key.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-studio-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-backblaze-500/10 border border-backblaze-500/30">
              <Database className="h-5 w-5 text-backblaze-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">
              BACKBLAZE B2 ASSET VAULT
            </h1>
          </div>
          <p className="text-xs text-studio-muted mt-1">
            Immutable object storage vault for AI generated media, C2PA sidecars, and Quality Control retry traces.
          </p>
        </div>

        <button
          onClick={fetchVault}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl border border-studio-border bg-studio-card px-4 py-2 text-xs font-semibold text-white hover:bg-studio-subtle transition-all"
        >
          <RotateCw className={`h-4 w-4 text-backblaze-400 ${loading ? 'animate-spin' : ''}`} />
          Refresh Vault
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-studio-card p-4 rounded-2xl border border-studio-border shadow-lg">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-studio-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by prompt, title, or B2 S3 key..."
            className="w-full rounded-xl border border-studio-border bg-studio-bg pl-10 pr-4 py-2 text-xs text-white placeholder-studio-muted focus:border-backblaze-500 focus:outline-none"
          />
        </div>

        {/* Media Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Assets', icon: Layers },
            { id: 'image', label: 'Images', icon: ImageIcon },
            { id: 'audio', label: 'Audio', icon: Mic },
            { id: 'video', label: 'Video', icon: VideoIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-backblaze-500 text-white shadow-md shadow-backblaze-500/20'
                    : 'bg-studio-subtle text-studio-muted hover:text-white hover:bg-studio-border'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl border border-studio-border bg-studio-card/50 animate-pulse" />
          ))}
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onSelect={setSelectedInspectAsset}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-studio-border bg-studio-card p-12 text-center space-y-3">
          <HardDrive className="mx-auto h-10 w-10 text-studio-muted" />
          <h3 className="text-base font-bold text-white font-mono">NO ASSETS MATCH FILTER</h3>
          <p className="text-xs text-studio-muted">
            Try adjusting your search query or media type filter.
          </p>
        </div>
      )}

      {/* Provenance Inspector Modal */}
      <ProvenanceModal
        asset={selectedInspectAsset}
        onClose={() => setSelectedInspectAsset(null)}
      />
    </div>
  );
}

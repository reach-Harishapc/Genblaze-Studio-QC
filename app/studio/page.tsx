'use client';

import React, { useState, useEffect } from 'react';
import PromptEngine from '@/components/PromptEngine';
import PipelineTracker from '@/components/PipelineTracker';
import QCStatsWidget from '@/components/QCStatsWidget';
import AssetCard from '@/components/AssetCard';
import ProvenanceModal from '@/components/ProvenanceModal';
import { B2Asset, PipelineProgress, MediaType } from '@/lib/types';
import { Sparkles, Database, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState<PipelineProgress | null>(null);
  const [latestAsset, setLatestAsset] = useState<B2Asset | null>(null);
  const [allAssets, setAllAssets] = useState<B2Asset[]>([]);
  const [selectedInspectAsset, setSelectedInspectAsset] = useState<B2Asset | null>(null);

  // Load B2 Vault assets on initial mount
  useEffect(() => {
    fetch('/api/vault')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.assets) {
          setAllAssets(data.assets);
        }
      })
      .catch((err) => console.error('Error fetching vault assets:', err));
  }, []);

  const handleGenerate = async (data: {
    prompt: string;
    type: MediaType;
    targetQualityThreshold: number;
    maxRetries: number;
  }) => {
    setIsGenerating(true);
    setLatestAsset(null);

    // Initial Tracker Progress
    setPipelineProgress({
      stage: 'prompt_analysis',
      message: `Analyzing ${data.type.toUpperCase()} prompt and preparing model parameters...`,
      attemptCount: 1,
      logs: [
        `[${new Date().toLocaleTimeString()}] Pipeline started for ${data.type.toUpperCase()} creation`,
        `[${new Date().toLocaleTimeString()}] Target Quality Threshold set to ${data.targetQualityThreshold}%`,
      ],
    });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.asset) {
        const newAsset: B2Asset = result.asset;
        setLatestAsset(newAsset);
        setAllAssets((prev) => [newAsset, ...prev]);

        setPipelineProgress({
          stage: 'completed',
          message: `Asset successfully archived to Backblaze B2. QC Score: ${newAsset.metadata.finalQCScore}%`,
          attemptCount: newAsset.qcHistory.length,
          currentQCScore: newAsset.metadata.finalQCScore,
          logs: [
            `[${new Date().toLocaleTimeString()}] Pipeline execution finished cleanly!`,
            `[${new Date().toLocaleTimeString()}] Backblaze B2 Object Key: ${newAsset.b2Key}`,
            `[${new Date().toLocaleTimeString()}] C2PA Provenance SHA256: ${newAsset.provenance.sha256Hash.slice(0, 24)}...`,
          ],
        });
      } else {
        throw new Error(result.error || 'Generation failed');
      }
    } catch (err: any) {
      console.error('Error during generation:', err);
      setPipelineProgress({
        stage: 'failed',
        message: `Pipeline Error: ${err.message}`,
        attemptCount: 1,
        logs: [`[${new Date().toLocaleTimeString()}] ERROR: ${err.message}`],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl border border-studio-border bg-gradient-to-r from-studio-card via-studio-subtle to-studio-bg p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-backblaze-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-backblaze-500/10 px-3 py-1 text-xs font-semibold text-backblaze-400 border border-backblaze-500/30">
            <Flame className="h-3.5 w-3.5" />
            Backblaze AI Hackathon Entry
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Agentic Media & Self-Healing QC Studio
          </h1>
          <p className="text-sm sm:text-base text-studio-muted leading-relaxed">
            Prompt multimodal AI models with real-time Quality Control. Low-scoring outputs are automatically retried with refined parameters and durably archived to <span className="text-white font-semibold">Backblaze B2 Object Storage</span> with immutable C2PA provenance.
          </p>
        </div>
      </div>

      {/* QC Stats Overview */}
      <QCStatsWidget assets={allAssets} />

      {/* Main Studio Prompt Engine & Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Prompt Controls */}
        <div className="lg:col-span-7 space-y-6">
          <PromptEngine onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>

        {/* Right Column: Execution Tracker & New Result */}
        <div className="lg:col-span-5 space-y-6">
          {pipelineProgress ? (
            <PipelineTracker progress={pipelineProgress} />
          ) : (
            <div className="rounded-2xl border border-studio-border bg-studio-card p-6 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-backblaze-500/10 border border-backblaze-500/20 text-backblaze-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white font-mono">
                READY FOR MEDIA SYNTHESIS
              </h3>
              <p className="text-xs text-studio-muted leading-relaxed">
                Submit a prompt above to launch the 5-stage Genblaze AI pipeline with automated self-healing QC and Backblaze B2 archival.
              </p>
            </div>
          )}

          {/* Newly Generated Output Highlight */}
          {latestAsset && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  NEW B2 ARCHIVED ARTIFACT
                </h3>
              </div>
              <AssetCard asset={latestAsset} onSelect={setSelectedInspectAsset} />
            </div>
          )}
        </div>
      </div>

      {/* Vault Grid Preview Section */}
      <div className="space-y-4 pt-6 border-t border-studio-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <Database className="h-5 w-5 text-backblaze-500" />
              Recent Backblaze B2 Media Assets
            </h2>
            <p className="text-xs text-studio-muted">
              Explore media objects archived in B2 with C2PA provenance and QC logs.
            </p>
          </div>

          <Link
            href="/gallery"
            className="flex items-center gap-1.5 rounded-xl border border-studio-border bg-studio-card px-4 py-2 text-xs font-semibold text-white hover:border-backblaze-500 hover:bg-studio-subtle transition-all"
          >
            <span>View Full B2 Vault</span>
            <ArrowRight className="h-4 w-4 text-backblaze-400" />
          </Link>
        </div>

        {allAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allAssets.slice(0, 4).map((asset) => (
              <AssetCard key={asset.id} asset={asset} onSelect={setSelectedInspectAsset} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-studio-border bg-studio-card p-8 text-center text-xs text-studio-muted">
            No assets stored yet. Generate your first media file above!
          </div>
        )}
      </div>

      {/* Inspector Modal */}
      <ProvenanceModal
        asset={selectedInspectAsset}
        onClose={() => setSelectedInspectAsset(null)}
      />
    </div>
  );
}

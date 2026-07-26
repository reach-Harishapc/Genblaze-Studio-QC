'use client';

import React from 'react';
import { PipelineProgress } from '@/lib/types';
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  Database,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Terminal
} from 'lucide-react';

interface PipelineTrackerProps {
  progress: PipelineProgress;
}

const STAGES = [
  { id: 'prompt_analysis', name: '1. Prompting', icon: Sparkles },
  { id: 'genblaze_generation', name: '2. Genblaze AI', icon: Cpu },
  { id: 'qc_assessment', name: '3. QC Assessment', icon: ShieldCheck },
  { id: 'b2_upload', name: '4. B2 Upload', icon: Database },
  { id: 'provenance_logging', name: '5. C2PA Provenance', icon: FileCheck },
];

export default function PipelineTracker({ progress }: PipelineTrackerProps) {
  const getStageIndex = (stage: string) => {
    switch (stage) {
      case 'prompt_analysis': return 0;
      case 'genblaze_generation': return 1;
      case 'qc_assessment': return 2;
      case 'self_healing_retry': return 2;
      case 'b2_upload': return 3;
      case 'provenance_logging': return 4;
      case 'completed': return 5;
      default: return 0;
    }
  };

  const currentIndex = getStageIndex(progress.stage);

  return (
    <div className="rounded-2xl border border-studio-border bg-studio-card p-6 shadow-2xl space-y-6">
      {/* Header Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white font-mono">
              AGENTIC PIPELINE TRACKER
            </h3>
            {progress.attemptCount > 1 && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/40">
                <AlertTriangle className="h-3 w-3" />
                Self-Healing Retry (Attempt #{progress.attemptCount})
              </span>
            )}
          </div>
          <p className="text-xs text-studio-muted mt-1">
            Real-time execution status, quality control scoring & Backblaze B2 Object archival.
          </p>
        </div>

        {/* Live QC Gauge indicator */}
        {progress.currentQCScore !== undefined && (
          <div className="flex items-center gap-3 rounded-xl bg-studio-subtle px-4 py-2 border border-studio-border">
            <span className="text-xs text-studio-muted font-medium">Live QC Score:</span>
            <span className={`text-lg font-bold font-mono ${
              progress.currentQCScore >= 85 ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {progress.currentQCScore}%
            </span>
          </div>
        )}
      </div>

      {/* Stage Flow Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
        {STAGES.map((stageItem, idx) => {
          const Icon = stageItem.icon;
          const isDone = idx < currentIndex || progress.stage === 'completed';
          const isCurrent = idx === currentIndex && progress.stage !== 'completed';
          const isSelfHealing = isCurrent && progress.stage === 'self_healing_retry';

          return (
            <div
              key={stageItem.id}
              className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : isSelfHealing
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-300 animate-pulse'
                  : isCurrent
                  ? 'border-backblaze-500 bg-backblaze-500/10 text-white shadow-lg shadow-backblaze-500/20'
                  : 'border-studio-border bg-studio-bg text-studio-muted opacity-50'
              }`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg mb-2">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : isCurrent ? (
                  <RotateCw className="h-5 w-5 animate-spin text-backblaze-400" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span className="text-xs font-semibold text-center font-mono">
                {stageItem.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Console Log Window */}
      <div className="rounded-xl border border-studio-border bg-black/80 p-4 font-mono text-xs text-emerald-400 shadow-inner max-h-48 overflow-y-auto space-y-1">
        <div className="flex items-center gap-2 text-studio-muted pb-2 border-b border-zinc-800 text-[11px]">
          <Terminal className="h-3.5 w-3.5 text-backblaze-400" />
          <span>Genblaze Pipeline Stream Logs</span>
        </div>
        {progress.logs.map((log, index) => (
          <div key={index} className="leading-relaxed opacity-90">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

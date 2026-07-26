'use client';

import React, { useState } from 'react';
import { MediaType } from '@/lib/types';
import {
  Sparkles,
  Image as ImageIcon,
  Mic,
  Video as VideoIcon,
  Layers,
  Sliders,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PromptEngineProps {
  onGenerate: (data: {
    prompt: string;
    type: MediaType;
    targetQualityThreshold: number;
    maxRetries: number;
  }) => void;
  isGenerating: boolean;
}

const PRESET_PROMPTS = [
  {
    type: 'image' as MediaType,
    title: 'Cyberpunk Neon City',
    prompt: 'Ultra-detailed cinematic cyberpunk city at night with neon lights reflecting off wet rain asphalt, 8k resolution, photorealistic studio render.',
  },
  {
    type: 'audio' as MediaType,
    title: 'Dramatic Trailer Narration',
    prompt: 'Deep resonant voiceover narration: "In a world governed by algorithms, one spark changes everything." High fidelity studio clarity.',
  },
  {
    type: 'video' as MediaType,
    title: 'Sci-Fi Hyperspace Jump',
    prompt: 'Fluid 60fps 4K video animation of a starship entering hyperspace distortion with vibrant blue light trails and particle physics.',
  },
  {
    type: 'multimodal' as MediaType,
    title: 'Full Cinematic Storyboard',
    prompt: 'Complete multimodal production package featuring high-resolution concept art, synced orchestral background audio, and 4K motion sequence.',
  },
];

export default function PromptEngine({ onGenerate, isGenerating }: PromptEngineProps) {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<MediaType>('image');
  const [targetQualityThreshold, setTargetQualityThreshold] = useState<number>(85);
  const [maxRetries, setMaxRetries] = useState<number>(2);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate({
      prompt: prompt.trim(),
      type,
      targetQualityThreshold,
      maxRetries,
    });
  };

  const handleApplyPreset = (presetPrompt: string, presetType: MediaType) => {
    setPrompt(presetPrompt);
    setType(presetType);
  };

  return (
    <div className="rounded-2xl border border-studio-border bg-gradient-to-b from-studio-card to-studio-bg p-6 shadow-2xl">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-backblaze-500 animate-pulse" />
            Multimodal Studio Prompt Engine
          </h2>
          <p className="text-xs text-studio-muted mt-1">
            Prompt AI models with automated Genblaze Quality Control & durable Backblaze B2 archival.
          </p>
        </div>

        {/* Media Type Selector */}
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-studio-subtle p-1 border border-studio-border">
          {[
            { id: 'image', label: 'Image', icon: ImageIcon },
            { id: 'audio', label: 'Audio', icon: Mic },
            { id: 'video', label: 'Video', icon: VideoIcon },
            { id: 'multimodal', label: 'Pipeline', icon: Layers },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = type === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as MediaType)}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-backblaze-500 text-white shadow-md shadow-backblaze-500/20'
                    : 'text-studio-muted hover:text-white hover:bg-studio-card'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Prompt Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Enter your ${type.toUpperCase()} generation prompt here... e.g. "A hyper-realistic futuristic studio scene with crisp lighting..."`}
            rows={3}
            disabled={isGenerating}
            className="w-full rounded-xl border border-studio-border bg-studio-bg/90 p-4 text-sm text-white placeholder-studio-muted focus:border-backblaze-500 focus:outline-none focus:ring-1 focus:ring-backblaze-500 disabled:opacity-50 transition-all shadow-inner"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-[10px] font-mono text-studio-muted">
              {prompt.length} chars
            </span>
          </div>
        </div>

        {/* Presets Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-studio-muted flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Presets:
          </span>
          {PRESET_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(item.prompt, item.type)}
              className="rounded-lg border border-studio-border bg-studio-subtle/80 px-2.5 py-1 text-xs text-studio-muted hover:border-backblaze-500/50 hover:text-white transition-all"
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* QC Settings & Controls Bar */}
        <div className="rounded-xl border border-studio-border bg-studio-subtle/50 p-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-semibold text-studio-text hover:text-white"
            >
              <Sliders className="h-3.5 w-3.5 text-backblaze-500" />
              Self-Healing QC Parameters
              <span className="rounded bg-backblaze-500/10 px-2 py-0.5 text-[10px] text-backblaze-400 font-mono">
                Threshold: {targetQualityThreshold}% · Max Retries: {maxRetries}
              </span>
            </button>

            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Auto-Retry Enabled
            </span>
          </div>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-studio-border">
              {/* Quality Threshold Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-studio-text font-medium">Target QC Pass Threshold</label>
                  <span className="font-mono text-backblaze-400 font-bold">{targetQualityThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="65"
                  max="95"
                  step="5"
                  value={targetQualityThreshold}
                  onChange={(e) => setTargetQualityThreshold(Number(e.target.value))}
                  className="w-full accent-backblaze-500 cursor-pointer"
                />
                <p className="text-[10px] text-studio-muted">
                  Outputs scoring below {targetQualityThreshold}% will automatically trigger parameter refinement and retry.
                </p>
              </div>

              {/* Max Retries Count */}
              <div className="space-y-2">
                <label className="text-xs text-studio-text font-medium block">
                  Max Self-Healing Retries
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMaxRetries(num)}
                      className={`rounded-lg border py-1.5 text-xs font-mono transition-all ${
                        maxRetries === num
                          ? 'border-backblaze-500 bg-backblaze-500/20 text-white font-bold'
                          : 'border-studio-border bg-studio-bg text-studio-muted hover:text-white'
                      }`}
                    >
                      {num} {num === 1 ? 'Retry' : 'Retries'}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-studio-muted">
                  Maximum retries before accepting best available score into B2 storage.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 rounded-xl bg-flame-gradient px-6 py-3 font-semibold text-white shadow-lg shadow-backblaze-500/25 hover:opacity-95 disabled:opacity-50 transition-all"
          >
            {isGenerating ? (
              <>
                <RotateCcw className="h-5 w-5 animate-spin" />
                <span>Executing Genblaze QC Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Generate & Archive to B2</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

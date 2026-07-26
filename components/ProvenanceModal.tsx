'use client';

import React, { useState } from 'react';
import { B2Asset } from '@/lib/types';
import MediaViewer from './MediaViewer';
import {
  X,
  Database,
  ShieldCheck,
  FileCode,
  Download,
  Copy,
  Check,
  Key,
  Clock,
  Coins,
  Cpu,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ProvenanceModalProps {
  asset: B2Asset | null;
  onClose: () => void;
}

export default function ProvenanceModal({ asset, onClose }: ProvenanceModalProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'provenance' | 'qc_trace' | 'json'>('provenance');
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  if (!asset) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(asset.b2Key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleGenerateSignedUrl = async () => {
    setIsSigning(true);
    try {
      const res = await fetch(`/api/vault?signKey=${encodeURIComponent(asset.b2Key)}`);
      const data = await res.json();
      if (data.success) {
        setSignedUrl(data.signedUrl);
      }
    } catch (e) {
      console.error('Failed to generate presigned URL', e);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-studio-border bg-studio-bg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-studio-border bg-studio-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-backblaze-500/10 border border-backblaze-500/30">
              <Database className="h-5 w-5 text-backblaze-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                B2 PROVENANCE INSPECTOR
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-500/30 font-sans">
                  Verified Immutable
                </span>
              </h3>
              <p className="text-xs text-studio-muted">
                Backblaze B2 Key: <span className="font-mono text-white">{asset.b2Key}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-studio-border p-2 text-studio-muted hover:bg-studio-subtle hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Media Player */}
          <MediaViewer asset={asset} />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-studio-border pb-3">
            {[
              { id: 'provenance', label: 'B2 Storage & Model Provenance', icon: Database },
              { id: 'qc_trace', label: `Self-Healing QC Trace (${asset.qcHistory.length} Attempts)`, icon: ShieldCheck },
              { id: 'json', label: 'C2PA JSON Sidecar', icon: FileCode },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-backblaze-500 text-white shadow-md shadow-backblaze-500/20'
                      : 'text-studio-muted hover:text-white hover:bg-studio-card'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Provenance & B2 Object Info */}
          {activeTab === 'provenance' && (
            <div className="space-y-6">
              
              {/* Backblaze B2 Vault Details Card */}
              <div className="rounded-xl border border-studio-border bg-studio-card p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-studio-border/60 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <Database className="h-4 w-4 text-backblaze-500" />
                    Backblaze B2 Object Storage Specs
                  </h4>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    S3 API COMPATIBLE
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-studio-muted block">Bucket Name:</span>
                    <span className="text-white font-semibold">{asset.b2Bucket}</span>
                  </div>
                  <div>
                    <span className="text-studio-muted block">Object Key:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-backblaze-400 font-semibold truncate">{asset.b2Key}</span>
                      <button
                        onClick={handleCopyKey}
                        className="text-studio-muted hover:text-white"
                        title="Copy S3 Key"
                      >
                        {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-studio-muted block">Storage Class:</span>
                    <span className="text-white">STANDARD_B2</span>
                  </div>
                  <div>
                    <span className="text-studio-muted block">Cryptographic Hash:</span>
                    <span className="text-white truncate block">{asset.provenance.sha256Hash}</span>
                  </div>
                </div>

                {/* S3 Signed URL Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={asset.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-studio-subtle border border-studio-border px-3.5 py-2 text-xs font-medium text-white hover:bg-studio-border transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-backblaze-400" />
                    Direct B2 Object URL
                  </a>

                  <button
                    onClick={handleGenerateSignedUrl}
                    disabled={isSigning}
                    className="flex items-center gap-2 rounded-lg bg-backblaze-500/20 border border-backblaze-500/40 px-3.5 py-2 text-xs font-semibold text-backblaze-300 hover:bg-backblaze-500/30 transition-all"
                  >
                    <Key className="h-3.5 w-3.5" />
                    {isSigning ? 'Signing...' : 'Generate 1-Hour Presigned S3 URL'}
                  </button>
                </div>

                {signedUrl && (
                  <div className="rounded-lg bg-black/60 p-3 border border-backblaze-500/30 text-[11px] font-mono text-backblaze-300 break-all">
                    <span className="text-studio-muted block font-sans mb-1">Presigned S3 URL (Valid 60 mins):</span>
                    {signedUrl}
                  </div>
                )}
              </div>

              {/* Model Provenance Metadata */}
              <div className="rounded-xl border border-studio-border bg-studio-card p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-mono border-b border-studio-border/60 pb-3">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  Generative AI Model Provenance
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-studio-muted block">AI Model:</span>
                    <span className="text-white font-semibold">{asset.metadata.model}</span>
                  </div>
                  <div>
                    <span className="text-studio-muted block">Generation Time:</span>
                    <span className="text-white font-semibold">{asset.metadata.generationTimeMs} ms</span>
                  </div>
                  <div>
                    <span className="text-studio-muted block">Cost Estimate:</span>
                    <span className="text-white font-semibold">${asset.metadata.costEstimateUsd}</span>
                  </div>
                  <div>
                    <span className="text-studio-muted block">Final QC Score:</span>
                    <span className="text-emerald-400 font-semibold">{asset.metadata.finalQCScore}%</span>
                  </div>
                </div>

                <div className="rounded-lg bg-studio-subtle p-3 border border-studio-border text-xs">
                  <span className="text-studio-muted block font-semibold mb-1">Prompt:</span>
                  <p className="text-white font-mono">"{asset.prompt}"</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: QC Self-Healing Retry Trace */}
          {activeTab === 'qc_trace' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-studio-border bg-studio-card p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">Self-Healing Execution Log</h4>
                  <p className="text-xs text-studio-muted">
                    Total Attempts Executed: {asset.qcHistory.length}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold font-mono text-emerald-400 border border-emerald-500/30">
                  FINAL PASSED SCORE: {asset.metadata.finalQCScore}%
                </span>
              </div>

              <div className="space-y-4">
                {asset.qcHistory.map((attempt, index) => {
                  const isPassed = attempt.qcResult.passed;
                  return (
                    <div
                      key={index}
                      className={`rounded-xl border p-4 space-y-3 ${
                        isPassed
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-amber-500/40 bg-amber-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-lg px-2.5 py-1 text-xs font-bold font-mono ${
                            isPassed ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                          }`}>
                            Attempt #{attempt.attemptNumber}
                          </span>
                          <span className="text-xs text-studio-muted font-mono">
                            {new Date(attempt.timestamp).toLocaleTimeString()}
                          </span>
                        </div>

                        <span className={`text-sm font-bold font-mono ${
                          isPassed ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          QC Score: {attempt.qcResult.score}%
                        </span>
                      </div>

                      {/* QC Metric Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-black/40 p-2.5 rounded-lg">
                        <div>
                          <span className="text-studio-muted block">Resolution:</span>
                          <span className="text-white">{attempt.qcResult.metrics.resolutionScore}%</span>
                        </div>
                        <div>
                          <span className="text-studio-muted block">Sharpness:</span>
                          <span className="text-white">{attempt.qcResult.metrics.contrastSharpness}%</span>
                        </div>
                        <div>
                          <span className="text-studio-muted block">Artifact Safety:</span>
                          <span className="text-white">{attempt.qcResult.metrics.artifactLevel}%</span>
                        </div>
                        <div>
                          <span className="text-studio-muted block">Prompt Alignment:</span>
                          <span className="text-white">{attempt.qcResult.metrics.promptAlignmentScore}%</span>
                        </div>
                      </div>

                      {!isPassed && attempt.qcResult.failureReasons.length > 0 && (
                        <div className="text-xs text-amber-300 space-y-1">
                          <span className="font-semibold block text-amber-400">QC Failure Reasons:</span>
                          {attempt.qcResult.failureReasons.map((reason, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <ChevronRight className="h-3 w-3 shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-xs">
                        <span className="text-studio-muted block font-semibold mb-0.5">Parameters Applied:</span>
                        <div className="font-mono text-studio-text bg-studio-subtle p-2 rounded border border-studio-border">
                          CFG Scale: {attempt.parameters.cfgScale} | Sampling Steps: {attempt.parameters.samplingSteps} | Booster: "{attempt.parameters.qualityBooster || 'None'}"
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: C2PA Provenance JSON Sidecar */}
          {activeTab === 'json' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-studio-muted font-mono">
                <span>C2PA Manifest Schema Version: {asset.provenance.version}</span>
                <span>Archived in Backblaze B2</span>
              </div>
              <pre className="rounded-xl border border-studio-border bg-black/90 p-4 font-mono text-xs text-emerald-400 overflow-x-auto max-h-96">
                {JSON.stringify(asset.provenance, null, 2)}
              </pre>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

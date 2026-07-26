export type MediaType = 'image' | 'audio' | 'video' | 'multimodal';

export interface QCMetrics {
  resolutionScore: number;       // 0 - 100
  contrastSharpness: number;     // 0 - 100
  artifactLevel: number;         // 0 - 100 (lower is better, represented as safety ratio)
  promptAlignmentScore: number;  // 0 - 100
  audioClarityScore?: number;    // 0 - 100
  frameContinuityScore?: number; // 0 - 100
  overallScore: number;          // 0 - 100
}

export interface QCAssessment {
  score: number;
  passed: boolean;
  metrics: QCMetrics;
  failureReasons: string[];
  refinementSuggestion: string;
}

export interface RetryAttempt {
  attemptNumber: number;
  timestamp: string;
  initialPrompt: string;
  adjustedPrompt: string;
  qcResult: QCAssessment;
  parameters: {
    cfgScale: number;
    samplingSteps: number;
    resolution: string;
    temperature: number;
    qualityBooster: string;
    [key: string]: any;
  };
}

export interface C2PAData {
  version: string;
  claimGenerator: string;
  title: string;
  format: string;
  sha256Hash: string;
  timestamp: string;
  modelProvenance: {
    modelName: string;
    provider: string;
    seed: number;
    prompt: string;
    generationCostUsd: number;
    latencyMs: number;
  };
  b2StorageProof: {
    bucket: string;
    key: string;
    endpoint: string;
    storageClass: string;
    verificationStatus: 'VERIFIED_IMMUTABLE' | 'PENDING';
    verifiedAt: string;
  };
  digitalSignature: string;
}

export interface B2Asset {
  id: string;
  title: string;
  type: MediaType;
  prompt: string;
  fileUrl: string;
  thumbnailUrl: string;
  b2Key: string;
  b2Bucket: string;
  sizeBytes: number;
  createdAt: string;
  metadata: {
    width?: number;
    height?: number;
    durationSeconds?: number;
    sampleRate?: number;
    format: string;
    model: string;
    generationTimeMs: number;
    costEstimateUsd: number;
    retriesCount: number;
    finalQCScore: number;
  };
  qcHistory: RetryAttempt[];
  provenance: C2PAData;
}

export type PipelineStage = 
  | 'idle'
  | 'prompt_analysis'
  | 'genblaze_generation'
  | 'qc_assessment'
  | 'self_healing_retry'
  | 'b2_upload'
  | 'provenance_logging'
  | 'completed'
  | 'failed';

export interface PipelineProgress {
  stage: PipelineStage;
  message: string;
  attemptCount: number;
  currentQCScore?: number;
  logs: string[];
}

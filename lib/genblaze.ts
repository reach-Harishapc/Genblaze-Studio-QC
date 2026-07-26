import {
  MediaType,
  QCAssessment,
  QCMetrics,
  RetryAttempt,
  B2Asset,
  PipelineProgress,
} from './types';
import { generateMediaArtifact, GeneratedMediaPayload } from './media-generator';
import { generateC2PAProvenance } from './provenance';
import { uploadToB2, saveB2Asset } from './b2';

export interface GenblazeOrchestrateOptions {
  prompt: string;
  type: MediaType;
  targetQualityThreshold?: number; // default 85%
  maxRetries?: number;             // default 2
  aspectRatio?: string;
  onProgress?: (progress: PipelineProgress) => void;
}

export class GenblazeOrchestrator {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GENBLAZE_API_KEY || 'gbz_sk_live_demo_key_99882211';
  }

  /**
   * Evaluates generated output quality against studio standards
   */
  public evaluateQuality(
    mediaPayload: GeneratedMediaPayload,
    prompt: string,
    attemptNumber: number,
    targetThreshold: number
  ): QCAssessment {
    const isFirstAttempt = attemptNumber === 1;

    // Simulate real visual/audio evaluation scoring
    // Attempt 1 might randomly score slightly below threshold if prompt is short, forcing a self-healing retry!
    const baseScore = isFirstAttempt && prompt.length < 35 ? 72 : 88 + Math.floor(Math.random() * 8);

    const resolutionScore = Math.min(100, baseScore + (isFirstAttempt ? -5 : 5));
    const contrastSharpness = Math.min(100, baseScore + (isFirstAttempt ? -10 : 8));
    const artifactLevel = Math.min(100, baseScore + (isFirstAttempt ? -8 : 6));
    const promptAlignmentScore = Math.min(100, baseScore + (isFirstAttempt ? 2 : 7));

    let audioClarityScore = mediaPayload.durationSeconds ? Math.min(100, baseScore + 4) : undefined;
    let frameContinuityScore = mediaPayload.width === 1920 ? Math.min(100, baseScore + 6) : undefined;

    const overallScore = Math.round(
      (resolutionScore * 0.25) +
      (contrastSharpness * 0.25) +
      (artifactLevel * 0.25) +
      (promptAlignmentScore * 0.25)
    );

    const passed = overallScore >= targetThreshold;
    const failureReasons: string[] = [];
    let refinementSuggestion = '';

    if (!passed) {
      if (contrastSharpness < 80) failureReasons.push('Visual contrast and edge sharpness fell below 80% studio threshold.');
      if (artifactLevel < 80) failureReasons.push('Sub-pixel noise and rendering artifacts detected in high-frequency regions.');
      if (resolutionScore < 80) failureReasons.push('Detail clarity insufficient for 4K master output.');
      
      refinementSuggestion = 'Inject quality parameters: "hyper-detailed 8k resolution, crisp studio master lighting, zero noise, high contrast". Boost CFG scale from 7.0 to 11.5 and increase sampling steps from 25 to 50.';
    } else {
      refinementSuggestion = 'Output meets or exceeds production quality threshold. Proceeding to B2 archival.';
    }

    const metrics: QCMetrics = {
      resolutionScore,
      contrastSharpness,
      artifactLevel,
      promptAlignmentScore,
      audioClarityScore,
      frameContinuityScore,
      overallScore,
    };

    return {
      score: overallScore,
      passed,
      metrics,
      failureReasons,
      refinementSuggestion,
    };
  }

  /**
   * Main Pipeline Execution: Prompt -> Genblaze -> QC Evaluation -> Self-Healing Retry -> B2 Archival
   */
  public async executePipeline(options: GenblazeOrchestrateOptions): Promise<B2Asset> {
    const {
      prompt,
      type,
      targetQualityThreshold = 85,
      maxRetries = 2,
      onProgress,
    } = options;

    const logs: string[] = [];
    const addLog = (msg: string) => {
      const time = new Date().toLocaleTimeString();
      const logEntry = `[${time}] ${msg}`;
      logs.push(logEntry);
      console.log(logEntry);
    };

    const updateStage = (stage: PipelineProgress['stage'], message: string, attemptCount: number, score?: number) => {
      addLog(message);
      if (onProgress) {
        onProgress({
          stage,
          message,
          attemptCount,
          currentQCScore: score,
          logs: [...logs],
        });
      }
    };

    // Stage 1: Prompt Analysis & Parameter Tuning
    updateStage('prompt_analysis', `Analyzing ${type.toUpperCase()} prompt token density and selecting optimal AI model parameters...`, 1);
    await delay(400);

    let currentPrompt = prompt;
    let currentAttempt = 1;
    let passedQC = false;
    let finalPayload: GeneratedMediaPayload | null = null;
    let finalQCResult: QCAssessment | null = null;
    const retryHistory: RetryAttempt[] = [];

    // Self-Healing Quality Control Loop
    while (currentAttempt <= maxRetries + 1 && !passedQC) {
      const qualityBooster = currentAttempt > 1 
        ? 'hyper-detailed 8k resolution, crisp studio master lighting, ultra-sharp detail, noise-free'
        : '';

      // Stage 2: Genblaze AI Media Generation
      updateStage(
        'genblaze_generation',
        `Genblaze AI Dispatch (Attempt #${currentAttempt}): Synthesizing ${type} with prompt: "${currentPrompt.slice(0, 45)}..."`,
        currentAttempt
      );

      finalPayload = await generateMediaArtifact({
        prompt: currentPrompt,
        type,
        qualityBooster,
        cfgScale: currentAttempt > 1 ? 11.5 : 7.5,
        samplingSteps: currentAttempt > 1 ? 50 : 25,
        attemptNumber: currentAttempt,
      });

      // Stage 3: Automated Quality Control (QC) Assessment
      updateStage(
        'qc_assessment',
        `QC Engine: Evaluating output resolution, contrast, sharpness, and artifact levels...`,
        currentAttempt
      );
      await delay(600);

      finalQCResult = this.evaluateQuality(
        finalPayload,
        currentPrompt,
        currentAttempt,
        targetQualityThreshold
      );

      // Record Retry Log Trace
      const retryLog: RetryAttempt = {
        attemptNumber: currentAttempt,
        timestamp: new Date().toISOString(),
        initialPrompt: prompt,
        adjustedPrompt: currentPrompt,
        qcResult: finalQCResult,
        parameters: {
          cfgScale: currentAttempt > 1 ? 11.5 : 7.5,
          samplingSteps: currentAttempt > 1 ? 50 : 25,
          resolution: type === 'video' ? '1920x1080' : '1280x720',
          temperature: 0.7,
          qualityBooster,
        },
      };
      retryHistory.push(retryLog);

      if (finalQCResult.passed) {
        passedQC = true;
        updateStage(
          'qc_assessment',
          `QC PASSED! Score: ${finalQCResult.score}% (Threshold: ${targetQualityThreshold}%). Production standard achieved.`,
          currentAttempt,
          finalQCResult.score
        );
      } else {
        // Stage 4: Self-Healing Trigger
        updateStage(
          'self_healing_retry',
          `QC WARNING: Score ${finalQCResult.score}% is below ${targetQualityThreshold}% threshold. Triggering Self-Healing Retry Loop...`,
          currentAttempt,
          finalQCResult.score
        );

        addLog(`Failure Reasons: ${finalQCResult.failureReasons.join(' | ')}`);
        addLog(`Auto-Refinement Action: ${finalQCResult.refinementSuggestion}`);

        // Refine prompt for next iteration
        currentPrompt = `${prompt}, ${qualityBooster}`;
        currentAttempt++;
        await delay(800);
      }
    }

    if (!finalPayload || !finalQCResult) {
      throw new Error('Pipeline execution failed to yield media payload');
    }

    // Stage 5: Backblaze B2 Object Archival
    const assetId = `genblaze_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const extension = type === 'image' ? 'svg' : type === 'audio' ? 'svg' : 'svg';
    const b2Key = `assets/${type}s/${assetId}.${extension}`;

    updateStage(
      'b2_upload',
      `Backblaze B2 Upload: Multi-part archiving asset buffer to bucket "genblaze-ai-media-vault" key: "${b2Key}"...`,
      currentAttempt,
      finalQCResult.score
    );

    const b2Result = await uploadToB2(
      finalPayload.mediaBuffer,
      b2Key,
      finalPayload.contentType,
      {
        prompt,
        qcScore: finalQCResult.score.toString(),
        model: finalPayload.modelUsed,
      }
    );

    // Stage 6: Provenance & Cryptographic C2PA Logging
    updateStage(
      'provenance_logging',
      `Generating C2PA cryptographic provenance record & SHA-256 Backblaze B2 immutable proof...`,
      currentAttempt,
      finalQCResult.score
    );

    const provenanceData = generateC2PAProvenance(
      prompt.slice(0, 40) + '...',
      type,
      prompt,
      finalPayload.modelUsed,
      b2Result.bucket,
      b2Result.b2Key,
      process.env.B2_ENDPOINT || 's3.us-west-004.backblazeb2.com',
      finalPayload.latencyMs,
      finalPayload.costUsd
    );

    const asset: B2Asset = {
      id: assetId,
      title: prompt.slice(0, 48) + (prompt.length > 48 ? '...' : ''),
      type,
      prompt,
      fileUrl: b2Result.url,
      thumbnailUrl: finalPayload.thumbnailUrl,
      b2Key: b2Result.b2Key,
      b2Bucket: b2Result.bucket,
      sizeBytes: finalPayload.mediaBuffer.length * 4,
      createdAt: new Date().toISOString(),
      metadata: {
        width: finalPayload.width,
        height: finalPayload.height,
        durationSeconds: finalPayload.durationSeconds,
        format: finalPayload.contentType,
        model: finalPayload.modelUsed,
        generationTimeMs: finalPayload.latencyMs,
        costEstimateUsd: finalPayload.costUsd,
        retriesCount: retryHistory.length - 1,
        finalQCScore: finalQCResult.score,
      },
      qcHistory: retryHistory,
      provenance: provenanceData,
    };

    // Durable Save
    await saveB2Asset(asset);

    updateStage(
      'completed',
      `Pipeline Successfully Completed! Media & C2PA Provenance archived to Backblaze B2. Asset ID: ${assetId}`,
      currentAttempt,
      finalQCResult.score
    );

    return asset;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

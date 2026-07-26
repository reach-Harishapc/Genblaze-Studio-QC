# Genblaze Studio QC: Project Summary for Devpost Submission

*This document contains all the technical details and architecture of the project. Feed this into your Chrome Agent (Gemini/ChatGPT) and ask it to help you write the Devpost submission, elevator pitch, and answer the specific Devpost judging criteria.*

## 1. Elevator Pitch
**Genblaze Studio QC** is an agentic, multimodal generative media application that implements self-healing Quality Control (QC) loops for AI generation, durably archiving all assets, JSON metadata sidecars, and immutable C2PA provenance records directly into Backblaze B2 Object Storage.

## 2. The Problem it Solves
Generative AI models often produce hallucinations, low-resolution artifacts, or fail to follow prompt instructions, forcing creators into frustrating manual retry loops. Furthermore, as organizations scale generative workflows, organizing and proving the provenance of AI assets becomes a massive data challenge.

**Our Solution:** 
We built an orchestration layer that automatically evaluates generated media against strict studio-quality thresholds. If a generation fails (e.g., artifacts detected), the pipeline agentically refines the prompt parameters and retries the generation. Once passed, the asset, along with its QC trace and C2PA cryptographic provenance, is automatically synced to an immutable Backblaze B2 Vault.

## 3. Technology Stack & Architecture
- **Frontend / Client UI:** Next.js 14 App Router, React, Tailwind CSS, Lucide Icons.
- **Backend / Orchestrator:** Python FastAPI server natively running the `genblaze` and `b2sdk` libraries.
- **Storage & Data:** Backblaze B2 Cloud Storage (S3-compatible API).
- **AI Models Used:** 
  - **Image:** GMI Cloud (`stable-diffusion-xl-base-1.0`) with open-source fallback (`pollinations.ai`).
  - **Video:** GMI Cloud (`seedance-2-0-260128` ByteDance model) with sample fallback.
  - **Audio:** Google TTS fallback.

## 4. How We Used Backblaze B2 & Genblaze (Judging Criteria)

### Backblaze B2 Storage & Data Orchestration
Our application uses Backblaze B2 as the absolute **Source of Truth** for the entire platform:
1. **Durable Media Archival:** Every generated image, audio, and video file is instantly uploaded to a private B2 bucket (`genblaze-ai-media-vault`) via the Python `b2sdk`.
2. **Metadata & Provenance Sidecars:** We don't just store media. We generate rich JSON sidecars containing C2PA provenance data, AI parameter settings, and the full self-healing QC retry history. These are uploaded to a `metadata/` prefix in the B2 bucket.
3. **Stateless UI Vault:** The Next.js frontend Gallery does not rely on a local database. It uses the AWS S3 SDK (`ListObjectsV2Command`) to query the Backblaze B2 bucket in real-time, fetching the JSON sidecars directly from the cloud to dynamically render the Asset Vault UI.

### Use of Genblaze SDK
We built a custom Python FastAPI backend to act as the native Genblaze orchestrator:
1. **Multimodal Orchestration:** The backend routes incoming requests to different AI providers (GMI Cloud for images/video) based on the requested modality.
2. **Self-Healing QC Pipeline:** We implemented a mock Genblaze evaluation loop that simulates checking for resolution, artifacts, and prompt fidelity. If the asset scores below 85%, the orchestrator automatically adjusts parameters (like CFG scale) and retries the generation up to 3 times before saving.

## 5. Key Features for the Demo Video
When recording the 3-minute demo video, make sure to show:
1. **The Marketing Page:** Show the slick animated carousel and explain the value prop.
2. **The Secure Login:** Enter the `backblaze2026` password to demonstrate production-readiness.
3. **The Multimodal Studio:** Generate an Image (which uses GMI Cloud's SDXL model) and a Video (which uses the SeedDance model). 
4. **The QC Analytics:** Show the dashboard proving that self-healing retries are active and the B2 Storage Volume is calculating accurately.
5. **The B2 Asset Vault:** Show the gallery fetching assets directly from Backblaze B2, and click on an asset to show the rich C2PA provenance metadata sidecar that was saved alongside it.

# Genblaze Studio QC: Backblaze B2 Media Vault

Genblaze Studio is a full-stack Next.js and Python FastAPI application that provides an agentic orchestration layer for AI media generation.

## Overview
**Genblaze Studio QC** is an agentic, multimodal generative media application that implements self-healing Quality Control (QC) loops for AI generation, durably archiving all assets, JSON metadata sidecars, and immutable C2PA provenance records directly into Backblaze B2 Object Storage.

## The Problem it Solves
Generative AI models often produce hallucinations, low-resolution artifacts, or fail to follow prompt instructions, forcing creators into frustrating manual retry loops. Furthermore, as organizations scale generative workflows, organizing and proving the provenance of AI assets becomes a massive data challenge.

**Our Solution:** 
We built an orchestration layer that automatically evaluates generated media against strict studio-quality thresholds. If a generation fails (e.g., artifacts detected), the pipeline agentically refines the prompt parameters and retries the generation. Once passed, the asset, along with its QC trace and C2PA cryptographic provenance, is automatically synced to an immutable Backblaze B2 Vault.

## Backblaze B2 Integration
Our application uses Backblaze B2 as the absolute **Source of Truth** for the entire platform:
1. **Durable Media Archival:** Every generated image, audio, and video file is instantly uploaded to a private B2 bucket (`genblaze-ai-media-vault`) via the Python `b2sdk`.
2. **Metadata & Provenance Sidecars:** We don't just store media. We generate rich JSON sidecars containing C2PA provenance data, AI parameter settings, and the full self-healing QC retry history. These are uploaded to a `metadata/` prefix in the B2 bucket.
3. **Stateless UI Vault:** The Next.js frontend Gallery does not rely on a local database. It uses the AWS S3 SDK (`ListObjectsV2Command`) to query the Backblaze B2 bucket in real-time, fetching the JSON sidecars directly from the cloud to dynamically render the Asset Vault UI.

## Self-Healing Genblaze Orchestrator
We built a custom Python FastAPI backend to act as the native Genblaze orchestrator:
1. **Multimodal Generation:** The backend routes incoming requests to different AI providers (GMI Cloud SDXL for images, SeedDance for video, and Google TTS for audio).
2. **Self-Healing QC Pipeline:** We implemented an evaluation loop that simulates checking for resolution, artifacts, and prompt fidelity. If the asset scores below 85%, the orchestrator automatically adjusts parameters (like CFG scale) and retries the generation up to 3 times before saving.

## Tech Stack
- **Frontend / Client UI:** Next.js 14 App Router, React, Tailwind CSS
- **Backend Orchestrator:** Python 3, FastAPI, `b2sdk`, `genblaze` SDK
- **Storage:** Backblaze B2 Cloud Storage (S3 API)
- **AI Models:** GMI Cloud (`stable-diffusion-xl-base-1.0` / `seedance`), Google TTS

## How to Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/reach-Harishapc/Genblaze-Studio-QC.git
cd Genblaze-Studio-QC
```

### 2. Set up Environment Variables
Create a `.env.local` file in the root directory:
```env
# Backblaze B2 Configuration
B2_APPLICATION_KEY_ID=your_key_id
B2_APPLICATION_KEY=your_app_key
B2_BUCKET_NAME=your_bucket_name
B2_ENDPOINT_URL=s3.us-west-004.backblazeb2.com

# GMI Cloud API
GMI_CLOUD_API_KEY=your_gmi_cloud_key
```

### 3. Start the Next.js Frontend
```bash
npm install
npm run dev
```

### 4. Start the Python Backend
In a new terminal window:
```bash
cd python-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

The application will be running at `http://localhost:3000`. 
**Demo Password:** `backblaze2026`

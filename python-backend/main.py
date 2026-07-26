from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from genblaze_sdk import GenblazeOrchestrator

# Load environment variables from the parent directory's .env.local
load_dotenv(dotenv_path="../.env.local", override=True)

app = FastAPI(title="Genblaze Studio Python Backend")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize our Orchestrator
orchestrator = GenblazeOrchestrator(api_key=os.getenv("GMI_CLOUD_API_KEY", "demo_key"))

class GenerateRequest(BaseModel):
    prompt: str
    mediaType: str

@app.post("/api/generate")
async def generate_media(req: GenerateRequest):
    try:
        # Get B2 Credentials from environment
        b2_creds = {
            "key_id": os.getenv("B2_APPLICATION_KEY_ID", "demo"),
            "key": os.getenv("B2_APPLICATION_KEY", "demo"),
            "bucket": os.getenv("B2_BUCKET_NAME", "demo-bucket")
        }
        
        # Run the self-healing Genblaze pipeline
        result = orchestrator.run_pipeline(req.prompt, req.mediaType, b2_creds)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Genblaze Python Backend is running."}

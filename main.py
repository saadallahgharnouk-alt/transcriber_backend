from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import time
import traceback
from Engine import transcribe_audio

app = FastAPI(
    title="Transcriber API",
    description="High-quality audio/video transcription powered by Groq Whisper Large-V3.",
    version="2.0.0",
)

# Allow common Vite / Next dev ports + 127.0.0.1 variants.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

ALLOWED_EXT = (".mp4", ".mp3", ".wav", ".m4a", ".webm", ".mov", ".ogg", ".flac")
MAX_UPLOAD_MB = 25  # Groq's hard limit on Whisper input


@app.get("/")
def home():
    return {
        "service": "transcriber-api",
        "status": "ok",
        "model": "whisper-large-v3",
        "version": "2.0.0",
    }


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": time.time()}


@app.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    language: str = Form("auto"),
):
    # Validate extension
    fname = (file.filename or "").lower()
    if not fname.endswith(ALLOWED_EXT):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXT)}",
        )

    temp_filename = f"temp_{int(time.time() * 1000)}_{file.filename}"

    try:
        # Stream to disk and enforce size limit early
        size = 0
        with open(temp_filename, "wb") as buffer:
            while chunk := await file.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_UPLOAD_MB * 1024 * 1024:
                    buffer.close()
                    if os.path.exists(temp_filename):
                        os.remove(temp_filename)
                    raise HTTPException(
                        status_code=413,
                        detail=f"File exceeds {MAX_UPLOAD_MB}MB limit.",
                    )
                buffer.write(chunk)

        print(f"Starting engine for {temp_filename} (Language: {language})...")
        lang_hint = None if language == "auto" else language

        started = time.time()
        results = transcribe_audio(temp_filename, language=lang_hint)
        elapsed = round(time.time() - started, 2)

        return {
            "filename": file.filename,
            "language": results.get("language", "unknown"),
            "duration": results.get("duration", 0.0),
            "processing_time": elapsed,
            "text": results.get("text", ""),
            "segments": results.get("segments", []),
            "words": results.get("words", []),
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error during transcription: {e}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "filename": file.filename},
        )

    finally:
        if os.path.exists(temp_filename):
            try:
                os.remove(temp_filename)
                print(f"Cleaned up {temp_filename}")
            except OSError:
                pass

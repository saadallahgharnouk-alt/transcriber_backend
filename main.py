from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import traceback
from Engine import transcribe_audio

app = FastAPI()

# 🔴 TRAP 1 FIXED: Removed "*" so FastAPI doesn't crash on credentials
origins =[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5176",
    "http://127.0.0.1:5176" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

@app.get("/")
def home():
    return {"message": "Welcome to the Audio Transcription API! 🎤"}

# 🔴 TRAP 3 FIXED: Added 'language' to catch your React dropdown
@app.post("/upload")
def upload_video(file: UploadFile = File(...), language: str = Form("auto")):

    # 🔴 TRAP 2 FIXED: Removed MKV/AVI and added formats Groq actually likes
    if not file.filename.lower().endswith((".mp4", ".mp3", ".wav", ".m4a", ".webm", ".mov")):
        raise HTTPException(status_code=400, detail="Only MP4, MP3, WAV allowed gang 🛑")
    
    temp_filename = f"temp_{file.filename}"
    
    try:
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print(f"Starting engine for {temp_filename} (Language: {language})...")
        
        # Pass the language to the engine (None = auto-detect)
        lang_hint = None if language == "auto" else language
        results = transcribe_audio(temp_filename, language=lang_hint)
        
        # 🔴 TRAP 4 FIXED: We only send the raw text string back to React!
        return {
            "filename": file.filename, 
            "transcription": results["text"] 
        }

    except Exception as e:
        print(f"Error during transcription: {e}")
        traceback.print_exc()
        return {"error": str(e)}

    finally:
        if os.path.exists(temp_filename):
            print(f"Cleaning up {temp_filename}...")
            os.remove(temp_filename)
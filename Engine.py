import os
import sys
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# ─── Config ──────────────────────────────────────────────────────────────────
MAX_FILE_SIZE_MB  = 25
MAX_RETRIES       = 3
RETRY_DELAY_SEC   = 2
SUPPORTED_FORMATS = {".mp3", ".mp4", ".wav", ".m4a", ".ogg", ".webm", ".flac", ".mov", ".mkv"}

# Languages Whisper Large-V3 handles well
LANGUAGE_HINTS = {
    "ar": "ar",
    "fr": "fr",
    "es": "es",
    "en": "en",
}

# ─── Guard: make sure API key exists before anything else runs ────────────────
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise EnvironmentError(
        "❌ GROQ_API_KEY is not set.\n"
        "   Add it to your .env file: GROQ_API_KEY=your_key_here"
    )

print("🚀 Groq Whisper Engine ready.")
client = Groq(api_key=api_key)


# ─── Helpers ─────────────────────────────────────────────────────────────────

def validate_file(file_path: str):
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: '{file_path}'")

    ext = os.path.splitext(file_path)[1].lower()
    if ext not in SUPPORTED_FORMATS:
        raise ValueError(f"Unsupported format '{ext}'.")

    size_mb = os.path.getsize(file_path) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise ValueError(f"File is {size_mb:.1f} MB — exceeds Groq's {MAX_FILE_SIZE_MB} MB limit.")

    print(f"   ✅ File OK — {size_mb:.1f} MB, format: {ext}")


def call_groq_with_retry(file_name: str, file_bytes: bytes, language: str | None) -> object:
    params = {
        "file": (file_name, file_bytes),
        "model": "whisper-large-v3",
        "response_format": "verbose_json",
        "timestamp_granularities": ["segment", "word"],
    }

    if language:
        params["language"] = language
        print(f"   🌐 Language hint: {language}")
    else:
        print("   🌐 Language: auto-detect (multilingual mode)")

    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            print(f"   ⏳ Attempt {attempt}/{MAX_RETRIES}...")
            result = client.audio.transcriptions.create(**params)
            print("   ✅ Groq responded successfully.")
            return result

        except Exception as e:
            last_error = e
            err_str = str(e).lower()

            if any(x in err_str for x in ["invalid_api_key", "authentication", "unsupported"]):
                print(f"   ❌ Fatal error (no retry): {e}")
                raise

            print(f"   ⚠️  Attempt {attempt} failed: {e}")
            if attempt < MAX_RETRIES:
                wait = RETRY_DELAY_SEC * (2 ** (attempt - 1))
                print(f"   🔄 Retrying in {wait}s...")
                time.sleep(wait)

    raise RuntimeError(f"Groq API failed after {MAX_RETRIES} attempts. Last error: {last_error}")


def parse_segments(transcription) -> list[dict]:
    segments = []

    for chunk in transcription.segments:
        # 🔴 FIXED: Reading the chunk as a Dictionary instead of an Object!
        start = chunk["start"]
        end   = chunk["end"]
        text  = chunk["text"].strip()

        if not text:
            continue 

        print(f"   [{start:.2f}s → {end:.2f}s]  {text}")
        segments.append({
            "start": start,
            "end":   end,
            "text":  text,
        })

    return segments


def parse_words(transcription) -> list[dict]:
    words = []
    raw_words = getattr(transcription, "words", None)
    if not raw_words:
        return words

    for w in raw_words:
        # 🔴 FIXED: Reading the words as a Dictionary!
        words.append({
            "word":  w["word"].strip(),
            "start": w["start"],
            "end":   w["end"],
        })
    return words


# ─── Main Entry Point ─────────────────────────────────────────────────────────

def transcribe_audio(file_path: str, language: str | None = None) -> dict:
    print(f"\n📂 File: {file_path}")
    validate_file(file_path)

    lang_code = None
    if language:
        lang_code = LANGUAGE_HINTS.get(language.lower(), language.lower())

    print("   📖 Reading file into memory...")
    with open(file_path, "rb") as f:
        file_bytes = f.read()

    file_name = os.path.basename(file_path)

    print("   📡 Sending to Groq Whisper Large-V3...")
    transcription = call_groq_with_retry(file_name, file_bytes, lang_code)

    print("\n   📝 Parsing segments...")
    segments = parse_segments(transcription)
    words    = parse_words(transcription)

    # Groq sometimes returns a dict or an object depending on the SDK version, so we check safely
    if isinstance(transcription, dict):
        detected_language = transcription.get("language", language or "unknown")
        duration          = transcription.get("duration", 0.0)
    else:
        detected_language = getattr(transcription, "language", language or "unknown")
        duration          = getattr(transcription, "duration", 0.0)
        
    full_text = " ".join(s["text"] for s in segments)

    print(f"\n   ✅ Done!")
    print(f"   🌐 Detected language : {detected_language}")
    print(f"   ⏱  Duration          : {duration:.1f}s")
    print(f"   📊 Segments          : {len(segments)}")
    print(f"   📊 Words             : {len(words)}")

    return {
        "segments": segments,
        "words":    words,
        "language": detected_language,
        "duration": round(float(duration), 2),
        "text":     full_text,
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python Engine.py <audio_file> [language_code]")
        sys.exit(1)

    audio_file    = sys.argv[1]
    lang_override = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        result = transcribe_audio(audio_file, language=lang_override)
        print("\n─── Full Transcript ─────────────────────────────────────────")
        print(result["text"])
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)
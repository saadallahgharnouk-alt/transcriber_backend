# Echo — Transcriber Frontend

A high-end React UI for the FastAPI Whisper transcriber backend.

## Stack

- Vite 5 + React 18
- Tailwind CSS v4 (config via `@theme` in CSS, no `tailwind.config.js`)
- Framer Motion for micro-interactions
- @studio-freight/react-lenis for smooth scroll
- lucide-react for iconography
- axios for the API client

## Run

```bash
# from repo root, in one terminal:
uvicorn main:app --reload   # starts FastAPI on :8000

# in another terminal:
cd frontend
npm install
npm run dev                 # starts Vite on :5173
```

Visit http://localhost:5173.

## Configure

Copy `.env.example` to `.env` if your backend isn't on `http://localhost:8000`:

```
VITE_API_BASE=http://your-backend
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built bundle locally
```

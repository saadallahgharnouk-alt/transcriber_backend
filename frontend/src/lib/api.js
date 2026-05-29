import axios from 'axios'

const API_BASE =
  import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 5 * 60 * 1000, // 5 min — Whisper can take a bit
})

export async function transcribeFile(file, language = 'auto', onProgress) {
  const form = new FormData()
  form.append('file', file)
  form.append('language', language)

  const { data } = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
  return data
}

export async function checkHealth() {
  try {
    const { data } = await api.get('/health', { timeout: 3000 })
    return data?.status === 'healthy'
  } catch {
    return false
  }
}

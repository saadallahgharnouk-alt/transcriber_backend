import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00'
  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export function formatTimestampSRT(seconds) {
  const ms = Math.round(seconds * 1000)
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const millis = ms % 1000
  const pad = (n, len = 2) => String(n).padStart(len, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(millis, 3)}`
}

export function formatTimestampVTT(seconds) {
  return formatTimestampSRT(seconds).replace(',', '.')
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

export function downloadBlob(content, filename, mime = 'text/plain') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function buildSRT(segments) {
  return segments
    .map((seg, i) => {
      return `${i + 1}\n${formatTimestampSRT(seg.start)} --> ${formatTimestampSRT(
        seg.end
      )}\n${seg.text.trim()}\n`
    })
    .join('\n')
}

export function buildVTT(segments) {
  const body = segments
    .map((seg) => {
      return `${formatTimestampVTT(seg.start)} --> ${formatTimestampVTT(
        seg.end
      )}\n${seg.text.trim()}\n`
    })
    .join('\n')
  return `WEBVTT\n\n${body}`
}

export const LANGUAGES = [
  { code: 'auto', label: 'Auto', flag: 'AUTO' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'fr', label: 'French', flag: 'FR' },
  { code: 'ar', label: 'Arabic', flag: 'AR' },
  { code: 'es', label: 'Spanish', flag: 'ES' },
  { code: 'de', label: 'German', flag: 'DE' },
  { code: 'it', label: 'Italian', flag: 'IT' },
  { code: 'pt', label: 'Portuguese', flag: 'PT' },
  { code: 'ja', label: 'Japanese', flag: 'JA' },
  { code: 'zh', label: 'Chinese', flag: 'ZH' },
]

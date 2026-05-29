import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileAudio, FileVideo, X, CheckCircle2 } from 'lucide-react'
import { cn, formatBytes } from '../lib/utils'

const ACCEPTED = '.mp3,.mp4,.wav,.m4a,.webm,.mov,.ogg,.flac'
const MAX_BYTES = 25 * 1024 * 1024 // 25 MB Groq limit

export default function Dropzone({ file, onFile, disabled }) {
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (fileList) => {
      setError(null)
      const f = fileList?.[0]
      if (!f) return
      if (f.size > MAX_BYTES) {
        setError(`File is ${formatBytes(f.size)} — must be under 25 MB.`)
        return
      }
      const ext = '.' + f.name.split('.').pop().toLowerCase()
      if (!ACCEPTED.split(',').includes(ext)) {
        setError(`Format ${ext} isn't supported.`)
        return
      }
      onFile(f)
    },
    [onFile]
  )

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  const onDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setDrag(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDrag(false)
  }

  const isVideo = file && /\.(mp4|webm|mov|mkv)$/i.test(file.name)

  return (
    <div className="space-y-3">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && !file && inputRef.current?.click()}
        className={cn(
          'relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden',
          'bg-white/[0.02] hover:bg-white/[0.04]',
          drag
            ? 'border-purple-400/80 bg-purple-500/10 scale-[1.01]'
            : 'border-white/10 hover:border-white/20',
          file && 'cursor-default border-emerald-400/30 bg-emerald-400/[0.04]',
          disabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 py-14 sm:py-16 text-center"
            >
              <motion.div
                animate={drag ? { y: -6, scale: 1.05 } : { y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mx-auto w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-purple-500/30 to-cyan-400/30 border border-white/10 flex items-center justify-center"
              >
                <UploadCloud className="w-7 h-7 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white">
                {drag ? 'Drop it like it\'s hot' : 'Drop audio or video here'}
              </h3>
              <p className="mt-1 text-sm text-ink-200/70">
                or{' '}
                <span className="text-purple-300 underline-offset-4 hover:underline">
                  click to browse
                </span>
                {' '}— up to 25 MB
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-1.5 text-[11px] font-mono text-ink-200/60">
                {['MP3', 'MP4', 'WAV', 'M4A', 'WEBM', 'MOV', 'OGG', 'FLAC'].map(
                  (t) => (
                    <span key={t} className="chip !text-[10px] !py-0.5">
                      {t}
                    </span>
                  )
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 sm:p-6 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-cyan-400/30 border border-emerald-400/20 flex items-center justify-center shrink-0">
                {isVideo ? (
                  <FileVideo className="w-6 h-6 text-emerald-300" />
                ) : (
                  <FileAudio className="w-6 h-6 text-emerald-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="font-medium text-white truncate">{file.name}</p>
                </div>
                <p className="mt-1 text-sm text-ink-200/70 font-mono">
                  {formatBytes(file.size)}
                </p>
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFile(null)
                    setError(null)
                  }}
                  className="btn-ghost !p-2"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag highlight overlay */}
        <AnimatePresence>
          {drag && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none rounded-3xl ring-2 ring-purple-400/60 shadow-[0_0_60px_rgba(168,85,247,0.4)_inset]"
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm text-rose-300 bg-rose-500/10 border border-rose-400/20 rounded-xl px-4 py-2.5"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

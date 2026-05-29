import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Clock,
  Globe2,
  FileText,
  Hash,
  Layers,
  BarChart3,
  Languages,
  ChevronDown,
} from 'lucide-react'
import MediaPlayer from './MediaPlayer'
import {
  cn,
  formatTime,
  buildSRT,
  buildVTT,
  downloadBlob,
  formatBytes,
} from '../lib/utils'

const TABS = [
  { id: 'transcript', label: 'Transcript', icon: FileText },
  { id: 'segments', label: 'Segments', icon: Layers },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
]

export default function TranscriptionResult({ result, file, onReset }) {
  const [tab, setTab] = useState('transcript')
  const [copied, setCopied] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const segmentRefs = useRef({})
  const segmentsContainerRef = useRef(null)

  const fileURL = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => fileURL && URL.revokeObjectURL(fileURL), [fileURL])

  const isVideo = file && /\.(mp4|webm|mov|mkv)$/i.test(file.name)

  const activeIdx = useMemo(() => {
    if (!result.segments?.length) return -1
    return result.segments.findIndex(
      (s) => currentTime >= s.start && currentTime < s.end
    )
  }, [currentTime, result.segments])

  // Auto-scroll active segment into view
  useEffect(() => {
    if (activeIdx < 0 || tab !== 'segments') return
    const node = segmentRefs.current[activeIdx]
    const container = segmentsContainerRef.current
    if (node && container) {
      const nodeTop = node.offsetTop
      const nodeHeight = node.offsetHeight
      const containerHeight = container.clientHeight
      container.scrollTo({
        top: nodeTop - containerHeight / 2 + nodeHeight / 2,
        behavior: 'smooth',
      })
    }
  }, [activeIdx, tab])

  const copyText = () => {
    navigator.clipboard.writeText(result.text || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const baseName = (file?.name || 'transcript').replace(/\.[^.]+$/, '')

  const exports = [
    {
      label: 'Plain text (.txt)',
      ext: 'txt',
      mime: 'text/plain',
      build: () => result.text || '',
    },
    {
      label: 'Subtitles (.srt)',
      ext: 'srt',
      mime: 'application/x-subrip',
      build: () => buildSRT(result.segments || []),
    },
    {
      label: 'WebVTT (.vtt)',
      ext: 'vtt',
      mime: 'text/vtt',
      build: () => buildVTT(result.segments || []),
    },
    {
      label: 'JSON (.json)',
      ext: 'json',
      mime: 'application/json',
      build: () => JSON.stringify(result, null, 2),
    },
  ]

  const handleExport = (item) => {
    downloadBlob(item.build(), `${baseName}.${item.ext}`, item.mime)
    setExportOpen(false)
  }

  const seekTo = (time) => {
    const player =
      document.querySelector('audio') || document.querySelector('video')
    if (player) {
      player.currentTime = time
      player.play()
    }
  }

  const wordsCount = result.text?.split(/\s+/).filter(Boolean).length ?? 0
  const wpm = result.duration
    ? Math.round((wordsCount / result.duration) * 60)
    : 0

  return (
    <div className="space-y-5">
      {/* Top meta + actions */}
      <div className="glass-strong rounded-3xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
            <Check className="w-3.5 h-3.5" /> Transcription complete
          </span>
          <span className="chip">
            <Globe2 className="w-3 h-3" />
            {result.language?.toUpperCase() || 'AUTO'}
          </span>
          <span className="chip">
            <Clock className="w-3 h-3" />
            {formatTime(result.duration)}
          </span>
          <span className="chip">
            <Hash className="w-3 h-3" />
            {result.segments?.length || 0} segments
          </span>
          {result.processing_time && (
            <span className="chip">
              {result.processing_time}s processing
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={onReset}
              className="btn-ghost text-sm"
              type="button"
            >
              <RotateCcw className="w-4 h-4" />
              New file
            </button>
          </div>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-white truncate">
          {file?.name || 'transcript'}
        </h3>
        <p className="text-xs text-ink-200/60 font-mono">
          {file ? formatBytes(file.size) : ''}
        </p>
      </div>

      {/* Player */}
      {fileURL && (
        <MediaPlayer
          src={fileURL}
          isVideo={isVideo}
          duration={result.duration}
          onTimeUpdate={setCurrentTime}
        />
      )}

      {/* Tabs + content */}
      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="flex items-center justify-between px-5 sm:px-6 pt-4 gap-3 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
            {TABS.map((t) => {
              const active = tab === t.id
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className="relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 shadow-md shadow-purple-500/30"
                    />
                  )}
                  <span
                    className={cn(
                      'relative flex items-center gap-1.5',
                      active ? 'text-white' : 'text-ink-200 hover:text-white'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {t.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyText}
              className="btn-ghost text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setExportOpen((v) => !v)}
                className="btn-primary !py-2 !px-4 text-sm"
              >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 transition-transform',
                    exportOpen && 'rotate-180'
                  )}
                />
              </button>
              <AnimatePresence>
                {exportOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setExportOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-strong p-1.5 z-50 shadow-2xl shadow-purple-950/30"
                    >
                      {exports.map((item) => (
                        <button
                          key={item.ext}
                          type="button"
                          onClick={() => handleExport(item)}
                          className="w-full text-left px-3 py-2 rounded-xl text-sm text-ink-100 hover:bg-white/10 transition flex items-center justify-between"
                        >
                          <span>{item.label}</span>
                          <Download className="w-3 h-3 opacity-50" />
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <AnimatePresence mode="wait">
            {tab === 'transcript' && (
              <motion.div
                key="transcript"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="max-h-[60vh] overflow-y-auto rounded-2xl bg-black/20 border border-white/5 p-5 sm:p-6"
              >
                <p className="text-base sm:text-lg leading-relaxed text-ink-100 whitespace-pre-wrap">
                  {result.text || 'No transcript text returned.'}
                </p>
              </motion.div>
            )}

            {tab === 'segments' && (
              <motion.div
                key="segments"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                ref={segmentsContainerRef}
                className="max-h-[60vh] overflow-y-auto rounded-2xl bg-black/20 border border-white/5 p-3 sm:p-4 space-y-1"
              >
                {(result.segments || []).map((seg, i) => {
                  const active = i === activeIdx
                  return (
                    <button
                      key={i}
                      ref={(el) => (segmentRefs.current[i] = el)}
                      type="button"
                      onClick={() => seekTo(seg.start)}
                      className={cn(
                        'w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all group',
                        active
                          ? 'bg-gradient-to-r from-purple-500/20 to-cyan-400/10 border border-purple-400/30'
                          : 'hover:bg-white/5 border border-transparent'
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0 font-mono text-[11px] mt-0.5 px-2 py-1 rounded-md',
                          active
                            ? 'bg-purple-500/30 text-purple-100'
                            : 'bg-white/5 text-ink-200/70 group-hover:bg-white/10'
                        )}
                      >
                        {formatTime(seg.start)}
                      </span>
                      <span
                        className={cn(
                          'text-sm sm:text-base leading-relaxed',
                          active ? 'text-white' : 'text-ink-100/90'
                        )}
                      >
                        {seg.text}
                      </span>
                    </button>
                  )
                })}
                {!(result.segments || []).length && (
                  <p className="text-center text-sm text-ink-200/60 py-8">
                    No segment data returned for this file.
                  </p>
                )}
              </motion.div>
            )}

            {tab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              >
                <StatCard
                  label="Duration"
                  value={formatTime(result.duration)}
                  icon={<Clock className="w-4 h-4" />}
                />
                <StatCard
                  label="Words"
                  value={wordsCount.toLocaleString()}
                  icon={<FileText className="w-4 h-4" />}
                />
                <StatCard
                  label="Speaking rate"
                  value={`${wpm} wpm`}
                  icon={<BarChart3 className="w-4 h-4" />}
                />
                <StatCard
                  label="Language"
                  value={(result.language || 'auto').toUpperCase()}
                  icon={<Languages className="w-4 h-4" />}
                />
                <StatCard
                  label="Segments"
                  value={result.segments?.length || 0}
                  icon={<Layers className="w-4 h-4" />}
                />
                <StatCard
                  label="Processing time"
                  value={
                    result.processing_time
                      ? `${result.processing_time}s`
                      : '—'
                  }
                  icon={<Hash className="w-4 h-4" />}
                />
                <StatCard
                  label="Realtime factor"
                  value={
                    result.processing_time && result.duration
                      ? `${(result.duration / result.processing_time).toFixed(1)}x`
                      : '—'
                  }
                  icon={<BarChart3 className="w-4 h-4" />}
                />
                <StatCard
                  label="Avg words/segment"
                  value={
                    result.segments?.length
                      ? Math.round(wordsCount / result.segments.length)
                      : 0
                  }
                  icon={<Layers className="w-4 h-4" />}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl glass p-4 flex items-start gap-3">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-ink-200/60 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg font-semibold text-white truncate font-mono">
          {value}
        </p>
      </div>
    </div>
  )
}

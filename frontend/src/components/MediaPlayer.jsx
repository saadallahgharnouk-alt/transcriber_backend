import { forwardRef, useEffect, useRef, useState } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { formatTime, cn } from '../lib/utils'

const MediaPlayer = forwardRef(function MediaPlayer(
  { src, isVideo, duration, onTimeUpdate },
  ref
) {
  const internalRef = useRef(null)
  const mediaRef = ref ?? internalRef
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [actualDuration, setActualDuration] = useState(duration || 0)

  useEffect(() => {
    const el = mediaRef.current
    if (!el) return
    const handleTime = () => {
      setCurrent(el.currentTime)
      onTimeUpdate?.(el.currentTime)
    }
    const handlePlay = () => setPlaying(true)
    const handlePause = () => setPlaying(false)
    const handleLoaded = () =>
      setActualDuration(Number.isFinite(el.duration) ? el.duration : duration)

    el.addEventListener('timeupdate', handleTime)
    el.addEventListener('play', handlePlay)
    el.addEventListener('pause', handlePause)
    el.addEventListener('loadedmetadata', handleLoaded)
    return () => {
      el.removeEventListener('timeupdate', handleTime)
      el.removeEventListener('play', handlePlay)
      el.removeEventListener('pause', handlePause)
      el.removeEventListener('loadedmetadata', handleLoaded)
    }
  }, [mediaRef, duration, onTimeUpdate])

  const toggle = () => {
    const el = mediaRef.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }

  const toggleMute = () => {
    const el = mediaRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }

  const seek = (e) => {
    const el = mediaRef.current
    if (!el || !actualDuration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    el.currentTime = pct * actualDuration
  }

  const pct = actualDuration ? (current / actualDuration) * 100 : 0

  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-4">
      {isVideo ? (
        <video
          ref={mediaRef}
          src={src}
          className="hidden"
          preload="metadata"
        />
      ) : (
        <audio ref={mediaRef} src={src} preload="metadata" className="hidden" />
      )}

      <button
        type="button"
        onClick={toggle}
        className={cn(
          'w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all',
          'bg-gradient-to-br from-purple-500 to-cyan-400 text-white shadow-lg shadow-purple-500/30',
          'hover:scale-105 active:scale-95'
        )}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          onClick={seek}
          className="group relative h-1.5 rounded-full bg-white/10 cursor-pointer overflow-hidden"
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-400 to-cyan-300 rounded-full transition-[width] duration-100"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${pct}% - 6px)` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-mono text-ink-200/70">
          <span>{formatTime(current)}</span>
          <span>{formatTime(actualDuration)}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        className="btn-ghost !p-2 shrink-0"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    </div>
  )
})

export default MediaPlayer

import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import {
  Play,
  Pause,
  Sparkles,
  Globe2,
  Clock,
  FileAudio,
  Check,
} from 'lucide-react'
import Logo from './Logo'

const DEMO_SEGMENTS = [
  { time: '00:02', text: 'So the way we approached this was honestly unconventional —' },
  { time: '00:08', text: 'we wanted the transcript to feel alive, not static.' },
  { time: '00:14', text: 'Click any line, the player jumps. Zero scrubbing.' },
  { time: '00:20', text: 'That detail changed how the whole team works.' },
  { time: '00:27', text: 'Now editing a 90-minute episode takes us 12 minutes flat.' },
]

/**
 * iPad-style mockup with mouse-tracked 3D tilt + a self-playing demo loop
 * inside the screen.
 */
export default function DeviceMockup({ scale = 1 }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const spring = { stiffness: 180, damping: 22, mass: 0.6 }
  const sx = useSpring(mx, spring)
  const sy = useSpring(my, spring)

  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14])
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10])

  const glareX = useTransform(sx, [-0.5, 0.5], ['10%', '90%'])
  const glareY = useTransform(sy, [-0.5, 0.5], ['10%', '90%'])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18), transparent 50%)`

  const onMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mx.set(x)
    my.set(y)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative w-full max-w-[640px] mx-auto"
      style={{ perspective: '1400px', transform: `scale(${scale})` }}
    >
      <div className="pointer-events-none absolute inset-x-8 -bottom-10 h-24 rounded-full bg-[var(--brand-1)] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-16 -bottom-6 h-16 rounded-full bg-[var(--brand-3)] opacity-30 blur-2xl" />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative will-change-transform animate-float"
      >
        <div
          className="relative rounded-[2.4rem] p-3 sm:p-3.5"
          style={{
            background:
              'linear-gradient(140deg, #1a1530 0%, #0a0118 40%, #1a1530 100%)',
            boxShadow:
              '0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/10 ring-1 ring-white/5" />

          <div
            className="relative aspect-[16/10.5] rounded-[1.6rem] overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at top, #1a0b3a 0%, #06010f 60%)',
            }}
          >
            <ScreenContent />

            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ background: glare, mixBlendMode: 'plus-lighter' }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
          </div>
        </div>

        <motion.div
          style={{ translateZ: 60 }}
          className="absolute -right-3 sm:-right-6 top-12 hidden sm:flex items-center gap-1.5 chip border-emerald-400/30 bg-emerald-400/10 text-emerald-200 shadow-xl shadow-emerald-500/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
          live preview
        </motion.div>

        <motion.div
          style={{ translateZ: 60 }}
          className="absolute -left-3 sm:-left-8 bottom-12 hidden sm:flex items-center gap-1.5 chip border-[var(--brand-1)]/30 bg-[var(--brand-1)]/10 text-purple-100 shadow-xl"
        >
          <Sparkles className="w-3 h-3" />
          drag, drop, done
        </motion.div>
      </motion.div>
    </div>
  )
}

function ScreenContent() {
  // Looping demo state
  const [activeIdx, setActiveIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [progress, setProgress] = useState(8)

  const fullText = DEMO_SEGMENTS[activeIdx].text

  // Type out the active segment, char by char
  useEffect(() => {
    setTyped('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(fullText.slice(0, i))
      if (i >= fullText.length) clearInterval(interval)
    }, 28)
    return () => clearInterval(interval)
  }, [activeIdx, fullText])

  // Cycle to next segment every ~4.5s
  useEffect(() => {
    const t = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % DEMO_SEGMENTS.length)
    }, 4500)
    return () => clearTimeout(t)
  }, [activeIdx])

  // Smooth progress bar that resets each cycle
  useEffect(() => {
    setProgress(8)
    const start = Date.now()
    const id = setInterval(() => {
      const t = (Date.now() - start) / 4500 // 0..1 over the cycle
      setProgress(Math.min(8 + t * 80, 88))
    }, 60)
    return () => clearInterval(id)
  }, [activeIdx])

  // Show 3 segments at a time: prev, active, next
  const visible = [
    DEMO_SEGMENTS[(activeIdx - 1 + DEMO_SEGMENTS.length) % DEMO_SEGMENTS.length],
    DEMO_SEGMENTS[activeIdx],
    DEMO_SEGMENTS[(activeIdx + 1) % DEMO_SEGMENTS.length],
  ]

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <div className="scale-75 origin-left">
          <Logo size={22} />
        </div>
        <span className="chip !text-[9px] !py-0.5 !px-2">
          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse-soft" />
          online
        </span>
      </div>

      <div className="px-4 pt-3 pb-2.5">
        <p className="text-[9px] font-mono uppercase tracking-widest text-[var(--brand-1)]/80">
          Whisper Large-V3 · Groq
        </p>
        <h4 className="mt-1 text-base sm:text-lg font-bold leading-tight">
          <span className="text-gradient">Audio to text,</span>
          <br />
          <span className="text-white">beautifully fast.</span>
        </h4>
      </div>

      <div className="flex-1 grid grid-cols-5 gap-2 px-4 pb-3 min-h-0">
        {/* Left: file card with live progress */}
        <div className="col-span-2 glass rounded-xl p-2.5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/40 to-cyan-400/40 border border-emerald-400/20 flex items-center justify-center">
              <FileAudio className="w-3.5 h-3.5 text-emerald-200" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-white truncate">
                interview-final.mp3
              </p>
              <p className="text-[8px] font-mono text-ink-200/60">4.7 MB</p>
            </div>
          </div>

          {/* Animated wave */}
          <div className="flex items-end h-7 gap-[2px]">
            {Array.from({ length: 28 }).map((_, i) => {
              const isPast = (i / 28) * 100 < progress
              return (
                <span
                  key={i}
                  className="flex-1 rounded-sm bg-brand-grad"
                  style={{
                    height: `${20 + ((i * 37) % 80)}%`,
                    opacity: isPast ? 1 : 0.3,
                    transition: 'opacity 0.4s',
                  }}
                />
              )
            })}
          </div>

          <div className="flex items-center gap-1.5 mt-auto">
            <span className="w-7 h-7 rounded-full flex items-center justify-center bg-brand-grad text-white shadow-md">
              <Pause className="w-3 h-3 fill-current" />
            </span>
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--brand-1)] to-[var(--brand-3)] transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[8px] font-mono text-ink-200/70">
              {DEMO_SEGMENTS[activeIdx].time}
            </span>
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <span className="chip !text-[8px] !py-0 !px-1.5 border-emerald-400/30 bg-emerald-400/10 text-emerald-200">
              <Check className="w-2 h-2" />
              done
            </span>
            <span className="chip !text-[8px] !py-0 !px-1.5">
              <Globe2 className="w-2 h-2" />
              EN
            </span>
            <span className="chip !text-[8px] !py-0 !px-1.5">
              <Clock className="w-2 h-2" />
              03:48
            </span>
          </div>
        </div>

        {/* Right: transcript panel with cycling segments */}
        <div className="col-span-3 glass rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-medium text-white">Transcript</p>
            <div className="flex gap-0.5">
              {DEMO_SEGMENTS.map((_, i) => (
                <span
                  key={i}
                  className={`w-1 h-1 rounded-full transition-all ${
                    i === activeIdx
                      ? 'bg-[var(--brand-1)] w-3'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          <Segment time={visible[0].time} text={visible[0].text} muted />
          <Segment
            time={visible[1].time}
            text={typed}
            active
            showCursor={typed.length < fullText.length}
          />
          <Segment time={visible[2].time} text={visible[2].text} muted />
        </div>
      </div>
    </div>
  )
}

function Segment({ time, text, active, muted, showCursor }) {
  return (
    <div
      className={`flex items-start gap-1.5 p-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-gradient-to-r from-[var(--brand-1)]/25 to-[var(--brand-3)]/15 border border-[var(--brand-1)]/30'
          : 'border border-transparent'
      } ${muted ? 'opacity-50' : ''}`}
    >
      <span
        className={`shrink-0 font-mono text-[8px] mt-0.5 px-1 py-px rounded ${
          active
            ? 'bg-[var(--brand-1)]/40 text-purple-100'
            : 'bg-white/5 text-ink-200/70'
        }`}
      >
        {time}
      </span>
      <span
        className={`text-[10px] leading-snug ${
          active ? 'text-white' : 'text-ink-100/85'
        }`}
      >
        {text}
        {showCursor && (
          <span className="inline-block w-[1px] h-[10px] align-middle bg-white ml-0.5 animate-blink" />
        )}
      </span>
    </div>
  )
}

import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion'
import {
  Play,
  Sparkles,
  Globe2,
  Clock,
  FileAudio,
  Check,
} from 'lucide-react'
import Logo from './Logo'

/**
 * iPad-style mockup with mouse-tracked 3D tilt and a glare highlight.
 * Contains a stylized live preview of the transcriber UI inside the screen.
 */
export default function DeviceMockup() {
  const ref = useRef(null)

  // Raw mouse position normalized to [-0.5, 0.5]
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  // Smooth springs so the tilt doesn't feel twitchy
  const spring = { stiffness: 180, damping: 22, mass: 0.6 }
  const sx = useSpring(mx, spring)
  const sy = useSpring(my, spring)

  // Tilt up to ±14deg
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14])
  const rotateX = useTransform(sy, [-0.5, 0.5], [10, -10])

  // Glare position
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
      style={{ perspective: '1400px' }}
    >
      {/* Soft ambient glow under the device */}
      <div className="pointer-events-none absolute inset-x-8 -bottom-10 h-24 rounded-full bg-purple-500/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-16 -bottom-6 h-16 rounded-full bg-cyan-400/30 blur-2xl" />

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative will-change-transform animate-float"
      >
        {/* iPad bezel */}
        <div
          className="relative rounded-[2.4rem] p-3 sm:p-3.5"
          style={{
            background:
              'linear-gradient(140deg, #1a1530 0%, #0a0118 40%, #1a1530 100%)',
            boxShadow:
              '0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Subtle top notch / camera dot */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/10 ring-1 ring-white/5" />

          {/* Screen */}
          <div
            className="relative aspect-[16/10.5] rounded-[1.6rem] overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at top, #1a0b3a 0%, #06010f 60%)',
            }}
          >
            {/* Inner screen content */}
            <ScreenContent />

            {/* Reflective glare that follows the cursor */}
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ background: glare, mixBlendMode: 'plus-lighter' }}
            />

            {/* Subtle vertical light streak */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />
          </div>
        </div>

        {/* Floating annotation chips */}
        <motion.div
          style={{ translateZ: 60 }}
          className="absolute -right-3 sm:-right-6 top-12 hidden sm:flex items-center gap-1.5 chip border-emerald-400/30 bg-emerald-400/10 text-emerald-200 shadow-xl shadow-emerald-500/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
          live preview
        </motion.div>

        <motion.div
          style={{ translateZ: 60 }}
          className="absolute -left-3 sm:-left-8 bottom-12 hidden sm:flex items-center gap-1.5 chip border-purple-400/30 bg-purple-400/10 text-purple-100 shadow-xl shadow-purple-500/20"
        >
          <Sparkles className="w-3 h-3" />
          drag, drop, done
        </motion.div>
      </motion.div>
    </div>
  )
}

function ScreenContent() {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Top nav bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <div className="scale-75 origin-left">
          <Logo size={22} />
        </div>
        <span className="chip !text-[9px] !py-0.5 !px-2">
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
          online
        </span>
      </div>

      {/* Hero strip */}
      <div className="px-4 pt-3 pb-2.5">
        <p className="text-[9px] font-mono uppercase tracking-widest text-purple-300/80">
          Whisper Large-V3 · Groq
        </p>
        <h4 className="mt-1 text-base sm:text-lg font-bold leading-tight">
          <span className="text-gradient">Audio to text,</span>
          <br />
          <span className="text-white">beautifully fast.</span>
        </h4>
      </div>

      {/* Body grid: file card + transcript preview */}
      <div className="flex-1 grid grid-cols-5 gap-2 px-4 pb-3 min-h-0">
        {/* Left: completed-file card */}
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

          {/* Mini wave */}
          <div className="flex items-end h-7 gap-[2px]">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-purple-500/70 to-cyan-300/70"
                style={{
                  height: `${20 + ((i * 37) % 80)}%`,
                  opacity: i < 18 ? 1 : 0.35,
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 mt-auto">
            <span className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-cyan-400 text-white shadow-md shadow-purple-500/30">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </span>
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[58%] bg-gradient-to-r from-purple-400 to-cyan-300" />
            </div>
            <span className="text-[8px] font-mono text-ink-200/70">02:14</span>
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

        {/* Right: transcript preview */}
        <div className="col-span-3 glass rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-medium text-white">Transcript</p>
            <div className="flex gap-0.5">
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="w-1 h-1 rounded-full bg-white/20" />
            </div>
          </div>

          <Segment time="00:02" text="So the way we approached this was honestly unconventional —" />
          <Segment
            time="00:08"
            text="we wanted the transcript to feel alive, not static."
            active
          />
          <Segment time="00:14" text="Click any line, the player jumps. Zero scrubbing." />
          <Segment time="00:20" text="That detail changed how the whole team works." muted />
        </div>
      </div>
    </div>
  )
}

function Segment({ time, text, active, muted }) {
  return (
    <div
      className={`flex items-start gap-1.5 p-1.5 rounded-lg ${
        active
          ? 'bg-gradient-to-r from-purple-500/25 to-cyan-400/15 border border-purple-400/30'
          : 'border border-transparent'
      } ${muted ? 'opacity-50' : ''}`}
    >
      <span
        className={`shrink-0 font-mono text-[8px] mt-0.5 px-1 py-px rounded ${
          active ? 'bg-purple-500/40 text-purple-100' : 'bg-white/5 text-ink-200/70'
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
      </span>
    </div>
  )
}

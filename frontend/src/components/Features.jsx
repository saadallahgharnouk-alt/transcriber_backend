import { motion } from 'framer-motion'
import {
  Zap,
  Globe2,
  Lock,
  Wand2,
  FileDown,
  MousePointerClick,
  Brain,
  Type,
  Layers,
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
}

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="chip mb-4">
            <Wand2 className="w-3 h-3 text-[var(--brand-1)]" />
            Why people love it
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Built for{' '}
            <span className="text-gradient-mono">people who hit deadlines.</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-ink-200/70">
            Not just &ldquo;upload and wait.&rdquo; Every detail — from the first
            drag-over animation to the final SRT export — was designed to make
            transcription feel premium.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 sm:gap-5 auto-rows-[minmax(180px,auto)]">
          {/* Hero tile: speed (2x2) */}
          <BentoTile
            className="md:col-span-3 md:row-span-2"
            accent="from-amber-400 to-pink-500"
            icon={Zap}
            title="Lightning fast"
            body="A 5-minute clip transcribes in under 10 seconds on Groq's LPU. Watch the bars dance."
          >
            <SpeedViz />
          </BentoTile>

          {/* Languages (1x1 wide) */}
          <BentoTile
            className="md:col-span-3"
            accent="from-cyan-400 to-blue-500"
            icon={Globe2}
            title="99+ languages"
            body="Whisper Large-V3 speaks more languages than most diplomats. Auto-detect or hint manually."
          >
            <LanguagesViz />
          </BentoTile>

          {/* Accuracy (1x1) */}
          <BentoTile
            className="md:col-span-2"
            accent="from-purple-500 to-fuchsia-500"
            icon={Brain}
            title="State of the art"
            body="Robust against noise, accents, and side conversations."
          />

          {/* Click-to-seek (1x1) */}
          <BentoTile
            className="md:col-span-1"
            accent="from-emerald-400 to-cyan-400"
            icon={MousePointerClick}
            title="Click to seek"
            body="Tap a line, the player jumps."
            compact
          />

          {/* Word karaoke (1x1) */}
          <BentoTile
            className="md:col-span-3 md:row-span-2"
            accent="from-indigo-500 to-purple-500"
            icon={Type}
            title="Word-level karaoke"
            body="The transcript highlights each word as it's spoken — perfect for proofing or live captions."
          >
            <KaraokeViz />
          </BentoTile>

          {/* Exports (1x1 wide) */}
          <BentoTile
            className="md:col-span-3"
            accent="from-purple-500 to-cyan-400"
            icon={FileDown}
            title="Export anywhere"
            body="One click for plain text, SRT subtitles, WebVTT, or JSON."
          >
            <ExportsViz />
          </BentoTile>

          {/* Privacy (1x1) */}
          <BentoTile
            className="md:col-span-2"
            accent="from-rose-400 to-orange-500"
            icon={Lock}
            title="Nothing stored"
            body="Streamed in, transcribed, deleted. Zero retention."
          />

          {/* Stats (1x1) */}
          <BentoTile
            className="md:col-span-1"
            accent="from-amber-400 to-pink-500"
            icon={Layers}
            title="Rich data"
            body="Segments, words, timing — all in your JSON."
            compact
          />
        </div>
      </div>
    </section>
  )
}

function BentoTile({
  className = '',
  accent,
  icon: Icon,
  title,
  body,
  children,
  compact,
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ duration: 0.5 }}
      className={`group relative glass rounded-3xl p-6 overflow-hidden hover:bg-white/[0.06] transition-colors ${className}`}
    >
      <div
        className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-3xl group-hover:opacity-30 transition-opacity`}
      />

      <div className="relative flex flex-col h-full">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center mb-4 shadow-lg`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h3 className={`font-semibold text-white mb-1.5 ${compact ? 'text-base' : 'text-lg'}`}>
          {title}
        </h3>
        <p className={`text-ink-200/75 leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
          {body}
        </p>

        {children && <div className="mt-5 flex-1 relative">{children}</div>}
      </div>
    </motion.div>
  )
}

/* ------- Bento visualizations ------- */

function SpeedViz() {
  return (
    <div className="relative h-full min-h-[140px] flex items-end gap-1.5">
      {Array.from({ length: 32 }).map((_, i) => (
        <span
          key={i}
          className="flex-1 rounded-full bg-gradient-to-t from-amber-400 to-pink-500 wave-bar"
          style={{
            animationDelay: `${(i % 8) * 0.08}s`,
            animationDuration: `${1.2 + (i % 4) * 0.15}s`,
            opacity: 0.5 + ((i * 31) % 50) / 100,
          }}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-2 right-2 chip !text-[10px] !py-0.5 !px-2 border-amber-400/30 bg-amber-400/10 text-amber-200">
        216× realtime
      </div>
    </div>
  )
}

function LanguagesViz() {
  const langs = ['EN', 'FR', 'AR', 'ES', 'DE', 'JA', 'ZH', 'PT', 'IT', 'KO', 'NL', 'TR']
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {langs.map((l) => (
        <span
          key={l}
          className="font-mono text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-ink-100"
        >
          {l}
        </span>
      ))}
      <span className="font-mono text-[10px] px-2 py-1 rounded-md bg-cyan-500/15 border border-cyan-400/30 text-cyan-200">
        +87 more
      </span>
    </div>
  )
}

function KaraokeViz() {
  const words = [
    { w: 'we', a: false },
    { w: 'wanted', a: false },
    { w: 'the', a: false },
    { w: 'transcript', a: true },
    { w: 'to', a: false },
    { w: 'feel', a: false },
    { w: 'alive,', a: false },
    { w: 'not', a: false },
    { w: 'static.', a: false },
  ]
  return (
    <div className="rounded-2xl bg-black/30 border border-white/5 p-4 h-full flex flex-col justify-center">
      <p className="text-base sm:text-lg leading-relaxed">
        {words.map((w, i) => (
          <span
            key={i}
            className={
              w.a
                ? 'bg-[var(--brand-1)]/40 text-white px-1 rounded transition'
                : 'text-ink-100/70'
            }
          >
            {w.w}{' '}
          </span>
        ))}
      </p>
      <div className="mt-4 flex items-center gap-2">
        <span className="font-mono text-[10px] text-ink-200/60">00:08.4</span>
        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-[42%] bg-gradient-to-r from-[var(--brand-1)] to-[var(--brand-3)]" />
        </div>
        <span className="font-mono text-[10px] text-ink-200/60">03:48</span>
      </div>
    </div>
  )
}

function ExportsViz() {
  const formats = [
    { ext: 'TXT', tint: 'from-slate-400 to-slate-600' },
    { ext: 'SRT', tint: 'from-purple-400 to-purple-600' },
    { ext: 'VTT', tint: 'from-cyan-400 to-cyan-600' },
    { ext: 'JSON', tint: 'from-emerald-400 to-emerald-600' },
  ]
  return (
    <div className="grid grid-cols-4 gap-2">
      {formats.map((f) => (
        <div
          key={f.ext}
          className="rounded-xl bg-white/[0.03] border border-white/10 p-3 flex flex-col items-center gap-1.5 hover:bg-white/[0.06] transition"
        >
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.tint} flex items-center justify-center text-white text-[10px] font-bold shadow-lg`}
          >
            .{f.ext.toLowerCase()}
          </div>
          <span className="font-mono text-[10px] text-ink-200/70">{f.ext}</span>
        </div>
      ))}
    </div>
  )
}

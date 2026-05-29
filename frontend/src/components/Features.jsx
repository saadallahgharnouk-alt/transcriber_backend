import { motion } from 'framer-motion'
import {
  Zap,
  Globe2,
  Lock,
  Wand2,
  FileDown,
  Clock,
  MousePointerClick,
  Brain,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Lightning fast',
    body: 'A 5-minute clip transcribes in under 10 seconds on Groq\'s LPU. Watch the bars dance.',
    accent: 'from-amber-400 to-pink-500',
  },
  {
    icon: Globe2,
    title: '99+ languages',
    body: 'Whisper Large-V3 speaks more languages than most diplomats. Auto-detect or hint manually.',
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Brain,
    title: 'State-of-the-art accuracy',
    body: 'Built on the same model OpenAI uses internally. Robust against noise, accents, and side conversations.',
    accent: 'from-purple-500 to-fuchsia-500',
  },
  {
    icon: MousePointerClick,
    title: 'Click-to-seek segments',
    body: 'Tap any line in the transcript and the player jumps to that exact moment. No more scrubbing.',
    accent: 'from-emerald-400 to-cyan-400',
  },
  {
    icon: FileDown,
    title: 'Export anywhere',
    body: 'Download as plain text, SRT subtitles, WebVTT for web players, or JSON for your own pipeline.',
    accent: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Lock,
    title: 'Nothing stored',
    body: 'Your file is processed in memory and deleted the instant we\'re done. Zero retention, ever.',
    accent: 'from-rose-400 to-orange-500',
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="chip mb-4">
            <Wand2 className="w-3 h-3 text-purple-300" />
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group relative glass rounded-2xl p-6 overflow-hidden hover:bg-white/[0.06] transition-colors"
              >
                <div
                  className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${f.accent} opacity-15 blur-2xl group-hover:opacity-25 transition-opacity`}
                />
                <div
                  className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="relative text-lg font-semibold text-white mb-1.5">
                  {f.title}
                </h3>
                <p className="relative text-sm text-ink-200/75 leading-relaxed">
                  {f.body}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

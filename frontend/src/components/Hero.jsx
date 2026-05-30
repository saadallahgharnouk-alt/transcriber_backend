import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Globe2 } from 'lucide-react'
import DeviceMockup from './DeviceMockup'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 chip mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Powered by Whisper Large-V3 on Groq</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="text-emerald-300">216x realtime</span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.05 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.02]"
            >
              <span className="text-gradient">Audio to text,</span>
              <br />
              <span className="text-white">beautifully fast.</span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-ink-200/80 leading-relaxed"
            >
              Drop in a recording, podcast, lecture, or video. Get a clean,
              timestamped transcript in seconds — with click-to-seek segments
              and export to TXT, SRT, VTT, or JSON.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.25 }}
              className="mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-3"
            >
              <a href="#upload" className="btn-primary text-base">
                Start transcribing
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#features" className="btn-ghost text-base">
                See how it works
              </a>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.35 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto lg:mx-0"
            >
              <Stat
                icon={<Zap className="w-4 h-4" />}
                value="< 10s"
                label="for a 5-min clip"
              />
              <Stat
                icon={<Globe2 className="w-4 h-4" />}
                value="99+"
                label="languages supported"
              />
              <Stat
                icon={<Sparkles className="w-4 h-4" />}
                value="WER < 5%"
                label="on clean audio"
              />
            </motion.div>
          </div>

          {/* Right: 3D-tilt iPad mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-5"
          >
            <DeviceMockup />
          </motion.div>
        </div>
      </div>

      {/* Decorative orb behind everything */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full opacity-20 blur-3xl bg-[conic-gradient(from_0deg,_rgba(168,85,247,0.6),_rgba(6,182,212,0.4),_rgba(236,72,153,0.5),_rgba(168,85,247,0.6))] animate-spin-slow -z-10" />
    </section>
  )
}

function Stat({ icon, value, label }) {
  return (
    <div className="glass rounded-2xl px-5 py-4 flex items-center gap-3 justify-center lg:justify-start text-left">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-400/30 border border-white/10 flex items-center justify-center text-white shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-mono font-semibold text-white">{value}</div>
        <div className="text-xs text-ink-200/70">{label}</div>
      </div>
    </div>
  )
}

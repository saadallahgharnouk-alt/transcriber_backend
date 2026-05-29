import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const STAGES = [
  { id: 'upload', label: 'Uploading audio' },
  { id: 'process', label: 'Whisper Large-V3 listening' },
  { id: 'finalize', label: 'Polishing transcript' },
]

export default function ProcessingState({ stage = 'upload', progress = 0 }) {
  const stageIndex = STAGES.findIndex((s) => s.id === stage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-8 sm:p-10 text-center"
    >
      {/* Wave bars */}
      <div className="flex items-end justify-center h-12 mb-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="wave-bar"
            style={{
              animationDelay: `${i * 0.08}s`,
              height: `${24 + (i % 3) * 12}px`,
            }}
          />
        ))}
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-white">
        Working some magic
      </h3>
      <p className="mt-2 text-sm text-ink-200/70">
        Whisper Large-V3 is doing its thing. This usually takes a few seconds.
      </p>

      {/* Progress bar */}
      <div className="mt-7 max-w-md mx-auto">
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{
              width:
                stage === 'upload'
                  ? `${Math.max(5, progress)}%`
                  : stage === 'process'
                    ? '85%'
                    : '100%',
            }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="mt-5 flex items-center justify-between text-xs">
          {STAGES.map((s, i) => {
            const done = i < stageIndex
            const active = i === stageIndex
            return (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 ${
                  done
                    ? 'text-emerald-300'
                    : active
                      ? 'text-white'
                      : 'text-ink-200/40'
                }`}
              >
                {active ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      done ? 'bg-emerald-400' : 'bg-white/20'
                    }`}
                  />
                )}
                {s.label}
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

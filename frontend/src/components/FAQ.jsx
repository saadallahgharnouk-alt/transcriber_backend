import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

const QA = [
  {
    q: 'How big a file can I upload?',
    a: 'Up to 25 MB per request — the current limit imposed by Groq\'s Whisper endpoint. For longer recordings, split your file or compress to a lower bitrate (96 kbps mono is plenty for speech).',
  },
  {
    q: 'Which file types work?',
    a: 'MP3, MP4, WAV, M4A, WEBM, MOV, OGG, and FLAC. Video files are decoded server-side, so audio quality is what matters.',
  },
  {
    q: 'How accurate is it?',
    a: 'Whisper Large-V3 hits sub-5% word error rate on clean English audio and stays well-behaved on accents, code-switching, and noisy environments. Multilingual performance is class-leading.',
  },
  {
    q: 'Do you keep my files?',
    a: 'No. Your file is streamed to memory, transcribed, then deleted from the temp directory immediately. We never write it to long-term storage.',
  },
  {
    q: 'Why click-to-seek segments?',
    a: 'Because reviewing a transcript shouldn\'t mean scrubbing manually. Click a line, the player jumps. It\'s how transcript review should always have worked.',
  },
  {
    q: 'Can I self-host this?',
    a: 'Yes — the FastAPI backend and React frontend in this repo are everything you need. Bring your own GROQ_API_KEY in a .env file and you\'re set.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="chip mb-4">
            <HelpCircle className="w-3 h-3 text-purple-300" />
            FAQ
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Quick answers.
          </h2>
        </div>

        <div className="space-y-2.5">
          {QA.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.03] transition"
                >
                  <span className="font-medium text-white">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-ink-200 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-ink-200/80 leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

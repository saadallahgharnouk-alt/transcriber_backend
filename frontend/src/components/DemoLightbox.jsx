import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import DeviceMockup from './DeviceMockup'

export default function DemoLightbox({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Decorative glow */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[40rem] h-[40rem] rounded-full opacity-30 blur-3xl bg-[conic-gradient(from_0deg,_var(--brand-1),_var(--brand-3),_var(--brand-4),_var(--brand-1))] animate-spin-slow" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl"
          >
            <div className="text-center mb-6">
              <span className="chip mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                Live demo · self-playing
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold text-white">
                This is what your transcript looks like.
              </h3>
              <p className="mt-2 text-sm text-ink-200/70 max-w-md mx-auto">
                Move your mouse over the iPad to tilt it. The transcript inside
                cycles through real-feeling segments on its own.
              </p>
            </div>

            <DeviceMockup />

            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 sm:top-0 sm:right-0 w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-white/15 transition"
              aria-label="Close demo"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

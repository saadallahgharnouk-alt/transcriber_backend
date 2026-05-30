import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { cn } from '../lib/utils'

const THEMES = [
  { id: 'aurora', name: 'Aurora', swatch: ['#a855f7', '#6c5cff', '#06b6d4'] },
  { id: 'sunset', name: 'Sunset', swatch: ['#f59e0b', '#f97316', '#ec4899'] },
  { id: 'forest', name: 'Forest', swatch: ['#10b981', '#14b8a6', '#06b6d4'] },
  { id: 'ocean', name: 'Ocean', swatch: ['#06b6d4', '#3b82f6', '#6366f1'] },
  { id: 'synthwave', name: 'Synthwave', swatch: ['#ec4899', '#a855f7', '#3b82f6'] },
]

const STORAGE_KEY = 'echo:theme'

export default function ThemePicker() {
  const [theme, setTheme] = useState('aurora')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && THEMES.some((t) => t.id === saved)) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="absolute bottom-14 right-0 w-60 rounded-2xl glass-strong p-2 z-40 shadow-2xl shadow-black/50"
            >
              <p className="px-2.5 pt-1.5 pb-2 text-[10px] uppercase tracking-widest text-ink-200/60">
                Pick a vibe
              </p>
              <div className="space-y-1">
                {THEMES.map((t) => {
                  const active = t.id === theme
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id)
                        setOpen(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-all text-left',
                        active ? 'bg-white/10' : 'hover:bg-white/5'
                      )}
                    >
                      <div className="flex -space-x-1.5 shrink-0">
                        {t.swatch.map((c, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded-full ring-2 ring-[#0a0118]"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <span
                        className={cn(
                          'flex-1 text-sm',
                          active ? 'text-white font-medium' : 'text-ink-100'
                        )}
                      >
                        {t.name}
                      </span>
                      {active && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative w-12 h-12 rounded-full bg-brand-grad text-white shadow-2xl shadow-purple-950/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Change theme"
      >
        <Palette className="w-5 h-5" />
        <span
          className="absolute inset-0 rounded-full opacity-60 blur-md -z-10 bg-brand-grad"
          aria-hidden
        />
      </button>
    </div>
  )
}

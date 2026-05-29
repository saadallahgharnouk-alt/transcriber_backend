import { motion } from 'framer-motion'
import { LANGUAGES, cn } from '../lib/utils'

export default function LanguageSelector({ value, onChange, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {LANGUAGES.map((lang) => {
        const active = value === lang.code
        return (
          <button
            key={lang.code}
            type="button"
            disabled={disabled}
            onClick={() => onChange(lang.code)}
            className={cn(
              'relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              'border focus:outline-none focus:ring-2 focus:ring-purple-400/50',
              active
                ? 'border-transparent text-white'
                : 'border-white/10 bg-white/5 text-ink-200 hover:bg-white/10 hover:text-white',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-lg shadow-purple-500/30"
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <span className="font-mono text-[10px] opacity-80">{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

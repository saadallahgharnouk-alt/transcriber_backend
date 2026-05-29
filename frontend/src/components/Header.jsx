import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Sparkles } from 'lucide-react'
import Logo from './Logo'
import { cn } from '../lib/utils'

export default function Header({ healthy }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'py-3' : 'py-5'
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-6xl px-4 sm:px-6 transition-all duration-300',
          scrolled && 'sm:px-4'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300',
            scrolled
              ? 'glass-strong shadow-2xl shadow-purple-950/30'
              : 'bg-transparent'
          )}
        >
          <a href="#top" className="flex items-center">
            <Logo />
          </a>

          <nav className="hidden md:flex items-center gap-1 text-sm text-ink-200">
            <a
              href="#features"
              className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#upload"
              className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition"
            >
              Transcribe
            </a>
            <a
              href="#faq"
              className="px-3 py-1.5 rounded-full hover:bg-white/5 hover:text-white transition"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                'hidden sm:flex chip transition-colors',
                healthy
                  ? 'border-emerald-400/30 text-emerald-300 bg-emerald-400/5'
                  : 'border-rose-400/30 text-rose-300 bg-rose-400/5'
              )}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  healthy ? 'bg-emerald-400' : 'bg-rose-400'
                )}
              />
              {healthy ? 'API online' : 'API offline'}
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost !p-2"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a href="#upload" className="btn-primary !py-2 !px-4 text-sm">
              <Sparkles className="w-4 h-4" />
              Try free
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

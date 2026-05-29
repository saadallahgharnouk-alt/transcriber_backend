import { Heart } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-10 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <Logo />
          <p className="text-xs text-ink-200/60 flex items-center gap-1.5">
            Built with
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
            using Whisper Large-V3 on Groq
          </p>
          <div className="flex items-center gap-4 text-xs text-ink-200/60">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#faq" className="hover:text-white transition">
              FAQ
            </a>
            <a href="#upload" className="hover:text-white transition">
              Try it
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

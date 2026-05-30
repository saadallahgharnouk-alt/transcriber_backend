import {
  Mic,
  GraduationCap,
  Newspaper,
  Headphones,
  Video,
  Briefcase,
  Scale,
  Stethoscope,
} from 'lucide-react'

const ITEMS = [
  { icon: Mic, label: 'Podcast editors' },
  { icon: GraduationCap, label: 'Course creators' },
  { icon: Newspaper, label: 'Journalists' },
  { icon: Headphones, label: 'UX researchers' },
  { icon: Video, label: 'Video producers' },
  { icon: Briefcase, label: 'Founders' },
  { icon: Scale, label: 'Legal teams' },
  { icon: Stethoscope, label: 'Clinicians' },
]

export default function Marquee() {
  // Duplicate the list so the loop seams are invisible
  const loop = [...ITEMS, ...ITEMS]

  return (
    <section
      aria-label="Who uses Echo"
      className="relative py-10 border-y border-white/5 bg-white/[0.015]"
    >
      <p className="text-center text-xs uppercase tracking-[0.2em] text-ink-200/60 mb-6">
        Built for everyone who lives in audio
      </p>

      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="flex gap-3 animate-marquee whitespace-nowrap will-change-transform">
          {loop.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={i}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-ink-100"
              >
                <Icon className="w-3.5 h-3.5 text-purple-300" />
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

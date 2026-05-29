export default function Logo({ size = 32 }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 shadow-lg shadow-purple-500/30"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="white" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="12" x2="4" y2="12" />
            <line x1="8" y1="8" x2="8" y2="16" />
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="16" y1="7" x2="16" y2="17" />
            <line x1="20" y1="10" x2="20" y2="14" />
          </g>
        </svg>
      </div>
      <span className="font-bold text-lg tracking-tight">
        Echo
        <span className="text-purple-400">.</span>
      </span>
    </div>
  )
}

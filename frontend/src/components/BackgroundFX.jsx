export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(76,29,149,0.35),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(8,145,178,0.25),_transparent_55%)]" />

      {/* Drifting blobs */}
      <div className="absolute -top-32 -left-24 w-[42rem] h-[42rem] rounded-full bg-purple-600/30 blur-[140px] animate-blob" />
      <div className="absolute top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-cyan-500/25 blur-[140px] animate-blob-slow" />
      <div className="absolute -bottom-40 left-1/3 w-[40rem] h-[40rem] rounded-full bg-pink-500/20 blur-[160px] animate-blob" />

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(6,0,16,0.7)_100%)]" />
    </div>
  )
}

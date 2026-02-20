import { useRef, useState } from 'react'

const clamp = (n, min, max) => Math.min(Math.max(n, min), max)

export default function UIOverlay({ finale, speed, onJoystick }) {
  const [open, setOpen] = useState(false)
  const pad = useRef(null)

  const handleMove = (touch) => {
    if (!pad.current) return
    const rect = pad.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = clamp((touch.clientX - cx) / (rect.width / 2), -1, 1)
    const dy = clamp((cy - touch.clientY) / (rect.height / 2), -1, 1)
    onJoystick({ x: dx, y: dy })
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 text-white">
      <div className="max-w-sm">
        <p className="text-xs uppercase tracking-[0.38em] text-purple-200/80">Purple Goat Studio</p>
        <h1 className="mt-3 text-3xl font-semibold">Drive. Explore. Activate.</h1>
        <p className="mt-2 text-sm text-white/60">We help brands stand out.</p>
      </div>

      <div className="flex items-end justify-between">
        <div className="rounded-full border border-white/20 bg-black/35 px-4 py-2 text-xs tracking-wider text-white/80 backdrop-blur">
          SPEED {speed.toFixed(1)}
        </div>

        <div
          ref={pad}
          className="touch-joystick pointer-events-auto flex h-28 w-28 items-center justify-center rounded-full border border-purple-300/50 bg-purple-900/20 md:hidden"
          onTouchStart={(e) => handleMove(e.touches[0])}
          onTouchMove={(e) => handleMove(e.touches[0])}
          onTouchEnd={() => onJoystick({ x: 0, y: 0 })}
        >
          <div className="h-10 w-10 rounded-full bg-purple-300/70" />
        </div>
      </div>

      {finale && (
        <div className="pointer-events-auto absolute left-1/2 top-1/2 w-[min(90vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-purple-300/40 bg-black/70 p-8 text-center backdrop-blur-xl">
          <h2 className="text-3xl font-semibold text-white">READY TO STAND OUT?</h2>
          <button
            className="mt-6 rounded-full bg-gradient-to-r from-[#8A00FF] to-[#B000FF] px-6 py-3 text-sm font-semibold tracking-wide text-white"
            onClick={() => setOpen(true)}
          >
            Start Project
          </button>
        </div>
      )}

      {open && (
        <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/75 p-6">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0d0a14] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Project Brief</h3>
              <button className="text-white/70" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <form className="space-y-3">
              <input className="w-full rounded-lg border border-white/15 bg-white/5 p-3" placeholder="Name" />
              <input className="w-full rounded-lg border border-white/15 bg-white/5 p-3" placeholder="Email" type="email" />
              <textarea className="h-24 w-full rounded-lg border border-white/15 bg-white/5 p-3" placeholder="What are you building?" />
              <button className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Lock, ChevronUp, Bell, Disc } from 'lucide-react'
import { audioEngine } from '../services/audioSynth'

export default function LockScreen({ onUnlock, onSecretAdminTrigger, smsUnread = 0, waUnread = 0 }) {
  const [now, setNow] = useState(() => new Date())
  const tapTimesRef = useRef([])
  const [tapPulse, setTapPulse] = useState(false)

  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, -200], [1, 0.2])
  const scale = useTransform(y, [0, -200], [1, 0.94])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeFormatted = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const dateFormatted = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  // Secret Gesture: Tap the time exactly 5 times within a rolling 3.5s window
  const handleTimeTap = (e) => {
    e.stopPropagation()
    const ts = Date.now()
    const recent = tapTimesRef.current.filter((t) => ts - t < 3500)
    recent.push(ts)
    tapTimesRef.current = recent

    audioEngine.playClick(700 + recent.length * 40, 0.02, 0.02)
    setTapPulse(true)
    setTimeout(() => setTapPulse(false), 120)

    if (recent.length === 5) {
      tapTimesRef.current = []
      onSecretAdminTrigger()
    }
  }

  const handleDragEnd = (_, info) => {
    if (info.offset.y < -85 || info.velocity.y < -320) {
      audioEngine.playClick(880, 0.04, 0.04)
      animate(y, -380, { duration: 0.22, ease: 'easeOut' }).then(() => {
        onUnlock()
      })
    } else {
      animate(y, 0, { type: 'spring', stiffness: 420, damping: 30 })
    }
  }

  return (
    <motion.div
      style={{ y, opacity, scale }}
      drag="y"
      dragConstraints={{ top: -320, bottom: 0 }}
      dragElastic={{ top: 0.2, bottom: 0.05 }}
      onDragEnd={handleDragEnd}
      className="w-full h-full relative flex flex-col justify-between px-5 pt-14 pb-6 cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* Custom Moody Nocturnal Rooftop / Highway Wallpaper */}
      <div className="absolute inset-0 -z-10 bg-[#070a10]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 25% 22%, rgba(56, 189, 248, 0.22), transparent 52%), radial-gradient(circle at 80% 68%, rgba(245, 158, 11, 0.2), transparent 50%), linear-gradient(170deg, #0b111c 0%, #090c12 48%, #140f0c 100%)',
          }}
        />
        {/* Subtle horizon skyline silhouette */}
        <svg viewBox="0 0 360 200" className="absolute bottom-0 left-0 right-0 w-full opacity-35" preserveAspectRatio="none">
          <path
            d="M0,200 L0,145 L24,145 L24,122 L46,122 L46,150 L72,150 L72,108 L98,108 L98,142 L135,142 L135,96 L158,96 L158,136 L195,136 L195,114 L224,114 L224,148 L260,148 L260,104 L292,104 L292,138 L328,138 L328,125 L360,125 L360,200 Z"
            fill="#030407"
          />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_0)] [background-size:18px_18px] opacity-40" />
      </div>

      {/* Top Clock & Date (Easter Egg Target: Tap 5x) */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-white/65 mb-1">
          <Lock className="w-3 h-3 text-sky-300" />
          <span>{dateFormatted}</span>
        </div>

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleTimeTap}
          className={`text-[64px] leading-none font-bold tracking-tight text-white/95 drop-shadow-[0_6px_22px_rgba(0,0,0,0.65)] transition-transform duration-100 focus:outline-none ${
            tapPulse ? 'scale-[0.985]' : 'scale-100'
          }`}
          aria-label="Lock screen clock"
        >
          {timeFormatted}
        </button>

        {/* Subtle session badge */}
        <div className="mt-2.5 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] flex items-center gap-1.5 text-[10px] font-mono text-white/80">
          <Disc className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>BOOTH VAULT · GGN</span>
        </div>
      </div>

      {/* Lock Screen Notifications Preview */}
      <div className="space-y-2 my-auto pt-4">
        {waUnread > 0 && (
          <div className="p-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/[0.1] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00a884] flex items-center justify-center text-[10px] font-bold text-black shrink-0">
              WA
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between text-[10.5px] font-semibold">
                <span>Karan Aujla</span>
                <span className="text-white/50 text-[9px]">now</span>
              </div>
              <p className="text-[10.5px] text-white/75 truncate">
                Delhi aaya toh Studio B mein milte hain next week...
              </p>
            </div>
          </div>
        )}

        {smsUnread > 0 && (
          <div className="p-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/[0.1] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-black shrink-0">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between text-[10.5px] font-semibold">
                <span>Messages ({smsUnread})</span>
                <span className="text-white/50 text-[9px]">7:18 PM</span>
              </div>
              <p className="text-[10.5px] text-white/75 truncate">
                Your plan is expiring. Recharge now or your career validity...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Physical Swipe to Unlock Bar */}
      <div className="flex flex-col items-center gap-2 pt-2">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
          className="flex flex-col items-center text-white/85"
        >
          <ChevronUp className="w-4 h-4 text-sky-300" />
          <span className="text-[11.5px] font-medium tracking-wide drop-shadow">
            Swipe up to Unlock
          </span>
        </motion.div>

        <div className="w-28 h-1.5 rounded-full bg-white/75 shadow-[0_0_12px_rgba(255,255,255,0.45)]" />
      </div>
    </motion.div>
  )
}

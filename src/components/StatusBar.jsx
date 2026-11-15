import React, { useState, useEffect } from 'react'
import { Wifi, Signal, Battery } from 'lucide-react'

export default function StatusBar({ showTime = true, carrier = 'JIO 5G', battery = 84 }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10000)
    return () => clearInterval(id)
  }, [])

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div className="absolute top-0 left-0 right-0 z-30 px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-white pointer-events-none select-none">
      {/* Left: Time or Carrier */}
      <div className="w-16 tracking-tight font-sans tabular-nums">
        {showTime ? timeStr : <span className="text-[10px] font-mono text-white/80">{carrier}</span>}
      </div>

      {/* Center: Dynamic Island */}
      <div className="w-[88px] h-[22px] rounded-full bg-black border border-white/[0.08] flex items-center justify-between px-2.5 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-[#121824] ring-1 ring-sky-400/30" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
      </div>

      {/* Right: Signal + Wifi + Battery */}
      <div className="w-16 flex items-center justify-end gap-1.5 text-white/90">
        <Signal className="w-3 h-3" />
        <Wifi className="w-3 h-3" />
        <div className="flex items-center gap-0.5">
          <span className="text-[9px] font-mono">{battery}%</span>
          <Battery className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  )
}

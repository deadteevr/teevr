import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Glasses, Maximize2, Power } from 'lucide-react'

/**
 * Renders the first-person Smart Glasses POV environment:
 * - Peripheral AR glasses optical vignette & minimal HUD
 * - CSS 3D perspective container looking down at a hand-held smartphone
 * - Realistic SVG hand silhouette holding the device
 * - Hardware titanium frame with glowing side Power Button
 */
export default function SmartGlassesStage({
  isScreenOn,
  onTogglePower,
  children,
}) {
  const [tiltEnabled, setTiltEnabled] = useState(true)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [fitScale, setFitScale] = useState(1)

  // Dynamically scale the 366x745 phone rig so it never clips on smaller laptops or phones
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const scaleW = (vw - 56) / 420
      const scaleH = (vh - 44) / 775
      setFitScale(Math.max(0.55, Math.min(1.04, scaleW, scaleH)))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const handleMouseMove = (e) => {
    if (!tiltEnabled) return
    const nx = (e.clientX / window.innerWidth - 0.5) * 2 // -1 to 1
    const ny = (e.clientY / window.innerHeight - 0.5) * 2
    setMouseOffset({ x: nx, y: ny })
  }

  // First-person "looking down at phone in hand" angle + gentle cursor parallax
  const rotateX = tiltEnabled ? 13 - mouseOffset.y * 4.5 : 0
  const rotateY = tiltEnabled ? -4 + mouseOffset.x * 5.5 : 0
  const rotateZ = tiltEnabled ? -1.2 + mouseOffset.x * 0.8 : 0

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-[100dvh] overflow-hidden pov-stage flex items-center justify-center bg-[#06080c]"
    >
      {/* Ambient Desk / Lap Environment behind the held phone */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 48%, rgba(36, 46, 66, 0.42), transparent 70%), radial-gradient(circle at 18% 85%, rgba(161, 98, 43, 0.14), transparent 45%), radial-gradient(circle at 82% 20%, rgba(14, 116, 144, 0.14), transparent 45%), linear-gradient(180deg, #07090e 0%, #0d1017 52%, #06070a 100%)',
        }}
      />
      {/* Subtle studio desk wood/mat surface texture */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(92deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 28px)',
        }}
      />

      {/* Smart Glasses Peripheral Optical Vignette */}
      <div className="absolute inset-0 pointer-events-none glasses-vignette z-20" />

      {/* Subtle Smart Glasses Frame Corner Reticles & Controls */}
      <div className="absolute top-3.5 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 border border-white/[0.08] backdrop-blur-md text-[10px] font-mono text-sky-300/80">
          <Glasses className="w-3.5 h-3.5 text-sky-400" />
          <span>POV-GLASSES // LENS_01</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setTiltEnabled((t) => !t)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono border backdrop-blur-md transition-colors flex items-center gap-1.5 ${
              tiltEnabled
                ? 'bg-sky-500/15 border-sky-400/35 text-sky-300'
                : 'bg-white/10 border-white/20 text-white'
            }`}
            title="Toggle 3D Smart Glasses Perspective"
          >
            <Maximize2 className="w-3 h-3" />
            {tiltEnabled ? '3D POV: ON' : 'FLAT VIEW'}
          </button>
          <button
            type="button"
            onClick={onTogglePower}
            className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/[0.07] hover:bg-white/[0.14] border border-white/15 text-neutral-300 flex items-center gap-1 backdrop-blur-md transition-colors"
            title="Toggle Phone Power"
          >
            <Power className="w-3 h-3 text-sky-400" />
            {isScreenOn ? 'Sleep' : 'Wake'}
          </button>
        </div>
      </div>

      {/* Bottom peripheral glasses rim hint */}
      <div className="absolute bottom-3 left-6 right-6 z-20 flex items-center justify-between text-[9.5px] font-mono text-white/30 pointer-events-none hidden sm:flex">
        <span>FOV 54° · OPTICAL TRACKING ACTIVE</span>
        <span>TIP: TAP LOCK CLOCK 5× FOR ADMIN VAULT</span>
      </div>

      {/* Scaled + 3D Tilted Phone + Hand Rig */}
      <div
        style={{ transform: `scale(${fitScale})` }}
        className="relative z-10 flex items-center justify-center transition-transform duration-150"
      >
        <div
          className="phone-3d-rig relative"
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          }}
        >
          {/* Ambient soft shadow cast by hand & phone onto desk */}
          <div
            className="absolute -inset-6 rounded-[64px] bg-black/75 blur-2xl -z-20 pointer-events-none"
            style={{ transform: 'translateY(38px) translateX(14px) scale(0.96)' }}
          />

          {/* FIRST-PERSON HAND HOLDING THE SMARTPHONE (Right-hand grip) */}
          <svg
            viewBox="0 0 520 880"
            className="absolute -left-[74px] -right-[84px] -top-[28px] -bottom-[110px] w-[520px] h-[880px] pointer-events-none -z-10"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="skinMain" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8d5d43" />
                <stop offset="55%" stopColor="#724833" />
                <stop offset="100%" stopColor="#4f3021" />
              </linearGradient>
              <linearGradient id="skinShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5d3927" />
                <stop offset="100%" stopColor="#3c2317" />
              </linearGradient>
              <linearGradient id="sleeve" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1b2029" />
                <stop offset="100%" stopColor="#0c0e13" />
              </linearGradient>
            </defs>

            {/* Wrist & Lower Forearm extending bottom-right in POV */}
            <path
              d="M275,710 C320,730 390,720 430,785 L475,880 L235,880 C245,825 245,765 275,710 Z"
              fill="url(#sleeve)"
            />
            <path
              d="M240,680 C285,660 395,645 425,735 C435,765 415,795 375,805 C325,818 250,790 230,745 Z"
              fill="url(#skinMain)"
            />

            {/* Palm cradle behind the phone */}
            <path
              d="M115,320 C115,280 395,280 415,360 C435,440 438,630 410,705 C382,780 155,760 120,665 C95,595 105,400 115,320 Z"
              fill="url(#skinShadow)"
            />

            {/* Four fingers wrapping around left edge (behind chassis, tips peeking) */}
            <rect x="44" y="255" width="76" height="44" rx="22" fill="url(#skinMain)" transform="rotate(-6 80 277)" />
            <rect x="38" y="314" width="82" height="46" rx="23" fill="url(#skinMain)" transform="rotate(-4 79 337)" />
            <rect x="42" y="376" width="78" height="45" rx="22" fill="url(#skinMain)" transform="rotate(-2 80 398)" />
            <rect x="52" y="438" width="70" height="41" rx="20" fill="url(#skinMain)" transform="rotate(2 85 458)" />
          </svg>

          {/* Left Fingertips subtly overlapping left titanium bezel */}
          <div className="absolute -left-[12px] top-[232px] w-[16px] h-[36px] rounded-l-full bg-gradient-to-r from-[#8f5e44] to-[#69422e] shadow-md z-20 pointer-events-none opacity-95" />
          <div className="absolute -left-[14px] top-[292px] w-[18px] h-[38px] rounded-l-full bg-gradient-to-r from-[#8f5e44] to-[#69422e] shadow-md z-20 pointer-events-none opacity-95" />
          <div className="absolute -left-[12px] top-[354px] w-[16px] h-[36px] rounded-l-full bg-gradient-to-r from-[#8b5b41] to-[#653e2b] shadow-md z-20 pointer-events-none opacity-95" />

          {/* Right Thumb resting near lower-right edge (never blocking power button or screen) */}
          <div
            className="absolute -right-[24px] bottom-[95px] w-[44px] h-[94px] rounded-full bg-gradient-to-l from-[#8d5d43] via-[#7c4f38] to-[#5a3726] shadow-2xl z-20 pointer-events-none border-l border-white/10"
            style={{ transform: 'rotate(-22deg)' }}
          />

          {/* LEFT HARDWARE BUTTONS (Mute + Volume Up/Down) */}
          <div className="absolute -left-[4px] top-[128px] w-[4px] h-[26px] rounded-l bg-neutral-600 border-y border-white/15 pointer-events-none" />
          <div className="absolute -left-[4px] top-[174px] w-[4px] h-[48px] rounded-l bg-neutral-600 border-y border-white/15 pointer-events-none" />
          <div className="absolute -left-[4px] top-[234px] w-[4px] h-[48px] rounded-l bg-neutral-600 border-y border-white/15 pointer-events-none" />

          {/* RIGHT HARDWARE: GLOWING POWER BUTTON */}
          <motion.button
            type="button"
            whileTap={{ scaleX: 0.65, x: -2 }}
            onClick={onTogglePower}
            aria-label={isScreenOn ? 'Turn off phone screen' : 'Turn on phone screen'}
            className={`absolute -right-[9px] top-[192px] w-[10px] h-[74px] rounded-r-md cursor-pointer z-30 border-y border-r transition-colors ${
              !isScreenOn
                ? 'bg-sky-300 border-sky-100 power-button-glow'
                : 'bg-gradient-to-b from-sky-300/80 via-neutral-300 to-sky-400/70 border-white/40 shadow-[0_0_12px_rgba(56,189,248,0.45)]'
            }`}
          />

          {/* Helpful unobtrusive callout ONLY when phone is in initial black-screen state */}
          {!isScreenOn && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              className="absolute -right-[148px] top-[210px] z-30 hidden sm:flex items-center gap-2 pointer-events-none"
            >
              <span className="w-5 h-[1px] bg-sky-400/70" />
              <div className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-400/40 backdrop-blur-md text-[10px] font-mono text-sky-200 whitespace-nowrap shadow-lg">
                Power Button
              </div>
            </motion.div>
          )}

          {/* SMARTPHONE TITANIUM CHASSIS */}
          <div className="w-[366px] h-[745px] rounded-[52px] p-[11px] bg-gradient-to-br from-[#3a3e46] via-[#1c1f25] to-[#2c3038] shadow-phone-chassis border border-white/20 relative">
            {/* Inner Black Bezel */}
            <div className="w-full h-full rounded-[42px] bg-[#040507] p-[3px] relative overflow-hidden border border-black">
              {/* Screen Viewport */}
              <div className="w-full h-full rounded-[39px] bg-black relative overflow-hidden">
                {children}

                {/* Subtle OLED Glass Reflection Sheen */}
                <div className="absolute inset-0 pointer-events-none oled-glass-reflection z-50 rounded-[39px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

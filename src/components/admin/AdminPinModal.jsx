import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Delete, X, HelpCircle } from 'lucide-react'
import { audioEngine } from '../../services/audioSynth'

export default function AdminPinModal({ expectedPin = '2026', onSuccess, onCancel }) {
  const [pin, setPin] = useState('')
  const [errorShake, setErrorShake] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleDigit = (digit) => {
    if (pin.length >= 4) return
    audioEngine.playClick(760, 0.025, 0.03)
    const next = pin + digit
    setPin(next)

    if (next.length === 4) {
      if (next === expectedPin) {
        audioEngine.playClick(980, 0.06, 0.05)
        setTimeout(() => onSuccess(), 160)
      } else {
        audioEngine.playClick(220, 0.12, 0.06)
        setErrorShake(true)
        setTimeout(() => {
          setErrorShake(false)
          setPin('')
        }, 420)
      }
    }
  }

  const handleBackspace = () => {
    audioEngine.playClick(520, 0.02, 0.025)
    setPin((p) => p.slice(0, -1))
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-black/82 backdrop-blur-xl flex flex-col items-center justify-between px-6 pt-12 pb-8 text-white"
    >
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowHint((h) => !h)}
          className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
          title="PIN Hint"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Root Vault
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
          aria-label="Cancel PIN"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Prompt & Dots */}
      <div className="flex flex-col items-center">
        <div className="text-sm font-semibold tracking-tight">Enter Admin Passcode</div>
        <div className="text-[10px] font-mono text-neutral-400 mt-0.5 h-4">
          {showHint ? `Hint: Default PIN is ${expectedPin}` : 'Tap 5× gesture verified'}
        </div>

        <motion.div
          animate={errorShake ? { x: [-10, 10, -8, 8, -4, 0] } : { x: 0 }}
          transition={{ duration: 0.36 }}
          className="flex items-center gap-3.5 mt-4"
        >
          {[0, 1, 2, 3].map((idx) => {
            const filled = idx < pin.length
            return (
              <span
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                  errorShake
                    ? 'bg-red-500 border-red-400'
                    : filled
                    ? 'bg-sky-400 border-sky-300 scale-110 shadow-[0_0_10px_rgba(56,189,248,0.8)]'
                    : 'border-white/35 bg-transparent'
                }`}
              />
            )
          })}
        </motion.div>
      </div>

      {/* Minimal Numeric Keypad */}
      <div className="grid grid-cols-3 gap-3.5 w-full max-w-[232px]">
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => handleDigit(k)}
            className="h-14 rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:scale-95 border border-white/[0.08] text-lg font-medium transition-all flex items-center justify-center"
          >
            {k}
          </button>
        ))}

        <div />
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="h-14 rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:scale-95 border border-white/[0.08] text-lg font-medium transition-all flex items-center justify-center"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="h-14 rounded-full bg-transparent hover:bg-white/[0.08] active:scale-95 text-neutral-300 flex items-center justify-center transition-all"
          aria-label="Delete digit"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  )
}

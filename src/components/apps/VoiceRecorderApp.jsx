import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Play, Pause, Mic, Square, Radio } from 'lucide-react'
import { usePhoneData } from '../../context/PhoneDataContext'
import { audioEngine } from '../../services/audioSynth'

export default function VoiceRecorderApp({ onClose }) {
  const { phoneData, addVoiceNoteItem } = usePhoneData()
  const voiceNotes = phoneData.voiceNotes

  const [selectedId, setSelectedId] = useState(voiceNotes[0]?.id || null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progressSec, setProgressSec] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recSec, setRecSec] = useState(0)
  const audioElRef = useRef(null)

  const activeNote = voiceNotes.find((v) => v.id === selectedId) || voiceNotes[0]

  useEffect(() => () => audioEngine.stopLoop(), [])

  // Handle playback timer for synth acapella takes
  useEffect(() => {
    if (!isPlaying || !activeNote || activeNote.localObjectUrl) return undefined
    const maxSec = activeNote.durationSec || 24
    const timer = setInterval(() => {
      setProgressSec((prev) => {
        if (prev + 0.1 >= maxSec) {
          audioEngine.stopLoop()
          setIsPlaying(false)
          return 0
        }
        return +(prev + 0.1).toFixed(1)
      })
    }, 100)
    return () => clearInterval(timer)
  }, [isPlaying, activeNote])

  // Mock studio mic recording timer
  useEffect(() => {
    if (!isRecording) return undefined
    const timer = setInterval(() => setRecSec((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [isRecording])

  const selectTake = (note) => {
    audioEngine.stopLoop()
    setIsPlaying(false)
    setProgressSec(0)
    setSelectedId(note.id)
  }

  const togglePlay = () => {
    if (!activeNote) return
    if (activeNote.localObjectUrl && audioElRef.current) {
      if (isPlaying) {
        audioElRef.current.pause()
        setIsPlaying(false)
      } else {
        audioElRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
      return
    }

    if (isPlaying) {
      audioEngine.stopLoop()
      setIsPlaying(false)
    } else {
      audioEngine.startAcapellaSim(activeNote.cadenceBpm || 130)
      setIsPlaying(true)
    }
  }

  const handleScrub = (idx, totalBars) => {
    if (!activeNote) return
    const ratio = (idx + 0.5) / totalBars
    const newTime = +(ratio * (activeNote.durationSec || 24)).toFixed(1)
    setProgressSec(newTime)
    if (activeNote.localObjectUrl && audioElRef.current && audioElRef.current.duration) {
      audioElRef.current.currentTime = ratio * audioElRef.current.duration
    }
  }

  const toggleRecord = () => {
    if (isRecording) {
      const secs = Math.max(4, recSec)
      const newTake = {
        id: `vn-${Date.now()}`,
        title: `Quick Booth Take #${voiceNotes.length + 1}`,
        tag: 'ACAPELLA · RAW MIC',
        recordedAt: 'Just now',
        durationSec: secs,
        durationLabel: `0:${String(secs).padStart(2, '0')}`,
        location: 'POV Smart Glasses Mic',
        r2Bucket: 'pov-acapellas',
        r2Key: `memos/2026/take-${Date.now()}.wav`,
        publicUrl: `r2://pov-acapellas/memos/2026/take-${Date.now()}.wav`,
        cadenceBpm: 134,
        waveform: Array.from({ length: 36 }, () => Math.floor(20 + Math.random() * 75)),
      }
      addVoiceNoteItem(newTake)
      setSelectedId(newTake.id)
      setIsRecording(false)
      setRecSec(0)
    } else {
      audioEngine.stopLoop()
      setIsPlaying(false)
      setRecSec(0)
      setIsRecording(true)
    }
  }

  const progressRatio = activeNote ? Math.min(1, progressSec / (activeNote.durationSec || 24)) : 0

  return (
    <div className="w-full h-full bg-[#0c0d10] text-white flex flex-col">
      {/* Header */}
      <div className="px-3.5 pt-11 pb-2.5 flex items-center justify-between border-b border-white/[0.07]">
        <button
          type="button"
          onClick={() => {
            audioEngine.stopLoop()
            onClose()
          }}
          className="flex items-center gap-0.5 text-red-400 text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <div className="text-[13px] font-semibold">Voice Memos</div>
        <span className="text-[9px] font-mono text-red-400/80 flex items-center gap-1">
          <Radio className="w-3 h-3" />
          48kHz
        </span>
      </div>

      {/* Active Waveform Player Card */}
      {activeNote && (
        <div className="mx-3 mt-3 p-3 rounded-2xl bg-[#16171d] border border-white/[0.08] space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/25">
                {activeNote.tag}
              </span>
              <h2 className="text-[13px] font-semibold text-white mt-1.5 leading-snug">{activeNote.title}</h2>
              <p className="text-[10px] text-neutral-400 font-mono">
                {activeNote.location} · {activeNote.recordedAt}
              </p>
            </div>
          </div>

          {/* Interactive Waveform Visualizer */}
          <div className="h-16 px-2 rounded-xl bg-[#0e0f13] border border-white/[0.05] flex items-center gap-[3px]">
            {(activeNote.waveform || []).map((amp, idx, arr) => {
              const barRatio = idx / arr.length
              const active = barRatio <= progressRatio
              const liveJitter = isPlaying ? Math.sin(progressSec * 12 + idx) * 8 : 0
              const heightPct = Math.max(14, Math.min(96, amp + liveJitter))
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleScrub(idx, arr.length)}
                  title="Scrub waveform"
                  className="flex-1 h-full flex items-center justify-center group"
                >
                  <span
                    className={`w-full rounded-full transition-colors duration-75 ${
                      active ? 'bg-red-500' : 'bg-neutral-700 group-hover:bg-neutral-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </button>
              )
            })}
          </div>

          {activeNote.localObjectUrl && (
            <audio
              ref={audioElRef}
              src={activeNote.localObjectUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400 tabular-nums">
              0:{String(Math.floor(progressSec)).padStart(2, '0')} / {activeNote.durationLabel}
            </span>
            <button
              type="button"
              onClick={togglePlay}
              className="px-4 py-1.5 rounded-full bg-red-500 hover:bg-red-400 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-red-500/20"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              {isPlaying ? 'Pause' : 'Play Take'}
            </button>
          </div>

          <div className="text-[9px] font-mono text-neutral-500 truncate border-t border-white/[0.05] pt-1.5">
            {activeNote.publicUrl}
          </div>
        </div>
      )}

      {/* List of Raw Acapellas / Memos */}
      <div className="flex-1 overflow-y-auto phone-scroll px-3 py-2.5 space-y-1.5">
        <div className="text-[10px] font-mono text-neutral-500 px-1 uppercase">Studio Takes ({voiceNotes.length})</div>
        {voiceNotes.map((note) => {
          const selected = note.id === activeNote?.id
          return (
            <button
              key={note.id}
              type="button"
              onClick={() => selectTake(note)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border transition-colors flex items-center justify-between gap-2 ${
                selected
                  ? 'bg-red-500/10 border-red-500/40'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.05]'
              }`}
            >
              <div className="min-w-0">
                <div className="text-[12px] font-medium truncate">{note.title}</div>
                <div className="text-[10px] text-neutral-500 font-mono">{note.recordedAt}</div>
              </div>
              <span className="text-[10px] font-mono text-neutral-300 shrink-0">{note.durationLabel}</span>
            </button>
          )
        })}
      </div>

      {/* Bottom Record Button */}
      <div className="pb-7 pt-2 px-4 border-t border-white/[0.06] bg-[#101116] flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={toggleRecord}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
            isRecording
              ? 'border-white bg-red-600 animate-pulse'
              : 'border-neutral-600 bg-red-600/90 hover:bg-red-500'
          }`}
          aria-label={isRecording ? 'Stop recording' : 'Record new memo'}
        >
          {isRecording ? <Square className="w-4 h-4 fill-white" /> : <Mic className="w-5 h-5 text-white" />}
        </button>
        {isRecording && (
          <span className="text-xs font-mono text-red-400">
            REC 0:{String(recSec).padStart(2, '0')} — Tap to save take
          </span>
        )}
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Play, Pause, Info, ChevronRight, Film, Camera, X } from 'lucide-react'
import { usePhoneData } from '../../context/PhoneDataContext'
import RawSceneRenderer from '../gallery/RawSceneRenderer'

export default function GalleryApp({ onClose }) {
  const { phoneData } = usePhoneData()
  const items = phoneData.galleryMedia

  const [selectedIndex, setSelectedIndex] = useState(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoTime, setVideoTime] = useState(0)
  const [showExif, setShowExif] = useState(false)

  const selectedItem = selectedIndex !== null ? items[selectedIndex] : null

  useEffect(() => {
    if (!selectedItem || selectedItem.type !== 'video' || !isPlaying) return undefined
    const maxSec = selectedItem.durationSec || 18
    const timer = setInterval(() => {
      setVideoTime((prev) => (prev + 0.1 >= maxSec ? 0 : +(prev + 0.1).toFixed(1)))
    }, 100)
    return () => clearInterval(timer)
  }, [selectedItem, isPlaying])

  const openViewer = (idx) => {
    setSelectedIndex(idx)
    setVideoTime(0)
    setIsPlaying(true)
    setShowExif(false)
  }

  return (
    <div className="w-full h-full bg-[#0e0f11] text-neutral-100 flex flex-col relative overflow-hidden">
      {/* Minimal unedited camera-roll header */}
      <div className="px-3.5 pt-11 pb-2.5 flex items-center justify-between border-b border-white/[0.07] bg-[#0e0f11]/95">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-0.5 text-sky-400 text-xs font-medium active:opacity-70"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <div className="text-center">
          <div className="text-[13px] font-semibold tracking-tight text-neutral-100">Camera Roll</div>
          <div className="text-[10px] font-mono text-neutral-500">RAW · UNEDITED ({items.length})</div>
        </div>
        <div className="w-11 text-right text-[10px] font-mono text-neutral-500">R2</div>
      </div>

      {/* Subtle authentic photo strip note */}
      <div className="px-3.5 py-2 flex items-center justify-between text-[10px] font-mono text-neutral-400 bg-[#141518] border-b border-white/[0.04]">
        <span className="flex items-center gap-1.5">
          <Camera className="w-3 h-3 text-neutral-500" />
          ORIGINAL SENSOR FILES
        </span>
        <span>NO LUT / NO FILTER</span>
      </div>

      {/* Authentic raw 3-column grid */}
      <div className="flex-1 overflow-y-auto phone-scroll p-1 grid grid-cols-3 gap-1 content-start">
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openViewer(idx)}
            className="relative aspect-[3/4] bg-neutral-900 overflow-hidden group focus:outline-none"
          >
            <RawSceneRenderer item={item} lowRes className="group-hover:scale-[1.03] transition-transform duration-300" />
            {item.type === 'video' && (
              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white flex items-center gap-1">
                <Film className="w-2.5 h-2.5" />
                {item.duration || '0:15'}
              </div>
            )}
            <div className="absolute top-1 left-1 px-1 py-0.5 bg-black/45 text-[8px] font-mono text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.filename.split('.')[0]}
            </div>
          </button>
        ))}
      </div>

      {/* Full-Screen Media Viewer */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 z-30 bg-black flex flex-col"
          >
            {/* Top Bar */}
            <div className="px-3 pt-11 pb-2 flex items-center justify-between bg-gradient-to-b from-black/85 to-transparent z-10">
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                aria-label="Close viewer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center">
                <div className="text-[11px] font-mono text-neutral-200">{selectedItem.filename}</div>
                <div className="text-[9px] text-neutral-400">{selectedItem.timestamp}</div>
              </div>
              <button
                type="button"
                onClick={() => setShowExif((s) => !s)}
                className={`p-1.5 rounded-full ${showExif ? 'bg-sky-500 text-black' : 'bg-white/10 text-white'}`}
                aria-label="Toggle EXIF info"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Media Canvas */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black px-1">
              <div className="w-full h-full max-h-[430px] relative overflow-hidden">
                <RawSceneRenderer
                  item={selectedItem}
                  isPlaying={isPlaying}
                  currentTimeSec={videoTime}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Prev / Next touch controls */}
              {selectedIndex > 0 && (
                <button
                  type="button"
                  onClick={() => openViewer(selectedIndex - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/55 text-white/90 hover:bg-black/80"
                  aria-label="Previous media"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {selectedIndex < items.length - 1 && (
                <button
                  type="button"
                  onClick={() => openViewer(selectedIndex + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/55 text-white/90 hover:bg-black/80"
                  aria-label="Next media"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bottom caption & Video Scrubber */}
            <div className="px-3.5 pb-6 pt-2 bg-gradient-to-t from-black via-black/90 to-transparent space-y-2">
              {selectedItem.type === 'video' && !selectedItem.localObjectUrl && (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                  </button>
                  <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100"
                      style={{
                        width: `${Math.min(100, (videoTime / (selectedItem.durationSec || 18)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-300 tabular-nums">
                    0:{String(Math.floor(videoTime)).padStart(2, '0')} / {selectedItem.duration || '0:18'}
                  </span>
                </div>
              )}

              <p className="text-[11px] text-neutral-300 leading-snug">{selectedItem.caption}</p>

              {showExif && (
                <div className="p-2.5 rounded-lg bg-neutral-900/95 border border-white/10 text-[10px] font-mono text-neutral-300 space-y-1">
                  <div className="text-neutral-400">CAMERA: {selectedItem.cameraMeta}</div>
                  <div className="text-neutral-400">LOC: {selectedItem.location}</div>
                  <div className="text-sky-400 truncate">R2: {selectedItem.publicUrl}</div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

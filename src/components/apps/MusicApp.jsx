import React, { useState, useEffect } from 'react'
import { ChevronLeft, Play, Pause, Disc3, Volume2 } from 'lucide-react'
import { usePhoneData } from '../../context/PhoneDataContext'
import { audioEngine } from '../../services/audioSynth'

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zm4.81 15.15a.75.75 0 01-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.15a.75.75 0 11-.33-1.46c4.57-1.05 8.5-.6 11.66 1.33.35.22.46.68.25 1.03zm1.47-3.27a.94.94 0 01-1.29.31c-3.23-1.99-8.15-2.56-11.97-1.4a.94.94 0 01-.55-1.8c4.36-1.32 9.78-.68 13.5 1.6.44.27.58.85.31 1.29zm.13-3.4c-3.87-2.3-10.26-2.51-13.95-1.39a1.12 1.12 0 11-.65-2.15c4.24-1.29 11.3-1.04 15.76 1.61a1.12 1.12 0 01-1.16 1.93z" />
    </svg>
  )
}

function AppleMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M17.5 3.2L9.2 5.1c-.7.16-1.2.78-1.2 1.5v8.67c-.45-.18-.98-.24-1.53-.13-1.38.28-2.3 1.48-2.06 2.68.24 1.2 1.55 1.95 2.93 1.67 1.22-.25 2.08-1.22 2.06-2.29V9.68l7-1.61v5.72c-.45-.18-.98-.24-1.53-.13-1.38.28-2.3 1.48-2.06 2.68.24 1.2 1.55 1.95 2.93 1.67 1.22-.25 2.08-1.22 2.06-2.29V4.4c0-.76-.68-1.34-1.3-1.2z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M21.58 7.19a2.75 2.75 0 00-1.94-1.95C17.93 4.78 12 4.78 12 4.78s-5.93 0-7.64.46A2.75 2.75 0 002.42 7.2 28.8 28.8 0 001.96 12a28.8 28.8 0 00.46 4.81 2.75 2.75 0 001.94 1.95c1.71.46 7.64.46 7.64.46s5.93 0 7.64-.46a2.75 2.75 0 001.94-1.95A28.8 28.8 0 0022.04 12a28.8 28.8 0 00-.46-4.81zM9.95 15.05V8.95L15.22 12l-5.27 3.05z" />
    </svg>
  )
}

export default function MusicApp({ onClose }) {
  const { phoneData } = usePhoneData()
  const [playingTrackId, setPlayingTrackId] = useState(null)

  useEffect(() => () => audioEngine.stopLoop(), [])

  const togglePlayTrack = (track) => {
    if (playingTrackId === track.id) {
      audioEngine.stopLoop()
      setPlayingTrackId(null)
    } else {
      audioEngine.startBeatLoop(track.synthTempo || 130, track.synthRoot || 92.5)
      setPlayingTrackId(track.id)
    }
  }

  const activeTrack = phoneData.tracks.find((t) => t.id === playingTrackId)

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#16131c] via-[#0d0d11] to-[#08080a] text-white flex flex-col relative">
      {/* Header */}
      <div className="px-3.5 pt-11 pb-2.5 flex items-center justify-between border-b border-white/[0.06]">
        <button
          type="button"
          onClick={() => {
            audioEngine.stopLoop()
            onClose()
          }}
          className="flex items-center gap-0.5 text-rose-400 text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <div className="text-[13px] font-semibold tracking-tight">Music</div>
        <div className="text-[10px] font-mono text-neutral-400">DSP LINKS</div>
      </div>

      {/* Hero banner */}
      <div className="px-4 py-3 flex items-center justify-between bg-white/[0.03] border-b border-white/[0.05]">
        <div>
          <div className="text-[10px] font-mono text-rose-400 uppercase tracking-wider">Artist Catalog</div>
          <div className="text-base font-bold leading-tight">Rao Saab — Masters</div>
          <div className="text-[10px] text-neutral-400">Tap track for synth preview · Tap icons for DSP</div>
        </div>
        <Disc3 className={`w-7 h-7 text-rose-400/80 ${playingTrackId ? 'animate-spin' : ''}`} />
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto phone-scroll px-3 py-2.5 pb-20 space-y-2">
        {phoneData.tracks.map((track, idx) => {
          const isPlaying = playingTrackId === track.id
          return (
            <div
              key={track.id}
              onClick={() => togglePlayTrack(track)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') togglePlayTrack(track)
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-white/[0.11] border-rose-500/45 shadow-lg'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {/* Album tile */}
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${track.coverHue} flex items-center justify-center shrink-0 relative border border-white/10`}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white/90 ml-0.5" />
                  )}
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-black/80 text-[8px] font-mono flex items-center justify-center border border-white/15">
                    {idx + 1}
                  </span>
                </div>

                {/* Title + Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold truncate">{track.title}</span>
                    {track.explicit && (
                      <span className="px-1 rounded bg-neutral-700 text-[8px] font-bold text-neutral-300 shrink-0">
                        E
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate">
                    {track.artist} · {track.duration} · {track.bpm} BPM
                  </div>
                </div>

                {/* Inline clickable DSP buttons (Spotify, Apple Music, YouTube) */}
                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open on Spotify"
                    aria-label={`Open ${track.title} on Spotify`}
                    className="w-7 h-7 rounded-full bg-[#1DB954]/15 hover:bg-[#1DB954] text-[#1DB954] hover:text-black flex items-center justify-center transition-colors border border-[#1DB954]/30"
                  >
                    <SpotifyIcon />
                  </a>
                  <a
                    href={track.appleMusicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open on Apple Music"
                    aria-label={`Open ${track.title} on Apple Music`}
                    className="w-7 h-7 rounded-full bg-[#FA243C]/15 hover:bg-[#FA243C] text-[#FA243C] hover:text-white flex items-center justify-center transition-colors border border-[#FA243C]/30"
                  >
                    <AppleMusicIcon />
                  </a>
                  <a
                    href={track.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open on YouTube"
                    aria-label={`Open ${track.title} on YouTube`}
                    className="w-7 h-7 rounded-full bg-[#FF0000]/15 hover:bg-[#FF0000] text-[#FF4E45] hover:text-white flex items-center justify-center transition-colors border border-[#FF0000]/30"
                  >
                    <YouTubeIcon />
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mini Now Playing Bar */}
      {activeTrack && (
        <div className="absolute bottom-6 left-3 right-3 px-3 py-2 rounded-xl bg-neutral-900/95 backdrop-blur-md border border-rose-500/35 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2 min-w-0">
            <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
            <div className="min-w-0">
              <div className="text-[11px] font-semibold truncate">{activeTrack.title}</div>
              <div className="text-[9px] font-mono text-neutral-400">
                Synth Beat Preview · {activeTrack.bpm} BPM · {activeTrack.key}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => togglePlayTrack(activeTrack)}
            className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}

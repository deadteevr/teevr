import React, { useState, useRef } from 'react'
import {
  ChevronLeft,
  Database,
  UploadCloud,
  FileText,
  MessageSquare,
  MessageCircle,
  CheckCircle2,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Code2,
} from 'lucide-react'
import { usePhoneData } from '../../context/PhoneDataContext'
import { mockUploadToCloudflareR2 } from '../../services/storageAdapter'

const TABS = [
  { id: 'lyrics', label: 'Lyrics', icon: FileText },
  { id: 'sms', label: 'SMS', icon: MessageSquare },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'r2', label: 'R2 Upload', icon: UploadCloud },
  { id: 'json', label: 'Schema', icon: Code2 },
]

export default function AdminDashboard({ onExit }) {
  const {
    phoneData,
    updateNote,
    addNote,
    deleteNote,
    updateSmsMessage,
    updateWhatsappMessage,
    addWhatsappMessage,
    addGalleryMediaItem,
    addVoiceNoteItem,
    resetAllData,
  } = usePhoneData()

  const [activeTab, setActiveTab] = useState('lyrics')
  const [selectedNoteId, setSelectedNoteId] = useState(phoneData.notes[0]?.id || '')
  const [selectedSmsId, setSelectedSmsId] = useState(phoneData.smsThreads[0]?.id || '')
  const [selectedWaId, setSelectedWaId] = useState(phoneData.whatsappChats[0]?.id || '')
  const [waInjectText, setWaInjectText] = useState('')
  const [savedBanner, setSavedBanner] = useState('')
  const [copiedJson, setCopiedJson] = useState(false)

  // Cloudflare R2 upload states
  const [r2Progress, setR2Progress] = useState(0)
  const [r2Uploading, setR2Uploading] = useState(false)
  const [r2Logs, setR2Logs] = useState([])
  const mediaInputRef = useRef(null)
  const audioInputRef = useRef(null)

  const flashSaved = (msg) => {
    setSavedBanner(msg)
    setTimeout(() => setSavedBanner(''), 2000)
  }

  const currentNote = phoneData.notes.find((n) => n.id === selectedNoteId) || phoneData.notes[0]
  const currentSms = phoneData.smsThreads.find((t) => t.id === selectedSmsId) || phoneData.smsThreads[0]
  const currentWa = phoneData.whatsappChats.find((c) => c.id === selectedWaId) || phoneData.whatsappChats[0]

  const triggerR2Upload = async ({ targetType, file = null }) => {
    setR2Uploading(true)
    setR2Progress(0)
    const isMedia = targetType === 'media'
    const bucket = isMedia ? phoneData.backendTargets.r2Buckets.media : phoneData.backendTargets.r2Buckets.audio
    const prefix = isMedia ? 'camera-roll/2026/11' : 'acapellas/2026'

    const res = await mockUploadToCloudflareR2({
      file,
      bucket,
      prefix,
      onProgress: setR2Progress,
    })

    if (isMedia) {
      const isVideo = file?.type?.startsWith('video/')
      addGalleryMediaItem({
        id: `gal-r2-${Date.now()}`,
        type: isVideo ? 'video' : 'image',
        scene: 'rooftop-chai',
        filename: file ? res.filename : `IMG_R2_${Math.floor(1000 + Math.random() * 8999)}.JPG`,
        duration: isVideo ? '0:12' : undefined,
        durationSec: isVideo ? 12 : undefined,
        caption: file ? `Uploaded via R2 (${file.name})` : 'Synced from Cloudflare R2 Admin Vault',
        timestamp: 'Just now',
        cameraMeta: 'R2 Direct Upload · Unedited',
        location: 'Cloudflare R2 Edge',
        r2Bucket: res.r2Bucket,
        r2Key: res.r2Key,
        publicUrl: res.r2Uri,
        localObjectUrl: res.localObjectUrl,
      })
    } else {
      addVoiceNoteItem({
        id: `vn-r2-${Date.now()}`,
        title: file ? file.name.replace(/\.[^.]+$/, '') : `R2 Booth Master #${phoneData.voiceNotes.length + 1}`,
        tag: 'R2 · STUDIO SYNC',
        recordedAt: 'Just now',
        durationSec: 22,
        durationLabel: '0:22',
        location: 'Cloudflare R2 Bucket',
        r2Bucket: res.r2Bucket,
        r2Key: res.r2Key,
        publicUrl: res.r2Uri,
        localObjectUrl: res.localObjectUrl,
        cadenceBpm: 135,
        waveform: Array.from({ length: 36 }, () => Math.floor(22 + Math.random() * 72)),
      })
    }

    setR2Logs((prev) => [
      {
        id: Date.now(),
        uri: res.r2Uri,
        bucket: res.r2Bucket,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
      ...prev.slice(0, 4),
    ])
    setR2Uploading(false)
    flashSaved(`Uploaded to ${bucket}`)
  }

  const handleCopyJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(phoneData, null, 2)).catch(() => {})
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 1600)
  }

  return (
    <div className="w-full h-full bg-[#090c12] text-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <div className="px-3 pt-11 pb-2 bg-[#0f141e] border-b border-sky-500/20 flex items-center justify-between">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-0.5 text-sky-400 text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Lock
        </button>
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[12px] font-mono font-semibold tracking-tight text-white">
            ADMIN // FIREBASE + R2
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            resetAllData()
            flashSaved('Reset to initial JSON state')
          }}
          className="p-1 rounded text-neutral-400 hover:text-amber-400"
          title="Reset all data to defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sync Toast */}
      {savedBanner && (
        <div className="mx-3 mt-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[10.5px] font-mono flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          {savedBanner}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="px-2.5 pt-2 pb-1.5 flex items-center gap-1 overflow-x-auto border-b border-white/[0.06]">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium flex items-center gap-1 shrink-0 transition-colors ${
                active
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Form Workspace */}
      <div className="flex-1 overflow-y-auto phone-scroll px-3 py-3 pb-8 space-y-3">
        {/* TAB 1: LYRICS (Firestore 'notes' collection) */}
        {activeTab === 'lyrics' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-sky-400 uppercase">
                Firestore · collection(&apos;notes&apos;)
              </span>
              <button
                type="button"
                onClick={() => {
                  addNote({
                    title: 'ADMIN DRAFT 16',
                    dialect: 'Haryanvi',
                    bpm: 136,
                    body: 'Likho nayi bar yahan...',
                  })
                  flashSaved('Added note to Firestore state')
                }}
                className="px-2 py-1 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30 text-[10px] font-mono flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                New Sheet
              </button>
            </div>

            <select
              value={currentNote?.id || ''}
              onChange={(e) => setSelectedNoteId(e.target.value)}
              className="w-full bg-[#151b26] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11.5px] text-white focus:outline-none focus:border-sky-400"
            >
              {phoneData.notes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.title}
                </option>
              ))}
            </select>

            {currentNote && (
              <div className="space-y-2.5 p-2.5 rounded-xl bg-[#121722] border border-white/[0.07]">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Track / Note Title</label>
                  <input
                    type="text"
                    value={currentNote.title}
                    onChange={(e) => updateNote(currentNote.id, { title: e.target.value })}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11.5px] text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">Dialect</label>
                    <input
                      type="text"
                      value={currentNote.dialect}
                      onChange={(e) => updateNote(currentNote.id, { dialect: e.target.value })}
                      className="w-full bg-[#0b0f17] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">BPM</label>
                    <input
                      type="number"
                      value={currentNote.bpm || ''}
                      onChange={(e) => updateNote(currentNote.id, { bpm: Number(e.target.value) || null })}
                      className="w-full bg-[#0b0f17] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Lyrics Body</label>
                  <textarea
                    rows={8}
                    value={currentNote.body}
                    onChange={(e) => updateNote(currentNote.id, { body: e.target.value })}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-lg p-2 text-[11px] font-mono leading-relaxed text-slate-100 focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  {phoneData.notes.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => {
                        deleteNote(currentNote.id)
                        flashSaved('Deleted lyric sheet')
                      }}
                      className="text-[10.5px] text-rose-400 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={() => flashSaved('Synced lyrics to Firestore state')}
                    className="px-3 py-1.5 rounded-lg bg-sky-500 text-slate-950 text-[11px] font-semibold"
                  >
                    Save Lyrics
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SMS STRINGS */}
        {activeTab === 'sms' && (
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-sky-400 uppercase">
              Firestore · collection(&apos;smsThreads&apos;)
            </div>

            <select
              value={currentSms?.id || ''}
              onChange={(e) => setSelectedSmsId(e.target.value)}
              className="w-full bg-[#151b26] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11.5px] text-white"
            >
              {phoneData.smsThreads.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.displayTitle} ({t.tag})
                </option>
              ))}
            </select>

            {currentSms && (
              <div className="space-y-2.5 p-2.5 rounded-xl bg-[#121722] border border-white/[0.07]">
                {currentSms.messages.map((msg, idx) => (
                  <div key={msg.id}>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      Message #{idx + 1} ({msg.from})
                    </label>
                    <textarea
                      rows={4}
                      value={msg.text}
                      onChange={(e) => updateSmsMessage(currentSms.id, msg.id, e.target.value)}
                      className="w-full bg-[#0b0f17] border border-white/10 rounded-lg p-2 text-[11px] leading-relaxed text-white focus:outline-none focus:border-sky-400"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => flashSaved('Updated SMS string in state')}
                  className="w-full py-1.5 rounded-lg bg-sky-500 text-slate-950 text-[11px] font-semibold"
                >
                  Sync SMS Strings
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WHATSAPP MESSAGES */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-emerald-400 uppercase">
              Firestore · collection(&apos;whatsappChats&apos;)
            </div>

            <select
              value={currentWa?.id || ''}
              onChange={(e) => setSelectedWaId(e.target.value)}
              className="w-full bg-[#151b26] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11.5px] text-white"
            >
              {phoneData.whatsappChats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.messages.length} msgs)
                </option>
              ))}
            </select>

            {currentWa && (
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-[#121722] border border-white/[0.07] space-y-2">
                  <div className="text-[10px] font-mono text-slate-400">Edit Existing Messages</div>
                  {currentWa.messages.map((msg) => (
                    <div key={msg.id} className="space-y-1">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase">
                        {msg.sender === 'me' ? 'You (Rao Saab)' : currentWa.name} · {msg.time}
                      </span>
                      <input
                        type="text"
                        value={msg.text}
                        onChange={(e) => updateWhatsappMessage(currentWa.id, msg.id, e.target.value)}
                        className="w-full bg-[#0b0f17] border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-[#121722] border border-white/[0.07] space-y-2">
                  <div className="text-[10px] font-mono text-slate-400">
                    Simulate Incoming Reply from {currentWa.name}
                  </div>
                  <input
                    type="text"
                    value={waInjectText}
                    onChange={(e) => setWaInjectText(e.target.value)}
                    placeholder={`Type message as ${currentWa.name}...`}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!waInjectText.trim()) return
                      addWhatsappMessage(currentWa.id, waInjectText, 'them')
                      setWaInjectText('')
                      flashSaved(`Injected message from ${currentWa.name}`)
                    }}
                    className="w-full py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-semibold"
                  >
                    Push Incoming WhatsApp Message
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CLOUDFLARE R2 MOCK UPLOADER */}
        {activeTab === 'r2' && (
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-amber-400 uppercase">
              Cloudflare R2 · S3 Presigned Uploader
            </div>

            <div className="p-3 rounded-xl bg-[#121722] border border-amber-400/20 space-y-2.5">
              <div className="text-[11px] font-semibold">Bucket 1: pov-media-raw (Gallery)</div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Upload a local photo/video or trigger a mock R2 raw camera upload. Appears live in Gallery.
              </p>
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) triggerR2Upload({ targetType: 'media', file })
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={r2Uploading}
                  onClick={() => mediaInputRef.current?.click()}
                  className="py-2 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10.5px] font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Pick File → R2
                </button>
                <button
                  type="button"
                  disabled={r2Uploading}
                  onClick={() => triggerR2Upload({ targetType: 'media' })}
                  className="py-2 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[10.5px] font-medium border border-white/10 disabled:opacity-50"
                >
                  Mock R2 Photo
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#121722] border border-red-400/20 space-y-2.5">
              <div className="text-[11px] font-semibold">Bucket 2: pov-acapellas (Voice Memos)</div>
              <p className="text-[10px] text-slate-400 leading-snug">
                Upload a WAV/M4A acapella or simulate an R2 studio booth bounce.
              </p>
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) triggerR2Upload({ targetType: 'audio', file })
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={r2Uploading}
                  onClick={() => audioInputRef.current?.click()}
                  className="py-2 px-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-[10.5px] font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Pick Audio → R2
                </button>
                <button
                  type="button"
                  disabled={r2Uploading}
                  onClick={() => triggerR2Upload({ targetType: 'audio' })}
                  className="py-2 px-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[10.5px] font-medium border border-white/10 disabled:opacity-50"
                >
                  Mock Acapella
                </button>
              </div>
            </div>

            {r2Uploading && (
              <div className="p-2.5 rounded-lg bg-[#0b0f17] border border-sky-400/30 space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-sky-300">
                  <span>PUT presigned R2 chunk...</span>
                  <span>{r2Progress}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 transition-all duration-150" style={{ width: `${r2Progress}%` }} />
                </div>
              </div>
            )}

            {r2Logs.length > 0 && (
              <div className="space-y-1">
                <div className="text-[9.5px] font-mono text-slate-400 uppercase">Recent R2 Objects</div>
                {r2Logs.map((log) => (
                  <div
                    key={log.id}
                    className="px-2 py-1.5 rounded bg-[#0b0f17] border border-white/[0.06] text-[9.5px] font-mono text-emerald-300 truncate"
                  >
                    [{log.time}] {log.uri}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: LIVE JSON SCHEMA */}
        {activeTab === 'json' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-sky-400">Live Firestore + R2 JSON State</span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="px-2 py-1 rounded bg-white/10 text-[10px] font-mono flex items-center gap-1"
              >
                {copiedJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedJson ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre className="p-2.5 rounded-xl bg-[#05070b] border border-white/10 text-[9.5px] font-mono text-sky-200/90 overflow-x-auto max-h-[340px] leading-relaxed">
              {JSON.stringify(phoneData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

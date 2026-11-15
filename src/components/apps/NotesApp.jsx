import React, { useState } from 'react'
import { ChevronLeft, Pin, Plus, Sparkles, Edit3, Check } from 'lucide-react'
import { usePhoneData } from '../../context/PhoneDataContext'

const RHYME_PALETTE = [
  'bg-amber-400/20 text-amber-200 border-b border-amber-400/60',
  'bg-sky-400/20 text-sky-200 border-b border-sky-400/60',
  'bg-emerald-400/20 text-emerald-200 border-b border-emerald-400/60',
  'bg-rose-400/20 text-rose-200 border-b border-rose-400/60',
]

// Multi-syllable rhyme families across our Haryanvi & Khariboli verses
const RHYME_CLUSTERS = [
  ['pakke si chhaati', 'chhoti si zaati', 'dhool aur maati', 'utarti hai raati'],
  ['alfaaz ka kharcha', 'kaatein yeh parcha', 'sangeen charcha', 'kisi ke bhi karza'],
  ['lagate hain morcha', 'seedha sa sauda', 'wahin uge pauda'],
  ['goonje dastak', 'hille yeh mastak'],
  ['rakhe hum thanda', 'bheekh ka chanda'],
  ['jaag ke kheencha', 'bagicha hai seencha'],
  ['kaampe yeh seena', 'pathar ki meena'],
  ['gaadi chalayi', 'dekhi ladai'],
  ['gehra nishaan', 'chhat pe toofan'],
]

function renderHighlightedLyrics(text) {
  return text.split('\n').map((line, lineIdx) => {
    let segments = [{ text: line, style: null }]

    RHYME_CLUSTERS.forEach((cluster, cIdx) => {
      const style = RHYME_PALETTE[cIdx % RHYME_PALETTE.length]
      const nextSegments = []
      segments.forEach((seg) => {
        if (seg.style) {
          nextSegments.push(seg)
          return
        }
        let working = seg.text
        let matched = false
        for (const phrase of cluster) {
          const idx = working.toLowerCase().indexOf(phrase.toLowerCase())
          if (idx !== -1) {
            if (idx > 0) nextSegments.push({ text: working.slice(0, idx), style: null })
            nextSegments.push({ text: working.slice(idx, idx + phrase.length), style })
            const rest = working.slice(idx + phrase.length)
            if (rest) nextSegments.push({ text: rest, style: null })
            matched = true
            break
          }
        }
        if (!matched) nextSegments.push(seg)
      })
      segments = nextSegments
    })

    return (
      <div key={lineIdx} className="min-h-[1.35em]">
        {segments.map((seg, i) =>
          seg.style ? (
            <span key={i} className={`px-1 rounded-sm font-medium ${seg.style}`}>
              {seg.text}
            </span>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
    )
  })
}

export default function NotesApp({ onClose }) {
  const { phoneData, updateNote, addNote } = usePhoneData()
  const [activeNoteId, setActiveNoteId] = useState(null)
  const [highlightRhymes, setHighlightRhymes] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [draftBody, setDraftBody] = useState('')

  const activeNote = phoneData.notes.find((n) => n.id === activeNoteId) || null

  const openNote = (note) => {
    setActiveNoteId(note.id)
    setDraftBody(note.body)
    setIsEditing(false)
  }

  const handleSave = () => {
    if (!activeNote) return
    updateNote(activeNote.id, { body: draftBody })
    setIsEditing(false)
  }

  const handleCreateQuickNote = () => {
    addNote({
      title: 'NEW CYPHER 8-BAR',
      dialect: 'Haryanvi / Khariboli',
      bpm: 132,
      body: 'Likho apni agli line yahan...\n',
      rhymeNotes: 'Tap Edit to write bars.',
    })
  }

  if (activeNote) {
    return (
      <div className="w-full h-full bg-[#151412] text-[#f4efe6] flex flex-col">
        {/* Notepad Header */}
        <div className="px-3.5 pt-11 pb-2.5 flex items-center justify-between border-b border-amber-200/10">
          <button
            type="button"
            onClick={() => setActiveNoteId(null)}
            className="flex items-center gap-0.5 text-amber-400 text-xs font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Notes
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHighlightRhymes((v) => !v)}
              className={`px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 border transition-colors ${
                highlightRhymes
                  ? 'bg-amber-400/15 text-amber-300 border-amber-400/40'
                  : 'bg-white/5 text-neutral-400 border-white/10'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              Rhymes
            </button>
            <button
              type="button"
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="px-2 py-1 rounded-full bg-amber-400 text-black text-[10px] font-semibold flex items-center gap-1"
            >
              {isEditing ? <Check className="w-2.5 h-2.5" /> : <Edit3 className="w-2.5 h-2.5" />}
              {isEditing ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Note Body */}
        <div className="flex-1 overflow-y-auto phone-scroll px-4 py-3 pb-8 space-y-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400/80 uppercase tracking-wider">
              <span>{activeNote.dialect}</span>
              {activeNote.bpm && <span>· {activeNote.bpm} BPM</span>}
            </div>
            <h2 className="text-[15px] font-bold text-[#faf6ee] mt-0.5 leading-snug">{activeNote.title}</h2>
            <p className="text-[10px] text-neutral-500 mt-0.5">{activeNote.updatedAt}</p>
          </div>

          {isEditing ? (
            <textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={15}
              className="w-full bg-[#1e1c18] border border-amber-200/15 rounded-lg p-2.5 text-[12px] leading-relaxed text-[#f4efe6] font-mono focus:outline-none focus:border-amber-400/60 resize-none"
            />
          ) : (
            <div className="text-[12px] leading-[1.65] text-[#ebe4d7] font-sans whitespace-pre-wrap">
              {highlightRhymes ? renderHighlightedLyrics(activeNote.body) : activeNote.body}
            </div>
          )}

          {activeNote.rhymeNotes && (
            <div className="mt-3 p-2.5 rounded-lg bg-[#1d1b17] border border-amber-300/15 text-[10px] text-amber-200/80 leading-relaxed">
              <span className="font-mono uppercase text-amber-400 block mb-0.5">Scheme Breakdown</span>
              {activeNote.rhymeNotes}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-[#151412] text-[#f4efe6] flex flex-col">
      <div className="px-3.5 pt-11 pb-2.5 flex items-center justify-between border-b border-white/[0.06]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-0.5 text-amber-400 text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <div className="text-[13px] font-semibold">Notes</div>
        <button
          type="button"
          onClick={handleCreateQuickNote}
          className="p-1 text-amber-400 hover:bg-amber-400/10 rounded-full"
          aria-label="New note"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 pt-3 pb-1.5 flex items-baseline justify-between">
        <h1 className="text-xl font-bold tracking-tight text-[#faf6ee]">Lyrics Vault</h1>
        <span className="text-[10px] font-mono text-neutral-500">{phoneData.notes.length} SHEETS</span>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll px-3.5 py-2 pb-7 space-y-2">
        {phoneData.notes.map((note) => {
          const previewLine =
            note.body
              .split('\n')
              .find((l) => l.trim() && !l.trim().startsWith('[')) || ''
          return (
            <button
              key={note.id}
              type="button"
              onClick={() => openNote(note)}
              className="w-full text-left p-3 rounded-xl bg-[#1e1d1a] hover:bg-[#252320] border border-white/[0.06] transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {note.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                  <span className="text-[12.5px] font-semibold text-[#faf6ee] truncate">{note.title}</span>
                </div>
                {note.bpm && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 shrink-0">
                    {note.bpm} BPM
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 truncate mt-1">{previewLine}</p>
              <div className="flex items-center justify-between mt-1.5 text-[9.5px] text-neutral-500 font-mono">
                <span>{note.dialect}</span>
                <span>{note.updatedAt}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { ChevronLeft, Phone, ExternalLink, Copy, Check, Search } from 'lucide-react'
import { usePhoneData } from '../../context/PhoneDataContext'

export default function ContactsApp({ onClose }) {
  const { phoneData } = usePhoneData()
  const [copiedId, setCopiedId] = useState(null)
  const [query, setQuery] = useState('')

  const filtered = phoneData.contacts.filter((c) =>
    `${c.displayName} ${c.platform} ${c.phoneStyledNumber}`.toLowerCase().includes(query.toLowerCase())
  )

  const handleCopy = (e, contact) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard?.writeText(contact.phoneStyledNumber).catch(() => {})
    setCopiedId(contact.id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <div className="w-full h-full bg-[#0b0d10] text-white flex flex-col">
      {/* Header */}
      <div className="px-3.5 pt-11 pb-2.5 flex items-center justify-between border-b border-white/[0.06]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-0.5 text-sky-400 text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <div className="text-[13px] font-semibold">Contacts</div>
        <span className="text-[10px] font-mono text-neutral-500">SOCIALS</span>
      </div>

      {/* My Card / Search */}
      <div className="px-3.5 pt-3 pb-2 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search numbers & socials"
            className="w-full bg-[#181b21] border border-white/[0.07] rounded-xl pl-8 pr-3 py-1.5 text-[11.5px] text-white placeholder:text-neutral-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center font-bold text-xs">
            RS
          </div>
          <div>
            <div className="text-[12.5px] font-semibold">Rao Saab</div>
            <div className="text-[10px] text-neutral-400 font-mono">My Card · Tap a number to open profile</div>
          </div>
        </div>
      </div>

      {/* Phone-number-styled Social Profiles acting as external hyperlink buttons */}
      <div className="flex-1 overflow-y-auto phone-scroll px-3.5 py-1 pb-8 space-y-2.5">
        <div className="text-[10px] font-mono text-neutral-500 uppercase px-0.5">
          Quick Dial · Social Lines ({filtered.length})
        </div>

        {filtered.map((contact) => (
          <a
            key={contact.id}
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-2xl bg-[#14171d] hover:bg-[#1a1f28] border border-white/[0.08] hover:border-sky-400/40 transition-all group"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${contact.badgeColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-md`}
                >
                  {contact.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-sky-400 tracking-wider">{contact.carrierTag}</div>
                  <div className="text-[13.5px] font-mono font-semibold text-white tracking-tight flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{contact.phoneStyledNumber}</span>
                  </div>
                  <div className="text-[10.5px] text-neutral-400 truncate mt-0.5">{contact.subLabel}</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                  Open
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, contact)}
                  className="text-[9.5px] text-neutral-400 hover:text-white flex items-center gap-1 px-1"
                  aria-label="Copy styled number"
                >
                  {copiedId === contact.id ? (
                    <>
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-2.5 h-2.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </a>
        ))}

        <div className="pt-2 text-center text-[10px] font-mono text-neutral-500">
          All social numbers route externally via HTTPS
        </div>
      </div>
    </div>
  )
}

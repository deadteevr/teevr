import React, { useState } from 'react'
import { ChevronLeft, Send, ShieldAlert, MessageSquare } from 'lucide-react'
import { usePhoneData } from '../../context/PhoneDataContext'

export default function MessagesApp({ onClose }) {
  const { phoneData, addSmsReply, markSmsRead } = usePhoneData()
  const [activeThreadId, setActiveThreadId] = useState(null)
  const [replyText, setReplyText] = useState('')

  const activeThread = phoneData.smsThreads.find((t) => t.id === activeThreadId) || null

  const openThread = (thread) => {
    markSmsRead(thread.id)
    setActiveThreadId(thread.id)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!activeThread || !replyText.trim()) return
    addSmsReply(activeThread.id, replyText, 'me')
    setReplyText('')
  }

  if (activeThread) {
    return (
      <div className="w-full h-full bg-[#090b0e] text-white flex flex-col">
        {/* Thread Header */}
        <div className="px-3 pt-11 pb-2.5 flex items-center justify-between border-b border-white/[0.08] bg-[#11141a]">
          <button
            type="button"
            onClick={() => setActiveThreadId(null)}
            className="flex items-center gap-0.5 text-sky-400 text-xs font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Inbox
          </button>
          <div className="text-center">
            <div className="text-[12px] font-semibold">{activeThread.displayTitle}</div>
            <div className="text-[9px] font-mono text-neutral-400">{activeThread.sender} · SMS/MMS</div>
          </div>
          <div className="w-10" />
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto phone-scroll px-3 py-3 space-y-2.5">
          <div className="text-center text-[9.5px] font-mono text-neutral-500 my-1">
            Text Message · {activeThread.time}
          </div>

          {activeThread.messages.map((msg) => {
            const isMe = msg.from === 'me'
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[84%] px-3 py-2 rounded-2xl text-[12px] leading-relaxed ${
                    isMe
                      ? 'bg-[#22c55e] text-black font-medium rounded-br-sm'
                      : 'bg-[#20242c] text-neutral-100 rounded-bl-sm border border-white/[0.06]'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-neutral-500 mt-0.5 px-1">{msg.time}</span>
              </div>
            )
          })}
        </div>

        {/* Reply Bar */}
        <form
          onSubmit={handleSend}
          className="px-3 pb-7 pt-2 border-t border-white/[0.07] bg-[#0e1116] flex items-center gap-2"
        >
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Text Message · SMS"
            className="flex-1 bg-[#1b1f27] border border-white/10 rounded-full px-3.5 py-1.5 text-[12px] text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/60"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="w-8 h-8 rounded-full bg-emerald-500 disabled:bg-neutral-700 text-black flex items-center justify-center shrink-0 transition-colors"
            aria-label="Send SMS"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-[#090b0e] text-white flex flex-col">
      {/* Header */}
      <div className="px-3.5 pt-11 pb-2.5 flex items-center justify-between border-b border-white/[0.07]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-0.5 text-sky-400 text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <div className="text-[13px] font-semibold">Messages</div>
        <MessageSquare className="w-4 h-4 text-emerald-400" />
      </div>

      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">SMS Inbox</h1>
        <span className="text-[9.5px] font-mono text-amber-400/90 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3" />
          FILTERED
        </span>
      </div>

      {/* SMS Thread List */}
      <div className="flex-1 overflow-y-auto phone-scroll divide-y divide-white/[0.06] pb-7">
        {phoneData.smsThreads.map((thread) => {
          const lastMsg = thread.messages[thread.messages.length - 1]
          return (
            <button
              key={thread.id}
              type="button"
              onClick={() => openThread(thread)}
              className="w-full text-left px-3.5 py-3 hover:bg-white/[0.04] transition-colors flex items-start gap-2.5"
            >
              <div className="relative mt-0.5 shrink-0">
                <div className="w-9 h-9 rounded-full bg-[#1e242f] border border-white/10 flex items-center justify-center text-[11px] font-bold text-neutral-200">
                  {thread.avatarText}
                </div>
                {thread.unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 absolute -left-1 top-1/2 -translate-y-1/2 ring-2 ring-[#090b0e]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[12.5px] font-semibold truncate">{thread.displayTitle}</span>
                    <span
                      className={`text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                        thread.tag.includes('OFFICIAL')
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : thread.tag.includes('OTP')
                          ? 'bg-sky-500/15 text-sky-400'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {thread.tag}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 shrink-0">{thread.time}</span>
                </div>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 leading-snug">
                  {lastMsg?.text}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

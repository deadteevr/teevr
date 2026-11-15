import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, Send, CheckCheck, Play, Pause, Phone, Video, Lock } from 'lucide-react'
import { usePhoneData } from '../../context/PhoneDataContext'
import { audioEngine } from '../../services/audioSynth'

export default function WhatsAppApp({ onClose }) {
  const { phoneData, addWhatsappMessage, markWhatsappRead } = usePhoneData()
  const [activeChatId, setActiveChatId] = useState('wa-1')
  const [showList, setShowList] = useState(true)
  const [draft, setDraft] = useState('')
  const [playingVoiceId, setPlayingVoiceId] = useState(null)
  const messagesEndRef = useRef(null)

  const activeChat = phoneData.whatsappChats.find((c) => c.id === activeChatId) || phoneData.whatsappChats[0]

  useEffect(() => () => audioEngine.stopLoop(), [])

  useEffect(() => {
    if (!showList) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [activeChat?.messages.length, showList])

  const openChat = (chat) => {
    markWhatsappRead(chat.id)
    setActiveChatId(chat.id)
    setShowList(false)
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!draft.trim() || !activeChat) return
    addWhatsappMessage(activeChat.id, draft, 'me')
    setDraft('')
  }

  const toggleVoiceBubble = (msgId) => {
    if (playingVoiceId === msgId) {
      audioEngine.stopLoop()
      setPlayingVoiceId(null)
    } else {
      audioEngine.startAcapellaSim(124)
      setPlayingVoiceId(msgId)
      setTimeout(() => {
        audioEngine.stopLoop()
        setPlayingVoiceId(null)
      }, 4500)
    }
  }

  // Native WhatsApp Chat Thread View
  if (!showList && activeChat) {
    return (
      <div className="w-full h-full wa-bg-pattern text-white flex flex-col">
        {/* Native WhatsApp Header */}
        <div className="px-2.5 pt-11 pb-2 bg-[#1f2c34] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                audioEngine.stopLoop()
                setShowList(true)
              }}
              className="flex items-center text-[#00a884] text-xs font-medium pr-0.5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div
              className={`w-8 h-8 rounded-full ${activeChat.avatarColor} flex items-center justify-center text-[11px] font-bold shrink-0`}
            >
              {activeChat.initials}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold leading-tight truncate">{activeChat.name}</div>
              <div className="text-[10px] text-[#8696a0] truncate">{activeChat.subtitle}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#8696a0] pr-1">
            <Video className="w-4 h-4" />
            <Phone className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Chat Bubbles */}
        <div className="flex-1 overflow-y-auto phone-scroll px-3 py-2.5 space-y-2">
          <div className="mx-auto w-fit max-w-[85%] px-2.5 py-1 rounded-lg bg-[#182229]/90 text-[9.5px] text-[#ffd279] flex items-center gap-1 text-center shadow">
            <Lock className="w-2.5 h-2.5 shrink-0" />
            Messages are end-to-end encrypted.
          </div>

          {activeChat.messages.map((msg) => {
            const isMe = msg.sender === 'me'
            const isVoicePlaying = playingVoiceId === msg.id
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`relative max-w-[82%] px-2.5 py-1.5 rounded-xl text-[12px] leading-snug shadow-sm ${
                    isMe
                      ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                      : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
                  }`}
                >
                  {/* Native bubble tail */}
                  <span
                    className={`absolute top-0 w-2.5 h-2.5 ${
                      isMe
                        ? '-right-1.5 bg-[#005c4b] [clip-path:polygon(0_0,100%_0,0_100%)]'
                        : '-left-1.5 bg-[#202c33] [clip-path:polygon(0_0,100%_0,100%_100%)]'
                    }`}
                  />

                  {msg.isVoiceNote ? (
                    <div className="flex items-center gap-2 py-0.5 min-w-[165px]">
                      <button
                        type="button"
                        onClick={() => toggleVoiceBubble(msg.id)}
                        className="w-7 h-7 rounded-full bg-[#00a884] text-[#0b141a] flex items-center justify-center shrink-0"
                      >
                        {isVoicePlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-[2px] h-4">
                          {[35, 70, 50, 85, 60, 90, 45, 75, 55, 40, 80, 50, 65, 30].map((h, i) => (
                            <span
                              key={i}
                              className={`flex-1 rounded-full ${
                                isVoicePlaying ? 'bg-[#53bdeb] animate-pulse' : 'bg-[#8696a0]/70'
                              }`}
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] text-[#8696a0]">{msg.voiceDuration || '0:14'}</span>
                      </div>
                    </div>
                  ) : (
                    <span>{msg.text}</span>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5">
                    <span className="text-[9px] text-[#8696a0]">{msg.time}</span>
                    {isMe && (
                      <CheckCheck
                        className={`w-3 h-3 ${
                          msg.status === 'read' ? 'text-[#53bdeb]' : 'text-[#8696a0]'
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Native WhatsApp Composer */}
        <form
          onSubmit={handleSend}
          className="px-2.5 pb-7 pt-2 bg-[#1f2c34]/95 flex items-center gap-2 border-t border-white/[0.05]"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message"
            className="flex-1 bg-[#2a3942] rounded-full px-3.5 py-1.5 text-[12px] text-white placeholder:text-[#8696a0] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="w-8 h-8 rounded-full bg-[#00a884] disabled:bg-[#2a3942] text-[#0b141a] disabled:text-[#8696a0] flex items-center justify-center shrink-0 transition-colors"
            aria-label="Send WhatsApp message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    )
  }

  // WhatsApp Chats List View
  return (
    <div className="w-full h-full bg-[#0b141a] text-white flex flex-col">
      <div className="px-3.5 pt-11 pb-2.5 bg-[#1f2c34] flex items-center justify-between border-b border-white/[0.06]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-0.5 text-[#00a884] text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Home
        </button>
        <div className="text-[14px] font-bold tracking-tight">WhatsApp</div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll divide-y divide-white/[0.05] pb-7">
        {phoneData.whatsappChats.map((chat) => {
          const last = chat.messages[chat.messages.length - 1]
          return (
            <button
              key={chat.id}
              type="button"
              onClick={() => openChat(chat)}
              className="w-full text-left px-3.5 py-3 hover:bg-white/[0.04] transition-colors flex items-center gap-3"
            >
              <div className="relative shrink-0">
                <div
                  className={`w-11 h-11 rounded-full ${chat.avatarColor} flex items-center justify-center font-bold text-xs`}
                >
                  {chat.initials}
                </div>
                {chat.online && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00a884] ring-2 ring-[#0b141a] absolute bottom-0 right-0" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold truncate">{chat.name}</span>
                  <span className={`text-[10px] shrink-0 ${chat.unreadCount > 0 ? 'text-[#00a884]' : 'text-[#8696a0]'}`}>
                    {last?.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-[11.5px] text-[#8696a0] truncate flex items-center gap-1">
                    {last?.sender === 'me' && <CheckCheck className="w-3 h-3 text-[#53bdeb] shrink-0" />}
                    {last?.text}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#00a884] text-[#0b141a] text-[10px] font-bold flex items-center justify-center shrink-0">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'
import { motion } from 'framer-motion'
import {
  Image as ImageIcon,
  FileText,
  Music,
  Mic,
  UserSquare2,
  MessageSquare,
  MessageCircle,
  Radio,
} from 'lucide-react'
import { usePhoneData } from '../context/PhoneDataContext'
import { audioEngine } from '../services/audioSynth'

export default function HomeScreen({ onOpenApp, onLock }) {
  const { phoneData } = usePhoneData()

  const smsUnread = phoneData.smsThreads.filter((t) => t.unread).length
  const waUnread = phoneData.whatsappChats.reduce((acc, c) => acc + (c.unreadCount || 0), 0)

  const apps = [
    {
      id: 'gallery',
      label: 'Gallery',
      icon: ImageIcon,
      gradient: 'from-neutral-100 via-stone-200 to-neutral-300 text-neutral-900',
      badge: 0,
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      gradient: 'from-amber-300 via-amber-400 to-orange-500 text-stone-950',
      badge: 0,
    },
    {
      id: 'music',
      label: 'Music',
      icon: Music,
      gradient: 'from-rose-500 via-pink-600 to-red-700 text-white',
      badge: 0,
    },
    {
      id: 'voice',
      label: 'Voice Memos',
      icon: Mic,
      gradient: 'from-zinc-800 via-neutral-900 to-black text-red-500 border border-red-500/40',
      badge: 0,
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: UserSquare2,
      gradient: 'from-sky-400 via-blue-600 to-indigo-700 text-white',
      badge: 0,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      gradient: 'from-emerald-400 via-green-500 to-emerald-700 text-white',
      badge: smsUnread,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      gradient: 'from-[#25D366] via-[#128C7E] to-[#075E54] text-white',
      badge: waUnread,
    },
  ]

  const handleTapApp = (appId) => {
    audioEngine.playClick(740, 0.03, 0.035)
    onOpenApp(appId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full h-full relative flex flex-col justify-between px-4 pt-12 pb-4 select-none overflow-hidden"
    >
      {/* Home Wallpaper */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 20% 15%, rgba(14, 165, 233, 0.26), transparent 48%), radial-gradient(circle at 82% 76%, rgba(249, 115, 22, 0.2), transparent 50%), linear-gradient(165deg, #0b1220 0%, #070a10 55%, #110c0a 100%)',
        }}
      />

      {/* Top Artist Studio Status Widget */}
      <div className="mt-1 p-3 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-sky-300">
              SMART-LINK · GGN STUDIO
            </span>
          </div>
          <button
            type="button"
            onClick={onLock}
            className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-white/75 hover:text-white border border-white/10"
          >
            Lock
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="text-[13px] font-bold text-white leading-tight">Khariboli Kartus</div>
            <div className="text-[10px] text-white/65">4 lyric sheets · 3 raw booth takes</div>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* 7-App Grid */}
      <div className="grid grid-cols-4 gap-x-2.5 gap-y-4 my-auto px-0.5">
        {apps.map((app, i) => {
          const Icon = app.icon
          return (
            <motion.button
              key={app.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 * i, duration: 0.22 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTapApp(app.id)}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <div className="relative">
                <div
                  className={`w-[54px] h-[54px] rounded-[16px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.45)] group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" strokeWidth={2.1} />
                </div>
                {app.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow ring-2 ring-[#0b101b]">
                    {app.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium text-white/90 tracking-tight text-center leading-tight line-clamp-1">
                {app.label}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Bottom Dock */}
      <div className="space-y-2.5">
        <div className="p-2 rounded-[22px] bg-white/[0.11] backdrop-blur-xl border border-white/[0.14] grid grid-cols-4 gap-2">
          {['contacts', 'messages', 'whatsapp', 'music'].map((dockId) => {
            const item = apps.find((a) => a.id === dockId)
            const Icon = item.icon
            return (
              <button
                key={dockId}
                type="button"
                onClick={() => handleTapApp(dockId)}
                className="flex items-center justify-center active:scale-90 transition-transform relative"
                aria-label={item.label}
              >
                <div
                  className={`w-11 h-11 rounded-[13px] bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md`}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.1} />
                </div>
                {item.badge > 0 && (
                  <span className="absolute -top-1 right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Home indicator */}
        <div className="mx-auto w-28 h-1 rounded-full bg-white/55" />
      </div>
    </motion.div>
  )
}

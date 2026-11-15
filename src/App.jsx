import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PhoneDataProvider, usePhoneData } from './context/PhoneDataContext'
import SmartGlassesStage from './components/SmartGlassesStage'
import StatusBar from './components/StatusBar'
import LockScreen from './components/LockScreen'
import HomeScreen from './components/HomeScreen'
import GalleryApp from './components/apps/GalleryApp'
import NotesApp from './components/apps/NotesApp'
import MusicApp from './components/apps/MusicApp'
import VoiceRecorderApp from './components/apps/VoiceRecorderApp'
import ContactsApp from './components/apps/ContactsApp'
import MessagesApp from './components/apps/MessagesApp'
import WhatsAppApp from './components/apps/WhatsAppApp'
import AdminPinModal from './components/admin/AdminPinModal'
import AdminDashboard from './components/admin/AdminDashboard'
import { audioEngine } from './services/audioSynth'

function PhoneOS() {
  const { phoneData } = usePhoneData()

  // Initial State: completely black screen ('off')
  const [screenMode, setScreenMode] = useState('off') // 'off' | 'lock' | 'home' | 'admin'
  const [activeApp, setActiveApp] = useState(null) // null | 'gallery' | 'notes' | 'music' | 'voice' | 'contacts' | 'messages' | 'whatsapp'
  const [showPinModal, setShowPinModal] = useState(false)

  const smsUnread = phoneData.smsThreads.filter((t) => t.unread).length
  const waUnread = phoneData.whatsappChats.reduce((acc, c) => acc + (c.unreadCount || 0), 0)

  const handleTogglePower = () => {
    audioEngine.stopLoop()
    if (screenMode === 'off') {
      audioEngine.playClick(920, 0.04, 0.04)
      setScreenMode('lock')
      setActiveApp(null)
      setShowPinModal(false)
    } else {
      audioEngine.playClick(420, 0.035, 0.035)
      setScreenMode('off')
      setActiveApp(null)
      setShowPinModal(false)
    }
  }

  const handleCloseApp = () => {
    audioEngine.stopLoop()
    setActiveApp(null)
  }

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'gallery':
        return <GalleryApp onClose={handleCloseApp} />
      case 'notes':
        return <NotesApp onClose={handleCloseApp} />
      case 'music':
        return <MusicApp onClose={handleCloseApp} />
      case 'voice':
        return <VoiceRecorderApp onClose={handleCloseApp} />
      case 'contacts':
        return <ContactsApp onClose={handleCloseApp} />
      case 'messages':
        return <MessagesApp onClose={handleCloseApp} />
      case 'whatsapp':
        return <WhatsAppApp onClose={handleCloseApp} />
      default:
        return null
    }
  }

  return (
    <SmartGlassesStage isScreenOn={screenMode !== 'off'} onTogglePower={handleTogglePower}>
      {/* Completely Black OLED Initial State */}
      {screenMode === 'off' && (
        <div className="w-full h-full bg-black flex flex-col items-center justify-end pb-12 px-6 text-center">
          <button
            type="button"
            onClick={handleTogglePower}
            className="sm:hidden px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/35 text-[11px] font-mono text-sky-300"
          >
            Tap Power Button on Right Edge
          </button>
        </div>
      )}

      {/* Active Screen OS */}
      {screenMode !== 'off' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.28 }}
          className="w-full h-full relative bg-black"
        >
          <StatusBar
            showTime={screenMode !== 'lock'}
            carrier={phoneData.deviceMeta.carrier}
            battery={phoneData.deviceMeta.batteryPercent}
          />

          {/* Lock Screen */}
          {screenMode === 'lock' && (
            <LockScreen
              smsUnread={smsUnread}
              waUnread={waUnread}
              onUnlock={() => {
                setShowPinModal(false)
                setScreenMode('home')
              }}
              onSecretAdminTrigger={() => setShowPinModal(true)}
            />
          )}

          {/* Home Screen + App Transitions */}
          {screenMode === 'home' && (
            <>
              <HomeScreen
                onOpenApp={(appId) => setActiveApp(appId)}
                onLock={() => {
                  audioEngine.stopLoop()
                  setActiveApp(null)
                  setScreenMode('lock')
                }}
              />

              <AnimatePresence>
                {activeApp && (
                  <motion.div
                    key={activeApp}
                    initial={{ opacity: 0, scale: 0.9, y: 26, borderRadius: '32px' }}
                    animate={{ opacity: 1, scale: 1, y: 0, borderRadius: '0px' }}
                    exit={{ opacity: 0, scale: 0.9, y: 26, borderRadius: '32px' }}
                    transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                    className="absolute inset-0 z-20 overflow-hidden bg-black"
                  >
                    {renderActiveApp()}

                    {/* Bottom Home Gesture Bar */}
                    <button
                      type="button"
                      onClick={handleCloseApp}
                      aria-label="Return to Home Screen"
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-40 py-1.5 px-8 group"
                    >
                      <span className="block w-28 h-1 rounded-full bg-white/55 group-hover:bg-white transition-colors" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Secret Admin Dashboard View */}
          {screenMode === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 z-30"
            >
              <AdminDashboard onExit={() => setScreenMode('lock')} />
            </motion.div>
          )}

          {/* Hidden PIN Pad Modal triggered by 5x tap on Lock Screen time */}
          <AnimatePresence>
            {showPinModal && screenMode === 'lock' && (
              <AdminPinModal
                expectedPin={phoneData.adminConfig.pin}
                onCancel={() => setShowPinModal(false)}
                onSuccess={() => {
                  setShowPinModal(false)
                  setScreenMode('admin')
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </SmartGlassesStage>
  )
}

export default function App() {
  return (
    <PhoneDataProvider>
      <PhoneOS />
    </PhoneDataProvider>
  )
}

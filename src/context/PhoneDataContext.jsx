import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { initialPhoneState } from '../data/initialPhoneState'
import { loadPhoneState, savePhoneState, clearPhoneState } from '../services/storageAdapter'

const PhoneDataContext = createContext(null)

export function PhoneDataProvider({ children }) {
  const [phoneData, setPhoneData] = useState(() => loadPhoneState(initialPhoneState))

  useEffect(() => {
    savePhoneState(phoneData)
  }, [phoneData])

  // --- NOTES / LYRICS ---
  const updateNote = useCallback((noteId, patch) => {
    setPhoneData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === noteId ? { ...n, ...patch, updatedAt: 'Just now' } : n)),
    }))
  }, [])

  const addNote = useCallback((newNote) => {
    setPhoneData((prev) => ({
      ...prev,
      notes: [
        {
          id: `note-${Date.now()}`,
          title: newNote.title || 'UNTITLED BARS',
          dialect: newNote.dialect || 'Haryanvi / Khariboli',
          bpm: newNote.bpm ?? 130,
          updatedAt: 'Just now',
          pinned: false,
          rhymeTokens: [],
          body: newNote.body || '',
          rhymeNotes: newNote.rhymeNotes || '',
        },
        ...prev.notes,
      ],
    }))
  }, [])

  const deleteNote = useCallback((noteId) => {
    setPhoneData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== noteId),
    }))
  }, [])

  // --- SMS / MESSAGES ---
  const updateSmsMessage = useCallback((threadId, messageId, newText) => {
    setPhoneData((prev) => ({
      ...prev,
      smsThreads: prev.smsThreads.map((t) =>
        t.id !== threadId
          ? t
          : {
              ...t,
              messages: t.messages.map((m) => (m.id === messageId ? { ...m, text: newText } : m)),
            }
      ),
    }))
  }, [])

  const updateSmsThreadMeta = useCallback((threadId, patch) => {
    setPhoneData((prev) => ({
      ...prev,
      smsThreads: prev.smsThreads.map((t) => (t.id === threadId ? { ...t, ...patch } : t)),
    }))
  }, [])

  const addSmsReply = useCallback((threadId, text, from = 'me') => {
    const trimmed = text.trim()
    if (!trimmed) return
    setPhoneData((prev) => ({
      ...prev,
      smsThreads: prev.smsThreads.map((t) =>
        t.id !== threadId
          ? t
          : {
              ...t,
              unread: false,
              time: 'Now',
              messages: [
                ...t.messages,
                {
                  id: `sms-msg-${Date.now()}`,
                  from,
                  time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                  text: trimmed,
                },
              ],
            }
      ),
    }))
  }, [])

  const markSmsRead = useCallback((threadId) => {
    setPhoneData((prev) => ({
      ...prev,
      smsThreads: prev.smsThreads.map((t) => (t.id === threadId ? { ...t, unread: false } : t)),
    }))
  }, [])

  // --- WHATSAPP ---
  const addWhatsappMessage = useCallback((chatId, text, sender = 'me') => {
    const trimmed = text.trim()
    if (!trimmed) return
    setPhoneData((prev) => ({
      ...prev,
      whatsappChats: prev.whatsappChats.map((c) =>
        c.id !== chatId
          ? c
          : {
              ...c,
              unreadCount: 0,
              messages: [
                ...c.messages,
                {
                  id: `wa-msg-${Date.now()}`,
                  sender,
                  text: trimmed,
                  time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
                  status: 'read',
                },
              ],
            }
      ),
    }))
  }, [])

  const updateWhatsappMessage = useCallback((chatId, messageId, newText) => {
    setPhoneData((prev) => ({
      ...prev,
      whatsappChats: prev.whatsappChats.map((c) =>
        c.id !== chatId
          ? c
          : {
              ...c,
              messages: c.messages.map((m) => (m.id === messageId ? { ...m, text: newText } : m)),
            }
      ),
    }))
  }, [])

  const markWhatsappRead = useCallback((chatId) => {
    setPhoneData((prev) => ({
      ...prev,
      whatsappChats: prev.whatsappChats.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)),
    }))
  }, [])

  // --- GALLERY & VOICE RECORDER (R2 UPLOAD INJECTION) ---
  const addGalleryMediaItem = useCallback((item) => {
    setPhoneData((prev) => ({
      ...prev,
      galleryMedia: [item, ...prev.galleryMedia],
    }))
  }, [])

  const addVoiceNoteItem = useCallback((item) => {
    setPhoneData((prev) => ({
      ...prev,
      voiceNotes: [item, ...prev.voiceNotes],
    }))
  }, [])

  const resetAllData = useCallback(() => {
    clearPhoneState()
    setPhoneData(initialPhoneState)
  }, [])

  return (
    <PhoneDataContext.Provider
      value={{
        phoneData,
        updateNote,
        addNote,
        deleteNote,
        updateSmsMessage,
        updateSmsThreadMeta,
        addSmsReply,
        markSmsRead,
        addWhatsappMessage,
        updateWhatsappMessage,
        markWhatsappRead,
        addGalleryMediaItem,
        addVoiceNoteItem,
        resetAllData,
      }}
    >
      {children}
    </PhoneDataContext.Provider>
  )
}

export function usePhoneData() {
  const ctx = useContext(PhoneDataContext)
  if (!ctx) throw new Error('usePhoneData must be used inside PhoneDataProvider')
  return ctx
}

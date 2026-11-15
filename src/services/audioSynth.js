/**
 * Lightweight Web Audio API Synthesizer for Music Previews,
 * Voice Recorder Studio Acapellas, and Tactile UI Feedback.
 */

class PovAudioEngine {
  constructor() {
    this.ctx = null
    this.loopTimer = null
    this.isPlaying = false
  }

  ensureContext() {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return null
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  playClick(freq = 640, duration = 0.035, gainVal = 0.04) {
    const ctx = this.ensureContext()
    if (!ctx) return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.65, now + duration)
    gain.gain.setValueAtTime(gainVal, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + duration)
  }

  stopLoop() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer)
      this.loopTimer = null
    }
    this.isPlaying = false
  }

  /**
   * Starts a clean, subtle desi-trap synth + 808 groove loop for track previews.
   */
  startBeatLoop(bpm = 138, rootHz = 92.5) {
    this.stopLoop()
    const ctx = this.ensureContext()
    if (!ctx) return
    this.isPlaying = true

    const stepMs = (60 / bpm / 2) * 1000 // eighth-note steps
    let step = 0
    const scale = [1, 1.189, 1.334, 1.498, 1.781] // minor pentatonic ratios

    const tick = () => {
      if (!this.isPlaying) return
      const now = ctx.currentTime

      // 808 kick on 0, 3, 6
      if (step % 8 === 0 || step % 8 === 3 || step % 8 === 6) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(120, now)
        osc.frequency.exponentialRampToValueAtTime(rootHz * 0.55, now + 0.14)
        gain.gain.setValueAtTime(0.16, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.25)
      }

      // Crisp snare/clap on 4
      if (step % 8 === 4) {
        const bufferSize = ctx.sampleRate * 0.08
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < bufferSize; i += 1) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
        }
        const noise = ctx.createBufferSource()
        noise.buffer = buffer
        const filter = ctx.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.value = 1100
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        noise.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        noise.start(now)
      }

      // Melodic pluck
      if (step % 2 === 0) {
        const noteRatio = scale[(step / 2) % scale.length]
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(rootHz * 4 * noteRatio, now)
        gain.gain.setValueAtTime(0.045, now)
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.16)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.17)
      }

      step += 1
    }

    tick()
    this.loopTimer = setInterval(tick, stepMs)
  }

  /**
   * Simulates raw vocal booth acapella cadence & room ambience for Voice Recorder.
   */
  startAcapellaSim(bpm = 138) {
    this.stopLoop()
    const ctx = this.ensureContext()
    if (!ctx) return
    this.isPlaying = true

    const stepMs = (60 / bpm / 2) * 1000
    let step = 0

    const tick = () => {
      if (!this.isPlaying) return
      const now = ctx.currentTime

      // Subtle vocal formant pulse mimicking rhythmic syllable cadence
      const activePattern = [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1]
      if (activePattern[step % activePattern.length]) {
        const osc = ctx.createOscillator()
        const filter = ctx.createBiquadFilter()
        const gain = ctx.createGain()

        osc.type = 'sawtooth'
        const baseFreq = 128 + ((step * 17) % 38)
        osc.frequency.setValueAtTime(baseFreq, now)
        osc.frequency.linearRampToValueAtTime(baseFreq * 0.92, now + 0.09)

        filter.type = 'bandpass'
        filter.frequency.setValueAtTime(750 + ((step * 130) % 500), now)
        filter.Q.value = 3.5

        gain.gain.setValueAtTime(0.035, now)
        gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.11)

        osc.connect(filter)
        filter.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.12)
      }

      // Faint booth metronome bleed on beat
      if (step % 2 === 0) {
        const clickOsc = ctx.createOscillator()
        const clickGain = ctx.createGain()
        clickOsc.type = 'sine'
        clickOsc.frequency.setValueAtTime(step % 8 === 0 ? 1320 : 880, now)
        clickGain.gain.setValueAtTime(0.012, now)
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025)
        clickOsc.connect(clickGain)
        clickGain.connect(ctx.destination)
        clickOsc.start(now)
        clickOsc.stop(now + 0.03)
      }

      step += 1
    }

    tick()
    this.loopTimer = setInterval(tick, stepMs)
  }
}

export const audioEngine = new PovAudioEngine()

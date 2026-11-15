import React, { useEffect, useRef } from 'react'

/**
 * Renders authentic, unedited candid camera-roll scenes via HTML5 Canvas
 * with natural lighting, slight handheld imperfections, and subtle sensor noise.
 * Supports both static raw photos and live-animated raw video frames.
 */
export default function RawSceneRenderer({
  item,
  isPlaying = false,
  currentTimeSec = 0,
  className = '',
  lowRes = false,
}) {
  const canvasRef = useRef(null)

  // If user uploaded a real image/video via R2 Admin uploader, render native tag
  if (item.localObjectUrl) {
    if (item.type === 'video') {
      return (
        <video
          src={item.localObjectUrl}
          className={`w-full h-full object-cover ${className}`}
          controls={!lowRes}
          autoPlay={!lowRes && isPlaying}
          loop
          muted={lowRes}
          playsInline
        />
      )
    }
    return (
      <img
        src={item.localObjectUrl}
        alt={item.filename}
        className={`w-full h-full object-cover ${className}`}
      />
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const w = lowRes ? 220 : 540
    const h = lowRes ? 280 : 680
    canvas.width = w
    canvas.height = h

    const t = isPlaying ? currentTimeSec : 0
    const jitterX = item.type === 'video' && isPlaying ? Math.sin(t * 3.1) * 3 : 0
    const jitterY = item.type === 'video' && isPlaying ? Math.cos(t * 2.4) * 2.5 : 0

    ctx.save()
    ctx.translate(jitterX, jitterY)

    switch (item.scene) {
      case 'rooftop-chai': {
        // 6:14 AM Delhi foggy rooftop sky + parapet wall + steel chai glass
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.68)
        sky.addColorStop(0, '#5c6672')
        sky.addColorStop(0.55, '#8c949c')
        sky.addColorStop(1, '#b6b0a6')
        ctx.fillStyle = sky
        ctx.fillRect(-10, -10, w + 20, h + 20)

        // Distant water tank & antennae silhouette in fog
        ctx.fillStyle = 'rgba(72, 78, 86, 0.35)'
        ctx.fillRect(w * 0.14, h * 0.34, w * 0.18, h * 0.24)
        ctx.fillRect(w * 0.62, h * 0.38, w * 0.24, h * 0.22)
        ctx.strokeStyle = 'rgba(72, 78, 86, 0.4)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(w * 0.44, h * 0.48)
        ctx.lineTo(w * 0.44, h * 0.22)
        ctx.moveTo(w * 0.41, h * 0.28)
        ctx.lineTo(w * 0.47, h * 0.28)
        ctx.stroke()

        // Concrete parapet wall (unedited raw concrete tone)
        const wall = ctx.createLinearGradient(0, h * 0.58, 0, h)
        wall.addColorStop(0, '#6a6863')
        wall.addColorStop(1, '#484744')
        ctx.fillStyle = wall
        ctx.fillRect(-10, h * 0.58, w + 20, h * 0.45)

        // Steel chai glass
        const gx = w * 0.63
        const gy = h * 0.47
        const gw = w * 0.14
        const gh = h * 0.18
        const metal = ctx.createLinearGradient(gx, gy, gx + gw, gy)
        metal.addColorStop(0, '#787b80')
        metal.addColorStop(0.35, '#bfc4c9')
        metal.addColorStop(0.7, '#64676b')
        metal.addColorStop(1, '#9ba0a6')
        ctx.fillStyle = metal
        ctx.beginPath()
        ctx.moveTo(gx, gy)
        ctx.lineTo(gx + gw, gy)
        ctx.lineTo(gx + gw * 0.88, gy + gh)
        ctx.lineTo(gx + gw * 0.12, gy + gh)
        ctx.closePath()
        ctx.fill()

        // Faint steam wisps
        ctx.strokeStyle = 'rgba(235, 238, 240, 0.28)'
        ctx.lineWidth = lowRes ? 2 : 4
        ctx.beginPath()
        ctx.moveTo(gx + gw * 0.45, gy - 4)
        ctx.quadraticCurveTo(gx + gw * 0.25, gy - 32, gx + gw * 0.55, gy - 64)
        ctx.stroke()
        break
      }

      case 'booth-mic-check': {
        // Dark acoustic foam booth, warm bulb + condenser mic + crooked pop filter
        ctx.fillStyle = '#1b1a18'
        ctx.fillRect(-10, -10, w + 20, h + 20)

        // Acoustic foam ridges
        ctx.fillStyle = '#23211e'
        const step = w * 0.08
        for (let x = 0; x < w; x += step) {
          ctx.fillRect(x, 0, step * 0.48, h)
        }

        // Warm overhead bare tungsten spill
        const bulb = ctx.createRadialGradient(w * 0.52, h * 0.16, 4, w * 0.52, h * 0.2, w * 0.65)
        bulb.addColorStop(0, 'rgba(245, 200, 130, 0.42)')
        bulb.addColorStop(0.45, 'rgba(180, 120, 65, 0.14)')
        bulb.addColorStop(1, 'rgba(20, 18, 16, 0)')
        ctx.fillStyle = bulb
        ctx.fillRect(0, 0, w, h)

        // Mic stand & U87-style condenser body
        ctx.strokeStyle = '#333436'
        ctx.lineWidth = lowRes ? 4 : 9
        ctx.beginPath()
        ctx.moveTo(w * 0.48, h)
        ctx.lineTo(w * 0.49, h * 0.45)
        ctx.stroke()

        // Mic body
        ctx.fillStyle = '#7b7f85'
        ctx.fillRect(w * 0.43, h * 0.31, w * 0.12, h * 0.16)
        ctx.fillStyle = '#a4a8ae'
        ctx.beginPath()
        ctx.roundRect(w * 0.425, h * 0.22, w * 0.13, h * 0.11, 14)
        ctx.fill()

        // Crooked pop filter
        const sway = isPlaying ? Math.sin(t * 2) * 3 : 0
        ctx.strokeStyle = '#101010'
        ctx.lineWidth = lowRes ? 3 : 7
        ctx.fillStyle = 'rgba(18, 18, 20, 0.72)'
        ctx.beginPath()
        ctx.ellipse(w * 0.57 + sway, h * 0.34, w * 0.14, h * 0.11, -0.15, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Red recording tally LED
        const ledAlpha = isPlaying ? 0.5 + 0.5 * Math.sin(t * 6) : 0.85
        ctx.fillStyle = `rgba(220, 55, 55, ${ledAlpha})`
        ctx.beginPath()
        ctx.arc(w * 0.16, h * 0.14, lowRes ? 3 : 6, 0, Math.PI * 2)
        ctx.fill()
        break
      }

      case 'highway-scorpio': {
        // NH-48 midnight fog through dusty windshield
        const night = ctx.createLinearGradient(0, 0, 0, h)
        night.addColorStop(0, '#0c1017')
        night.addColorStop(0.56, '#1c222b')
        night.addColorStop(0.62, '#141518')
        night.addColorStop(1, '#08090c')
        ctx.fillStyle = night
        ctx.fillRect(-10, -10, w + 20, h + 20)

        // Highway sodium vapor lamps in fog
        const lights = [0.22, 0.48, 0.74]
        lights.forEach((lx, idx) => {
          const ly = h * (0.44 + idx * 0.03)
          const glow = ctx.createRadialGradient(w * lx, ly, 2, w * lx, ly, w * 0.16)
          glow.addColorStop(0, 'rgba(255, 205, 120, 0.85)')
          glow.addColorStop(0.3, 'rgba(235, 160, 75, 0.25)')
          glow.addColorStop(1, 'rgba(235, 160, 75, 0)')
          ctx.fillStyle = glow
          ctx.fillRect(0, 0, w, h)
        })

        // Red tail lights ahead
        ctx.fillStyle = 'rgba(255, 45, 45, 0.8)'
        ctx.beginPath()
        ctx.arc(w * 0.47, h * 0.57, lowRes ? 2.5 : 5, 0, Math.PI * 2)
        ctx.arc(w * 0.54, h * 0.57, lowRes ? 2.5 : 5, 0, Math.PI * 2)
        ctx.fill()

        // Dashboard hood silhouette & faint cluster glow
        ctx.fillStyle = '#090a0d'
        ctx.beginPath()
        ctx.moveTo(0, h * 0.76)
        ctx.quadraticCurveTo(w * 0.45, h * 0.69, w, h * 0.78)
        ctx.lineTo(w, h)
        ctx.lineTo(0, h)
        ctx.closePath()
        ctx.fill()

        ctx.strokeStyle = 'rgba(130, 190, 255, 0.35)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(w * 0.32, h * 0.9, w * 0.08, Math.PI, 0)
        ctx.stroke()
        break
      }

      case 'studio-desk-mess': {
        // Wooden desk top-down raw shot: audio interface, coiled XLR, notebook
        ctx.fillStyle = '#382c23'
        ctx.fillRect(-10, -10, w + 20, h + 20)

        // Desk grain lines
        ctx.strokeStyle = 'rgba(25, 18, 12, 0.3)'
        ctx.lineWidth = 2
        for (let y = 20; y < h; y += 28) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(w, y + 6)
          ctx.stroke()
        }

        // MPC / Pad controller
        ctx.fillStyle = '#1e1f22'
        ctx.fillRect(w * 0.12, h * 0.18, w * 0.5, h * 0.32)
        for (let r = 0; r < 3; r += 1) {
          for (let c = 0; c < 4; c += 1) {
            ctx.fillStyle = r === 1 && c === 2 ? '#c25e28' : '#3a3c42'
            ctx.fillRect(w * (0.16 + c * 0.1), h * (0.23 + r * 0.08), w * 0.075, h * 0.06)
          }
        }

        // Coiled XLR cable
        ctx.strokeStyle = '#111214'
        ctx.lineWidth = lowRes ? 4 : 9
        ctx.beginPath()
        ctx.arc(w * 0.74, h * 0.66, w * 0.16, 0, Math.PI * 1.85)
        ctx.stroke()

        // Ruled notepad corner
        ctx.save()
        ctx.translate(w * 0.18, h * 0.58)
        ctx.rotate(-0.08)
        ctx.fillStyle = '#dcd7cb'
        ctx.fillRect(0, 0, w * 0.36, h * 0.32)
        ctx.strokeStyle = 'rgba(90, 120, 160, 0.35)'
        ctx.lineWidth = 1
        for (let ly = 24; ly < h * 0.3; ly += 16) {
          ctx.beginPath()
          ctx.moveTo(0, ly)
          ctx.lineTo(w * 0.36, ly)
          ctx.stroke()
        }
        ctx.restore()
        break
      }

      case 'tubewell-evening': {
        // Jhajjar mustard fields at dusk — muted natural yellows & warm horizon
        const dusk = ctx.createLinearGradient(0, 0, 0, h * 0.56)
        dusk.addColorStop(0, '#364152')
        dusk.addColorStop(0.65, '#8c7965')
        dusk.addColorStop(1, '#c79a63')
        ctx.fillStyle = dusk
        ctx.fillRect(-10, -10, w + 20, h + 20)

        // Horizon tree line
        ctx.fillStyle = '#2b3026'
        ctx.fillRect(-10, h * 0.51, w + 20, h * 0.06)

        // Mustard field rows
        const field = ctx.createLinearGradient(0, h * 0.56, 0, h)
        field.addColorStop(0, '#787d32')
        field.addColorStop(1, '#484d1e')
        ctx.fillStyle = field
        ctx.fillRect(-10, h * 0.56, w + 20, h * 0.46)

        // Subtle swaying mustard blossoms
        const sway = isPlaying ? Math.sin(t * 2.5) * 4 : 0
        ctx.fillStyle = '#bfa634'
        for (let i = 0; i < 60; i += 1) {
          const px = ((i * 73) % w) + sway * (i % 3 === 0 ? 1 : 0.4)
          const py = h * 0.58 + ((i * 41) % (h * 0.38))
          ctx.fillRect(px, py, lowRes ? 2 : 4, lowRes ? 2 : 4)
        }
        break
      }

      default: {
        // Notebook ink bar breakdowns
        ctx.fillStyle = '#d6d0c4'
        ctx.fillRect(-10, -10, w + 20, h + 20)
        ctx.strokeStyle = 'rgba(180, 90, 90, 0.45)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(w * 0.16, 0)
        ctx.lineTo(w * 0.16, h)
        ctx.stroke()

        ctx.strokeStyle = 'rgba(85, 115, 155, 0.35)'
        ctx.lineWidth = 1
        for (let y = 50; y < h; y += 26) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(w, y)
          ctx.stroke()
        }

        // Handwritten ink lines
        ctx.strokeStyle = '#1f2b47'
        ctx.lineWidth = lowRes ? 1.5 : 2.6
        for (let row = 0; row < 12; row += 1) {
          const y = 70 + row * 38
          ctx.beginPath()
          ctx.moveTo(w * 0.2, y)
          const endX = w * (0.55 + ((row * 19) % 30) / 100)
          ctx.bezierCurveTo(w * 0.35, y - 3, w * 0.48, y + 3, endX, y)
          ctx.stroke()
        }
        break
      }
    }

    // Authentic subtle unedited camera sensor grain
    const imgData = ctx.getImageData(0, 0, w, h)
    const d = imgData.data
    const grainAmt = lowRes ? 10 : 12
    for (let i = 0; i < d.length; i += 16) {
      const noise = (Math.random() - 0.5) * grainAmt
      d[i] = Math.max(0, Math.min(255, d[i] + noise))
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + noise))
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + noise))
    }
    ctx.putImageData(imgData, 0, 0)

    ctx.restore()
  }, [item.scene, item.type, isPlaying, currentTimeSec, lowRes])

  return <canvas ref={canvasRef} className={`w-full h-full object-cover block ${className}`} />
}

import { useEffect, useRef } from 'react'

/**
 * Antigravity – a canvas-based animated particle field.
 * Particles form rings that wave and react to mouse proximity.
 */
export default function Antigravity({
  count = 200,
  color = '#4a90d9',
  particleSize = 1.3,
  magnetRadius = 11,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  lerpSpeed = 0.08,
  autoAnimate = true,
  rotationSpeed = 0.1,
  fieldStrength = 9,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)
    let animId
    let mouse = { x: width / 2, y: height / 2 }
    let time = 0

    // Parse color string to rgb (supports hex, var(), names)
    const resolveRgb = (colorStr) => {
      if (typeof window === 'undefined') return { r: 74, g: 144, b: 217 }
      
      const dummy = document.createElement('div')
      dummy.style.color = colorStr
      dummy.style.display = 'none'
      document.body.appendChild(dummy)
      
      const computed = window.getComputedStyle(dummy).color
      document.body.removeChild(dummy)
      
      const match = computed.match(/\d+/g)
      if (match && match.length >= 3) {
        return {
          r: parseInt(match[0]),
          g: parseInt(match[1]),
          b: parseInt(match[2]),
        }
      }
      return { r: 74, g: 144, b: 217 }
    }
    const rgb = resolveRgb(color)

    // Build particles arranged in concentric rings
    const particles = []
    const rings = Math.ceil(count / 20)
    for (let r = 1; r <= rings; r++) {
      const ringCount = Math.round((count / rings) * (r / rings + 0.5))
      for (let i = 0; i < ringCount; i++) {
        const angle = (i / ringCount) * Math.PI * 2
        const radius = (r / rings) * Math.min(width, height) * 0.42
        const x = width / 2 + Math.cos(angle) * radius
        const y = height / 2 + Math.sin(angle) * radius
        particles.push({
          ox: x,
          oy: y,
          x,
          y,
          tx: x,
          ty: y,
          angle,
          radius,
          ringIndex: r,
          phase: Math.random() * Math.PI * 2,
          size: particleSize * (0.7 + Math.random() * 0.6),
        })
      }
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    window.addEventListener('mousemove', onMouseMove)

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      time += 0.016

      const rotation = autoAnimate ? time * rotationSpeed : 0

      particles.forEach((p) => {
        // Wave displacement
        const wave = Math.sin(time * waveSpeed + p.phase) * waveAmplitude * ringRadius

        // Rotated base position
        const rotAngle = p.angle + rotation
        p.ox = width / 2 + Math.cos(rotAngle) * (p.radius + wave)
        p.oy = height / 2 + Math.sin(rotAngle) * (p.radius + wave)

        // Mouse magnet
        const dx = mouse.x - p.ox
        const dy = mouse.y - p.oy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const magnetZone = magnetRadius * 20
        if (dist < magnetZone) {
          const force = (1 - dist / magnetZone) * fieldStrength
          p.tx = p.ox + (dx / dist) * force * magnetRadius
          p.ty = p.oy + (dy / dist) * force * magnetRadius
        } else {
          p.tx = p.ox
          p.ty = p.oy
        }

        // Lerp toward target
        p.x += (p.tx - p.x) * lerpSpeed
        p.y += (p.ty - p.y) * lerpSpeed

        // Opacity / size animate with wave
        const alpha = 0.3 + 0.5 * ((Math.sin(time * waveSpeed * 0.7 + p.phase) + 1) / 2)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`
        ctx.fill()
      })

      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
    }
  }, [
    count,
    color,
    particleSize,
    magnetRadius,
    ringRadius,
    waveSpeed,
    waveAmplitude,
    lerpSpeed,
    autoAnimate,
    rotationSpeed,
    fieldStrength,
  ])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}

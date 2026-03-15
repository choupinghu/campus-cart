import { useEffect, useRef } from 'react'

// ── Floating animated shapes for login page background ───────────────────────
// Creates geometric shapes (circles, squares, triangles) that gently float
// and drift around the screen, adding life to the background.

const SHAPE_COUNT = 18

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function createShape(id) {
  const types = ['circle', 'square', 'triangle', 'diamond']
  const type = types[Math.floor(Math.random() * types.length)]
  const size = randomBetween(24, 72)
  return {
    id,
    type,
    size,
    x: randomBetween(0, 100), // vw %
    y: randomBetween(0, 100), // vh %
    vx: randomBetween(-0.015, 0.015), // drift per frame in vw
    vy: randomBetween(-0.012, 0.012),
    rotation: randomBetween(0, 360),
    rotationSpeed: randomBetween(-0.4, 0.4),
    opacity: randomBetween(0.04, 0.14),
    color: Math.random() > 0.5 ? '#003D7C' : '#EF7C00',
  }
}

function ShapeSvg({ shape }) {
  const s = shape.size
  if (shape.type === 'circle') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <circle cx={s / 2} cy={s / 2} r={s / 2 - 2} fill={shape.color} />
      </svg>
    )
  }
  if (shape.type === 'square') {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <rect x={2} y={2} width={s - 4} height={s - 4} rx={s * 0.15} fill={shape.color} />
      </svg>
    )
  }
  if (shape.type === 'triangle') {
    const pts = `${s / 2},2 ${s - 2},${s - 2} 2,${s - 2}`
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <polygon points={pts} fill={shape.color} />
      </svg>
    )
  }
  if (shape.type === 'diamond') {
    const pts = `${s / 2},2 ${s - 2},${s / 2} ${s / 2},${s - 2} 2,${s / 2}`
    return (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <polygon points={pts} fill={shape.color} />
      </svg>
    )
  }
  return null
}

export default function FloatingShapes() {
  const containerRef = useRef(null)
  const shapesRef = useRef(Array.from({ length: SHAPE_COUNT }, (_, i) => createShape(i)))
  const elementsRef = useRef([])
  const animIdRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Build DOM elements for each shape
    shapesRef.current.forEach((shape, i) => {
      const el = document.createElement('div')
      el.style.cssText = `
        position: absolute;
        left: ${shape.x}vw;
        top: ${shape.y}vh;
        opacity: ${shape.opacity};
        transform: rotate(${shape.rotation}deg);
        will-change: transform;
        pointer-events: none;
      `
      // Render the SVG inline
      const svgMap = {
        circle: `<svg width="${shape.size}" height="${shape.size}" viewBox="0 0 ${shape.size} ${shape.size}"><circle cx="${shape.size / 2}" cy="${shape.size / 2}" r="${shape.size / 2 - 2}" fill="${shape.color}"/></svg>`,
        square: `<svg width="${shape.size}" height="${shape.size}" viewBox="0 0 ${shape.size} ${shape.size}"><rect x="2" y="2" width="${shape.size - 4}" height="${shape.size - 4}" rx="${shape.size * 0.15}" fill="${shape.color}"/></svg>`,
        triangle: `<svg width="${shape.size}" height="${shape.size}" viewBox="0 0 ${shape.size} ${shape.size}"><polygon points="${shape.size / 2},2 ${shape.size - 2},${shape.size - 2} 2,${shape.size - 2}" fill="${shape.color}"/></svg>`,
        diamond: `<svg width="${shape.size}" height="${shape.size}" viewBox="0 0 ${shape.size} ${shape.size}"><polygon points="${shape.size / 2},2 ${shape.size - 2},${shape.size / 2} ${shape.size / 2},${shape.size - 2} 2,${shape.size / 2}" fill="${shape.color}"/></svg>`,
      }
      el.innerHTML = svgMap[shape.type] || ''
      container.appendChild(el)
      elementsRef.current[i] = el
    })

    // Animation loop
    function tick() {
      shapesRef.current.forEach((shape, i) => {
        shape.x += shape.vx
        shape.y += shape.vy
        shape.rotation += shape.rotationSpeed

        // Wrap around edges
        if (shape.x < -10) shape.x = 110
        if (shape.x > 110) shape.x = -10
        if (shape.y < -10) shape.y = 110
        if (shape.y > 110) shape.y = -10

        const el = elementsRef.current[i]
        if (el) {
          el.style.left = `${shape.x}vw`
          el.style.top = `${shape.y}vh`
          el.style.transform = `rotate(${shape.rotation}deg)`
        }
      })
      animIdRef.current = requestAnimationFrame(tick)
    }
    animIdRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(animIdRef.current)
      // Clean up DOM
      elementsRef.current.forEach((el) => {
        if (el && el.parentNode) el.parentNode.removeChild(el)
      })
      elementsRef.current = []
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

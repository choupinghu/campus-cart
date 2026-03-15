import { useRef } from 'react'

/**
 * SpotlightCard – wraps children in a div that shows a radial gradient
 * spotlight that follows the mouse cursor within the card.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(0, 61, 124, 0.1)',
}) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--spotlight-x', `${x}px`)
    card.style.setProperty('--spotlight-y', `${y}px`)
    card.style.setProperty('--spotlight-opacity', '1')
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--spotlight-opacity', '0')
  }

  return (
    <div
      ref={cardRef}
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--spotlight-color': spotlightColor,
        '--spotlight-x': '50%',
        '--spotlight-y': '50%',
        '--spotlight-opacity': '0',
        position: 'relative',
        isolation: 'isolate',
      }}
    >
      {/* Spotlight overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(400px circle at var(--spotlight-x) var(--spotlight-y), var(--spotlight-color), transparent 70%)`,
          opacity: 'var(--spotlight-opacity)',
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      {children}
    </div>
  )
}

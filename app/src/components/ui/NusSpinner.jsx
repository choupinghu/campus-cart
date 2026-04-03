import { useState, useEffect } from 'react'
import { NUS_SPINNER_VERBS } from '../../utils/spinnerVerbs'

const SIZES = {
  sm: { ring: 'w-6 h-6',   border: 'border-2',     centerDot: 'w-1 h-1',     gap: 'gap-0.5' },
  md: { ring: 'w-10 h-10', border: 'border-[3px]', centerDot: 'w-1.5 h-1.5', gap: 'gap-1'   },
  lg: { ring: 'w-14 h-14', border: 'border-[3px]', centerDot: 'w-2.5 h-2.5', gap: 'gap-1'   },
}

export default function NusSpinner({ size = 'md', verb, showVerb = true, onCancel }) {
  const [currentVerb, setCurrentVerb] = useState(
    () => verb ?? NUS_SPINNER_VERBS[Math.floor(Math.random() * NUS_SPINNER_VERBS.length)]
  )
  const [orangeIdx, setOrangeIdx] = useState(0)

  useEffect(() => {
    if (verb) return
    const interval = setInterval(() => {
      setCurrentVerb(NUS_SPINNER_VERBS[Math.floor(Math.random() * NUS_SPINNER_VERBS.length)])
    }, 2500)
    return () => clearInterval(interval)
  }, [verb])

  useEffect(() => {
    const interval = setInterval(() => {
      setOrangeIdx((i) => (i + 1) % 3)
    }, 600)
    return () => clearInterval(interval)
  }, [])

  const { ring, border, centerDot, gap } = SIZES[size] ?? SIZES.md

  const dotColor = (idx) => (idx === orangeIdx ? 'bg-nus-orange' : 'bg-nus-blue')

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className={`${ring} ${border} rounded-full border-nus-blue/10`} />
        <div
          className={`absolute inset-0 ${border} rounded-full border-transparent border-t-nus-blue animate-spin`}
          style={{ animationDuration: '0.9s', animationTimingFunction: 'linear' }}
        />
        <div className={`absolute inset-0 flex items-center justify-center ${gap}`}>
          <span
            className={`${centerDot} rounded-full ${dotColor(0)} animate-bounce transition-colors duration-300`}
            style={{ animationDuration: '0.9s', animationDelay: '0ms' }}
          />
          <span
            className={`${centerDot} rounded-full ${dotColor(1)} animate-bounce transition-colors duration-300`}
            style={{ animationDuration: '0.9s', animationDelay: '160ms' }}
          />
          <span
            className={`${centerDot} rounded-full ${dotColor(2)} animate-bounce transition-colors duration-300`}
            style={{ animationDuration: '0.9s', animationDelay: '320ms' }}
          />
        </div>
      </div>

      {showVerb && (
        <p key={currentVerb} className="nus-verb heading-caps text-nus-blue/60">
          {currentVerb}
        </p>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-2 px-4 py-1.5 text-xs font-semibold rounded-lg border border-nus-blue/30 text-nus-blue bg-transparent hover:bg-nus-blue hover:text-white transition-all duration-200"
        >
          Cancel
        </button>
      )}
    </div>
  )
}

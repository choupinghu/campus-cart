import { useRef, useState } from 'react'
import { Sparkles, Loader2, AlertCircle, Check } from 'lucide-react'

/**
 * AI Auto-Fill button that sends the uploaded image to the backend
 * for analysis and returns structured suggestions to populate form fields.
 *
 * @param {string}   imageUrl       - The URL of the uploaded image
 * @param {function} onSuggest      - Callback receiving { title, description, suggestedPrice, condition, category }
 * @param {boolean}  disabled       - Whether the button is disabled (no image uploaded)
 * @param {function} onLoadingChange - Called with (isLoading, cancelFn?) on state change
 */
export default function AiAutoFillButton({ imageUrl, onSuggest, disabled, onLoadingChange }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const abortRef = useRef(null)

  const stopLoading = () => {
    setIsAnalyzing(false)
    if (onLoadingChange) onLoadingChange(false, null)
  }

  const handleCancel = () => {
    abortRef.current?.abort()
    stopLoading()
  }

  const handleAnalyze = async () => {
    if (!imageUrl || isAnalyzing) return

    const controller = new AbortController()
    abortRef.current = controller

    setIsAnalyzing(true)
    if (onLoadingChange) onLoadingChange(true, handleCancel)
    setError('')
    setSuccess(false)

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const response = await fetch(`${baseUrl}/api/ai/analyze-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ imageUrl }),
        signal: controller.signal,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image')
      }

      onSuggest(data.suggestions)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch (err) {
      if (err.name === 'AbortError') return // user cancelled — no error shown
      console.error('AI analysis error:', err)
      setError(err.message || 'Could not reach AI service. Try again or fill fields manually.')
    } finally {
      stopLoading()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={disabled || isAnalyzing}
        className={`
          group relative inline-flex items-center justify-center gap-2.5 
          px-5 py-2.5 rounded-xl text-sm font-semibold
          transition-all duration-300 ease-out
          ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isAnalyzing
                ? 'bg-nus-blue text-white cursor-wait opacity-80'
                : success
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-200'
                  : 'bg-nus-blue text-white shadow-lg shadow-nus-blue/20 hover:bg-nus-blue-hover hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        {/* Animated shimmer overlay during loading */}
        {isAnalyzing && (
          <span className="absolute inset-0 rounded-xl overflow-hidden">
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
              style={{
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </span>
        )}

        {/* Icon */}
        {isAnalyzing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : success ? (
          <Check className="w-4 h-4" />
        ) : (
          <Sparkles
            className={`w-4 h-4 transition-transform duration-300 ${
              !disabled ? 'group-hover:rotate-12 group-hover:scale-110' : ''
            }`}
          />
        )}

        {/* Label */}
        <span className="relative">
          {isAnalyzing ? 'Analyzing image...' : success ? 'Done!' : 'AI Auto-Fill'}
        </span>
      </button>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mt-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Auto-fill unavailable</p>
            <p className="text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Success Toast (Fixed Notification with smooth entry/exit) */}
      {success && (
        <div
          className="fixed top-24 right-6 z-[100] flex items-center gap-4 p-5 bg-white border-2 border-emerald-500/20 text-gray-900 rounded-2xl shadow-2xl toast-animation"
          style={{ width: 'fit-content', minWidth: '380px' }}
        >
          <div className="bg-emerald-500 p-2.5 rounded-full shadow-inner ring-4 ring-emerald-50">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-gray-900 tracking-tight leading-tight">Success</p>
            <p className="text-sm font-medium text-gray-600 mt-1">Fields populated successfully.</p>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes toast-lifecycle {
          0% { opacity: 0; transform: translateX(40px); }
          8% { opacity: 1; transform: translateX(0); }
          92% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(40px); }
        }
        .toast-animation {
          animation: toast-lifecycle 5s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}

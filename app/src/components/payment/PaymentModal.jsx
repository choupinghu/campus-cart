import { useState, useEffect, useCallback } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ShieldCheck, X, Lock, CreditCard, CheckCircle } from 'lucide-react'
import { stripePromise } from '../../services/stripeService'
import { graphqlRequest } from '../../services/graphqlClient'

const CREATE_PAYMENT_INTENT = `
  mutation CreatePaymentIntent($listingId: ID!) {
    createPaymentIntent(listingId: $listingId) {
      clientSecret
      orderId
      amount
      currency
    }
  }
`

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: '"Inter", sans-serif',
      color: '#111827',
      '::placeholder': { color: '#9ca3af' },
      iconColor: '#003d7c',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
}

function CheckoutForm({ listing, userEmail, clientSecret, orderId, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [status, setStatus] = useState('ready') // ready | submitting | success

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || status === 'submitting') return

    setStatus('submitting')
    const card = elements.getElement(CardElement)

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card, billing_details: { email: userEmail } },
    })

    if (error) {
      onError(error.message)
      setStatus('ready')
    } else {
      setStatus('success')
      onSuccess(orderId)
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-xl font-black text-gray-900">Payment Initiated!</p>
        <p className="text-sm text-gray-500 max-w-xs">
          Your payment is being processed. The seller will be notified shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Buyer email */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Email
        </label>
        <input
          type="email"
          value={userEmail}
          readOnly
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm text-gray-500 font-medium cursor-not-allowed"
        />
      </div>

      {/* Card element */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Card Details
        </label>
        <div className="px-4 py-3.5 rounded-2xl border border-gray-200 bg-white focus-within:border-nus-blue focus-within:ring-2 focus-within:ring-nus-blue/10 transition-all">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-[10px] text-gray-400 pl-1">
          Use test card: 4242 4242 4242 4242 · any expiry · any CVC
        </p>
      </div>

      {/* Pay button */}
      <button
        type="submit"
        disabled={!stripe || status === 'submitting'}
        className="w-full bg-nus-blue text-white font-black py-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-nus-blue/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {status === 'submitting' ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay S$ {parseFloat(listing.price).toFixed(2)}
          </>
        )}
      </button>

      {/* Security footer */}
      <div className="flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-[10px] text-gray-400 font-bold">Secured by</span>
        <span className="text-sm font-black tracking-tight" style={{ color: '#635BFF' }}>
          stripe
        </span>
        <span className="text-[10px] text-gray-400 font-bold">· End-to-end encrypted</span>
      </div>
    </form>
  )
}

export default function PaymentModal({ listing, user, onClose, onSuccess }) {
  const [phase, setPhase] = useState('init') // init | loading | ready | error
  const [clientSecret, setClientSecret] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  // Create PaymentIntent on mount
  useEffect(() => {
    async function initPayment() {
      setPhase('loading')
      try {
        const data = await graphqlRequest(CREATE_PAYMENT_INTENT, { listingId: listing.id })
        setClientSecret(data.createPaymentIntent.clientSecret)
        setOrderId(data.createPaymentIntent.orderId)
        setPhase('ready')
      } catch (err) {
        setErrorMsg(err.message || 'Could not initialize payment.')
        setPhase('error')
      }
    }
    initPayment()
  }, [listing.id])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const stripeOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#003d7c',
            borderRadius: '16px',
            fontFamily: '"Inter", sans-serif',
          },
        },
      }
    : null

  const imageUrl = listing.imageUrl || 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full sm:max-w-3xl bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl animate-slide-up sm:animate-none sm:scale-100 overflow-hidden max-h-[95dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-nus-blue rounded-xl flex items-center justify-center">
              <CreditCard className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">Checkout</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                CampusCart · Secure Payment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {/* Order summary */}
            <div className="p-8 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">
                Order Summary
              </p>
              <div className="aspect-[3/2] rounded-2xl overflow-hidden bg-gray-100 mb-5">
                <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-black text-gray-900 text-base leading-tight mb-2">
                {listing.title}
              </h3>
              <p className="text-[11px] text-gray-400 font-bold mb-4">
                Sold by {listing.seller?.name || 'NUS Student'}
              </p>
              {listing.condition && (
                <span className="inline-flex text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest mb-4">
                  {listing.condition}
                </span>
              )}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Total
                </span>
                <span className="text-2xl font-black text-nus-blue">
                  S$ {parseFloat(listing.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment form */}
            <div className="p-8">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">
                Payment Details
              </p>

              {phase === 'loading' && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="w-10 h-10 border-4 border-nus-blue border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-bold text-gray-400">Initializing payment…</p>
                </div>
              )}

              {phase === 'error' && (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <X className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-sm font-black text-gray-900">Payment unavailable</p>
                  <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
                  <button
                    onClick={onClose}
                    className="text-xs font-black text-nus-blue hover:underline"
                  >
                    Go back
                  </button>
                </div>
              )}

              {phase === 'ready' && stripeOptions && (
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <CheckoutForm
                    listing={listing}
                    userEmail={user?.email || ''}
                    clientSecret={clientSecret}
                    orderId={orderId}
                    onSuccess={onSuccess}
                    onError={(msg) => {
                      setErrorMsg(msg)
                    }}
                  />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

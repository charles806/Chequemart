import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaLock, FaKey } from 'react-icons/fa'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { Button, CircularProgress, Alert } from '@mui/material'
import { toast } from 'sonner'

const VerifyResetCode = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { method, identifier } = location.state || {}

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pasted)) return

    const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)
    document.getElementById(`otp-${Math.min(pasted.length - 1, 5)}`)?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const otpCode = otp.join('')
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp: otpCode }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Code verified! Set your new password')
        navigate('/new-password', { state: { resetToken: data.resetToken, identifier } })
      } else {
        setError(data.message || 'Invalid code. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')

    try {
      const payload = method === 'email'
        ? { email: identifier }
        : { phone: identifier.startsWith('+') ? identifier : `+234${identifier.slice(1)}` }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('New code sent!')
      } else {
        setError(data.message)
      }
    } catch {
      setError('Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-12 bg-neutral-50 min-h-[70vh] flex items-center">
      <div className="my-container">
        <div className="max-w-md mx-auto">
          {/* Back link */}
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-500 transition-colors text-sm mb-6"
          >
            <FaRegArrowAltCircleLeft className="rotate-180" />
            Back
          </Link>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaKey className="text-xl text-primary-500" />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                Enter Verification Code
              </h1>
              <p className="text-neutral-400 text-sm">
                We sent a 6-digit code to your {method === 'email' ? 'email' : 'phone'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <Alert severity="error" className="mb-4">{error}</Alert>}

              {/* OTP inputs */}
              <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-neutral-200 rounded-lg focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-colors"
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="btn-org! py-3! font-semibold!"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FaLock />}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
            </form>

            {/* Resend */}
            <div className="mt-6 text-center">
              <p className="text-neutral-400 text-sm mb-2">
                Didn&apos;t receive the code?
              </p>
              <Button
                variant="text"
                onClick={handleResend}
                disabled={loading}
                className="text-primary-500! font-medium! hover:text-primary-600!"
              >
                Resend Code
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-neutral-300 text-xs">
            Code expires in 10 minutes
          </p>
        </div>
      </div>
    </section>
  )
}

export default VerifyResetCode

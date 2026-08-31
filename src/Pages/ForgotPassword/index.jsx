import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaCheckCircle, FaPhone } from 'react-icons/fa'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { Button, TextField, CircularProgress, Alert, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { toast } from 'sonner'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = method === 'email'
        ? { email }
        : { phone: phone.startsWith('+') ? phone : `+234${phone.slice(1)}` }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        toast.success(`Reset code sent to your ${method === 'email' ? 'email' : 'phone'}`)
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch {
      setError('Network error. Please try again.')
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
            to="/login"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary-500 transition-colors text-sm mb-6"
          >
            <FaRegArrowAltCircleLeft className="rotate-180" />
            Back to Login
          </Link>

          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-xl text-primary-500" />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                Reset Password
              </h1>
              <p className="text-neutral-400 text-sm">
                Choose how you want to receive your reset code
              </p>
            </div>

            {/* Success state */}
            {success ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-xl text-success-500" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-2">Code Sent!</h2>
                <p className="text-neutral-400 text-sm mb-6">
                  We sent a code to your {method === 'email' ? 'email' : 'phone'}
                </p>
                <Alert severity="info" className="mb-4 text-left text-sm">
                  Enter the 6-digit code to reset your password
                </Alert>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/verify-reset-code', { state: { method, identifier: method === 'email' ? email : phone } })}
                  className="btn-org!"
                >
                  Enter Code
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => { setSuccess(false); setEmail(''); setPhone('') }}
                  className="mt-2 border-neutral-200! text-neutral-500! hover:border-primary-500! hover:text-primary-500!"
                >
                  Send Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" className="mb-4">{error}</Alert>
                )}

                {/* Method toggle */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Send reset code via
                  </label>
                  <ToggleButtonGroup
                    value={method}
                    exclusive
                    onChange={(e, newMethod) => { if (newMethod !== null) setMethod(newMethod) }}
                    fullWidth
                    className="!flex"
                  >
                    <ToggleButton
                      value="email"
                      className={`flex-1! !border-neutral-200 ${method === 'email' ? '!bg-primary-500 !text-white !border-primary-500' : ''}`}
                    >
                      <FaEnvelope className="mr-2" /> Email
                    </ToggleButton>
                    <ToggleButton
                      value="sms"
                      className={`flex-1! !border-neutral-200 ${method === 'sms' ? '!bg-primary-500 !text-white !border-primary-500' : ''}`}
                    >
                      <FaPhone className="mr-2" /> SMS
                    </ToggleButton>
                  </ToggleButtonGroup>
                </div>

                {method === 'email' ? (
                  <div className="mb-6">
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      variant="outlined"
                      fullWidth
                      required
                      placeholder="Enter your email"
                      InputProps={{
                        startAdornment: <FaEnvelope className="text-neutral-300 mr-2" />,
                      }}
                      sx={{
                        "& .MuiInputBase-root": { height: "50px" },
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": { borderColor: "#ff5252" },
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <TextField
                      label="Phone Number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      variant="outlined"
                      fullWidth
                      required
                      placeholder="8012345678"
                      InputProps={{
                        startAdornment: <FaPhone className="text-neutral-300 mr-2" />,
                      }}
                      sx={{
                        "& .MuiInputBase-root": { height: "50px" },
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": { borderColor: "#ff5252" },
                        },
                      }}
                    />
                    <p className="text-xs text-neutral-400 mt-1">
                      Enter phone number without +234
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="btn-org! py-3! font-semibold!"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </Button>
              </form>
            )}

            {!success && (
              <div className="mt-6 text-center">
                <p className="text-neutral-400 text-sm">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-neutral-300 text-xs">
            The code expires in 10 minutes.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword

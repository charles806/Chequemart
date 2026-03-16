import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEnvelope, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { Button, TextField, CircularProgress, Alert, Box } from '@mui/material'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='py-10 md:py-16 bg-gray-50 min-h-screen'>
      <div className="my-container">
        <div className="max-w-md mx-auto">
          {/* Back to Login */}
          <div className="mb-6">
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-gray-600 hover:text-[#ff5252] transition-colors text-sm"
            >
              <FaRegArrowAltCircleLeft className="rotate-180" />
              Back to Login
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#fff5f2] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-2xl text-[#ff5252]" />
              </div>
              <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                Forgot Password?
              </h1>
              <p className="text-gray-500 text-sm">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Reset Link Sent!
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  We sent a password reset link to <br/>
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
                <Alert severity="info" className="mb-4 text-left">
                  Check your email and click the link to reset your password. The link expires in 1 hour.
                </Alert>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="border-gray-300! text-gray-600! hover:border-[#ff5252]!"
                >
                  Send Again
                </Button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" className="mb-4">
                    {error}
                  </Alert>
                )}

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
                      startAdornment: (
                        <FaEnvelope className="text-gray-400 mr-2" />
                      ),
                    }}
                    sx={{ 
                      "& .MuiInputBase-root": { height: "50px" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#ff5252",
                        },
                      },
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="bg-gradient-to-r from-[#ff5252] to-[#ff7b7b]! hover:from-[#e04848]! hover:to-[#ff5252]! text-white! py-3! rounded-lg! font-semibold! transition-all!"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Sending...' : 'Reset Password'}
                </Button>
              </form>
            )}

            {/* Remember Password */}
            {!success && (
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className="text-[#ff5252] font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">
              If you don't receive the email within a few minutes, check your spam folder.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword

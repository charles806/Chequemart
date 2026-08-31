import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaLock, FaCheckCircle, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { Button, TextField, CircularProgress, Alert, IconButton, InputAdornment } from '@mui/material'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(null)

  useEffect(() => {
    setIsValidToken(!!token)
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      setError('Password must contain uppercase, lowercase, and number')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()
      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.message || 'Something went wrong')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (isValidToken === false) {
    return (
      <section className="py-12 bg-neutral-50 min-h-[70vh] flex items-center">
        <div className="my-container">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-8 text-center">
              <div className="w-14 h-14 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationCircle className="text-xl text-error-500" />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">Invalid Link</h1>
              <p className="text-neutral-400 text-sm mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Button
                variant="contained"
                className="btn-org!"
                onClick={() => navigate('/forgot-password')}
              >
                Request New Link
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
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
                <FaLock className="text-xl text-primary-500" />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">Reset Password</h1>
              <p className="text-neutral-400 text-sm">
                Create a new password for your account.
              </p>
            </div>

            {success ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-xl text-success-500" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-2">
                  Password Reset Complete!
                </h2>
                <p className="text-neutral-400 text-sm mb-6">
                  Your password has been reset successfully.
                </p>
                <Button
                  variant="contained"
                  fullWidth
                  className="btn-org! py-3!"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                <div className="mb-4">
                  <TextField
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="Enter new password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaLock className="text-neutral-300" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" className="text-neutral-400">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-root": { height: "50px" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#ff5252" },
                      },
                    }}
                  />
                  <p className="text-xs text-neutral-300 mt-1">
                    At least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div className="mb-6">
                  <TextField
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                    fullWidth
                    required
                    placeholder="Confirm new password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaLock className="text-neutral-300" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" className="text-neutral-400">
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInputBase-root": { height: "50px" },
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": { borderColor: "#ff5252" },
                      },
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  className="btn-org! py-3! font-semibold!"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword

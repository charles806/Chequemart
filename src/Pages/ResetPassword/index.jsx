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
    // Check if token exists
    if (!token) {
      setIsValidToken(false)
    } else {
      setIsValidToken(true)
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError('Password must contain uppercase, lowercase, and number')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
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

  // Invalid token
  if (isValidToken === false) {
    return (
      <section className='py-10 md:py-16 bg-gray-50 min-h-screen'>
        <div className="my-container">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationCircle className="text-2xl text-red-600" />
              </div>
              <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                Invalid Link
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                This password reset link is invalid or has expired.
              </p>
              <Button
                variant="contained"
                className="bg-gradient-to-r from-[#ff5252] to-[#ff7b7b]! hover:from-[#e04848]! hover:to-[#ff5252]!"
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
                <FaLock className="text-2xl text-[#ff5252]" />
              </div>
              <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                Reset Password
              </h1>
              <p className="text-gray-500 text-sm">
                Create a new password for your account.
              </p>
            </div>

            {/* Success State */}
            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Password Reset Complete!
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Your password has been reset successfully.
                </p>
                <Button
                  variant="contained"
                  fullWidth
                  className="bg-gradient-to-r from-[#ff5252] to-[#ff7b7b]! hover:from-[#e04848]! hover:to-[#ff5252]! py-3! rounded-lg!"
                  onClick={() => navigate('/login')}
                >
                  Sign In
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
                        <FaLock className="text-gray-400 mr-2" />
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            className="text-gray-400"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </IconButton>
                        </InputAdornment>
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
                  <p className="text-xs text-gray-400 mt-1">
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
                        <FaLock className="text-gray-400 mr-2" />
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            className="text-gray-400"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </IconButton>
                        </InputAdornment>
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

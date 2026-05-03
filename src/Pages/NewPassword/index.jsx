import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaLock, FaCheckCircle } from 'react-icons/fa'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { Button, TextField, CircularProgress, Alert, Box, InputAdornment, IconButton } from '@mui/material'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { toast } from 'sonner'

const NewPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { resetToken, identifier } = location.state || {}
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          resetToken,
          password 
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Password reset successfully!')
        navigate('/login')
      } else {
        setError(data.message || 'Failed to reset password')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!resetToken) {
    return (
      <section className='py-10 md:py-16 bg-gray-50 min-h-screen'>
        <div className="my-container">
          <div className="max-w-md mx-auto text-center">
            <Alert severity="error">
              Invalid reset link. Please request a new password reset.
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/forgot-password')}
              className="mt-4 bg-[#ff5252]!"
            >
              Request New Reset
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className='py-10 md:py-16 bg-gray-50 min-h-screen'>
      <div className="my-container">
        <div className="max-w-md mx-auto">
          {/* Back */}
          <div className="mb-6">
            <Link 
              to="/forgot-password" 
              className="flex items-center gap-2 text-gray-600 hover:text-[#ff5252] transition-colors text-sm"
            >
              <FaRegArrowAltCircleLeft className="rotate-180" />
              Back
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#fff5f2] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLock className="text-2xl text-[#ff5252]" />
              </div>
              <h1 className='text-2xl font-bold text-gray-800 mb-2'>
                Set New Password
              </h1>
              <p className="text-gray-500 text-sm">
                Enter your new password below
              </p>
            </div>

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
                      <InputAdornment position="start">
                        <FaLock className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <IoEyeOff /> : <IoEye />}
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

              <div className="mb-6">
                <TextField
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  fullWidth
                  required
                  placeholder="Confirm new password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaLock className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: confirmPassword && password === confirmPassword && (
                      <InputAdornment position="end">
                        <FaCheckCircle className="text-green-500" />
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
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FaLock />}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewPassword
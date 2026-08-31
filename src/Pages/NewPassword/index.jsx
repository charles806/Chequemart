import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FaLock, FaCheckCircle } from 'react-icons/fa'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'
import { Button, CircularProgress, Alert, InputAdornment, IconButton } from '@mui/material'
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, password }),
      })

      const data = await response.json()
      if (data.success) {
        toast.success('Password reset successfully!')
        navigate('/login')
      } else {
        setError(data.message || 'Failed to reset password')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!resetToken) {
    return (
      <section className="py-12 bg-neutral-50 min-h-[70vh] flex items-center">
        <div className="my-container">
          <div className="max-w-md mx-auto text-center">
            <Alert severity="error" className="mb-4">
              Invalid reset link. Please request a new password reset.
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/forgot-password')}
              className="btn-org!"
            >
              Request New Reset
            </Button>
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
                <FaLock className="text-xl text-primary-500" />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                Set New Password
              </h1>
              <p className="text-neutral-400 text-sm">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <Alert severity="error" className="mb-4">{error}</Alert>}

              {/* New password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">New Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full h-[50px] pl-10 pr-12 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  >
                    {showPassword ? <IoEyeOff className="text-lg" /> : <IoEye className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full h-[50px] pl-10 pr-12 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 transition-colors"
                  />
                  {confirmPassword && password === confirmPassword && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success-500">
                      <FaCheckCircle />
                    </span>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="btn-org! py-3! font-semibold!"
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

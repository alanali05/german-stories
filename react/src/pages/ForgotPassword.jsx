import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSendCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      console.log('Send reset code to:', email)
      setTimeout(() => {
        setLoading(false)
        setStep(2)
      }, 1000)
    } catch (err) {
      setLoading(false)
      setError('Email not found. Please try again.')
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      console.log('Verify code:', code)
      setTimeout(() => {
        setLoading(false)
        setStep(3)
      }, 1000)
    } catch (err) {
      setLoading(false)
      setError('Invalid code. Please try again.')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      setLoading(false)
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }
    try {
      console.log('Reset password for:', email)
      setTimeout(() => {
        setLoading(false)
        setStep(4)
      }, 1000)
    } catch (err) {
      setLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <AuthLayout>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step > s
                  ? 'w-8 bg-blue-600'
                  : step === s
                  ? 'w-8 bg-blue-600'
                  : 'w-8 bg-slate-200'
              }`}
            />
          ))}
        </div>
        {step < 4 && (
          <span className="text-xs text-slate-400">
            Step {step} of 3
          </span>
        )}
      </div>

      {step === 1 && (
        <>
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Forgot password?
          </h1>
          <p className="text-slate-500 text-sm mb-7">
            Enter your email and we will send you a reset code.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setError('')
                  setEmail(e.target.value)
                }}
                placeholder="you@example.com"
                required
                className="w-full h-11 px-3.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-all duration-150 active:scale-95"
            >
              {loading ? 'Sending code...' : 'Send reset code'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Sign in
            </Link>
          </p>
        </>
      )}

      {step === 2 && (
        <>
          <div className="text-4xl mb-4">📩</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Check your email
          </h1>
          <p className="text-slate-500 text-sm mb-2">
            We sent a 6-digit code to
          </p>
          <p className="text-blue-600 font-semibold text-sm mb-7">
            {email}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Enter 6-digit code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setError('')
                  setCode(e.target.value)
                }}
                placeholder="000000"
                maxLength={6}
                required
                className="w-full h-11 px-3.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-center tracking-widest font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-all duration-150 active:scale-95"
            >
              {loading ? 'Verifying...' : 'Verify code'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Didn't receive the code?{' '}
            <button
              onClick={() => {
                setError('')
                setStep(1)
              }}
              className="text-blue-600 font-medium hover:text-blue-700 bg-transparent border-none cursor-pointer"
            >
              Resend
            </button>
          </p>
        </>
      )}

      {step === 3 && (
        <>
          <div className="text-4xl mb-4">🔑</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            Create new password
          </h1>
          <p className="text-slate-500 text-sm mb-7">
            Your new password must be at least 8 characters.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setError('')
                    setNewPassword(e.target.value)
                  }}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full h-11 px-3.5 pr-11 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setError('')
                    setConfirmPassword(e.target.value)
                  }}
                  placeholder="Repeat your password"
                  required
                  className="w-full h-11 px-3.5 pr-11 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-all duration-150 active:scale-95"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        </>
      )}

      {step === 4 && (
        <div className="text-center py-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Password reset!
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Your password has been changed successfully. You can now sign in with your new password.
          </p>
          <Link
            to="/login"
            className="inline-block w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all duration-150 active:scale-95 leading-[44px]"
          >
            Back to Sign in
          </Link>
        </div>
      )}

    </AuthLayout>
  )
}

export default ForgotPassword

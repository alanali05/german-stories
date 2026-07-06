import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // TODO: replace with your real login API call
      console.log('Login data:', form);
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your German learning journey"
    >
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Email address
          </label>
          <div className="relative group">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full h-12 pl-11 pr-3.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-400">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors"
            />
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full h-12 pl-11 pr-11 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit button with gradient + icon */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-[0.98] shadow-[0_4px_20px_rgba(34,211,238,0.25)]"
        >
          {loading ? (
            'Signing in...'
          ) : (
            <>
              Sign in
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-xs text-slate-600 uppercase tracking-widest">or</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
        >
          Create one free
        </Link>
      </p>
    </AuthLayout>
  );
}
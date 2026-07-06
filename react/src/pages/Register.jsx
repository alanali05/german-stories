import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with your real register API call
      console.log('Register data:', form);
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your German learning journey today"
    >
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-3 rounded-lg mb-5">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Full name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="w-full h-11 px-3.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Email address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className="w-full h-11 px-3.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full h-11 px-3.5 pr-11 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <input
              type={showConfirmPass ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full h-11 px-3.5 pr-11 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
            >
              {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-all duration-150 active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-cyan-400 font-medium hover:text-cyan-300 transition"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

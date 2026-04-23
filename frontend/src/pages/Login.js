import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

const FEATURES = [
  { icon: '📊', text: 'Real-time lead tracking & pipeline' },
  { icon: '🏠', text: 'Delhi NCR property listings' },
  { icon: '🤝', text: 'Deal management with commission tracking' },
  { icon: '👥', text: 'Role-based agent management' },
];

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login }  = useAuth();
  const { dark, toggle } = useTheme();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen flex">

      {/* ── Animated background blobs ─────────────────────────────────── */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* ── Left panel ───────────────────────────────────────────────── */}
      <div className="hidden lg:flex auth-left w-[42%] flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="auth-grid-overlay" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/40">
              RC
            </div>
            <span className="text-white text-lg font-bold tracking-tight">RealCRM</span>
          </div>

          <span className="inline-block text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-400/30 bg-blue-500/10 mb-4">
            Real Estate Platform
          </span>

          <h1 className="text-white text-2xl font-bold leading-snug mb-3">
            Manage your entire real estate business in one place
          </h1>
          <p className="text-blue-200/70 text-sm leading-relaxed">
            Leads, properties, deals and agents — all connected seamlessly.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            {FEATURES.map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 auth-feature-item">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-base shrink-0">
                  {icon}
                </div>
                <span className="text-blue-100/80 text-sm">{text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-8 mt-12 pt-7 border-t border-white/10">
            {[['500+', 'Properties'], ['1.2K', 'Leads closed'], ['98%', 'Satisfaction']].map(([val, label]) => (
              <div key={label} className="auth-stat">
                <div className="text-white text-xl font-bold">{val}</div>
                <div className="text-blue-300/60 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-blue-400/40 text-xs">
          © 2025 RealCRM · Built for real estate professionals
        </div>
      </div>

      {/* ── Right panel ──────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-[420px]">

          {/* Theme toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggle}
              className="auth-theme-btn flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            >
              {dark ? (
                <><svg className="w-3.5 h-3.5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" strokeWidth="2"/>
                  <path strokeLinecap="round" strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>Light</>
              ) : (
                <><svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>Dark</>
              )}
            </button>
          </div>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">RC</div>
            <span className="auth-title-text font-bold text-xl tracking-tight">RealCRM</span>
          </div>

          {/* Tab switch */}
          <div className="auth-tab-bar flex rounded-xl p-1 mb-8">
            <div className="auth-tab-active flex-1 text-center py-2.5 rounded-lg text-sm font-semibold">
              Sign In
            </div>
            <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-medium auth-tab-inactive rounded-lg no-underline transition-colors">
              Create Account
            </Link>
          </div>

          <h2 className="auth-title-text text-2xl font-bold mb-1">Welcome back 👋</h2>
          <p className="auth-sub-text text-sm mb-7">Sign in to your RealCRM dashboard</p>

          {error && (
            <div className="auth-error flex items-center gap-2 rounded-xl px-4 py-3 text-sm mb-5 animate-[fadeIn_0.2s_ease]">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="auth-label block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base auth-icon">✉</span>
                <input
                  type="email" required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="auth-input w-full h-12 rounded-xl pl-10 pr-4 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="auth-label block text-xs font-semibold uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base auth-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'} required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="auth-input w-full h-12 rounded-xl pl-10 pr-12 text-sm outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm auth-icon-btn">
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-blue-500 text-xs font-medium cursor-pointer hover:text-blue-600 transition-colors">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn w-full h-12 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In to Dashboard →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px auth-divider" />
            <span className="auth-sub-text text-xs">or continue with</span>
            <div className="flex-1 h-px auth-divider" />
          </div>

          <div className="flex gap-3">
            {['🔵  Google', 'in  LinkedIn'].map(label => (
              <button key={label} className="auth-social-btn flex-1 h-11 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]">
                {label}
              </button>
            ))}
          </div>

          <p className="auth-sub-text text-center text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 font-semibold hover:text-blue-600 no-underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

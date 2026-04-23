import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

const ROLES = ['Agent', 'Manager', 'Admin'];

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'Agent' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const passwordStrength = (p) => {
    if (!p) return { score: 0, label: '', color: '' };
    if (p.length < 4)  return { score: 1, label: 'Weak',   color: '#ef4444' };
    if (p.length < 7)  return { score: 2, label: 'Fair',   color: '#f59e0b' };
    if (p.length < 10) return { score: 3, label: 'Good',   color: '#3B82F6' };
    return               { score: 4, label: 'Strong', color: '#22c55e' };
  };

  const strength = passwordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <div className="auth-grid-overlay" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/40">
              RC
            </div>
            <span className="text-white text-lg font-bold tracking-tight">RealCRM</span>
          </div>

          <span className="inline-block text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-400/30 bg-blue-500/10 mb-4">
            Join 2,000+ agents
          </span>

          <h1 className="text-white text-2xl font-bold leading-snug mb-3">
            Start closing more deals today
          </h1>
          <p className="text-blue-200/70 text-sm leading-relaxed">
            Create your free account and get access to leads, properties, and deal tracking in minutes.
          </p>

          <div className="mt-10 space-y-5">
            {[
              ['01', 'Create your account', 'Fill the form — takes 60 seconds'],
              ['02', 'Set up your profile', 'Add your area and specialization'],
              ['03', 'Start adding leads',  'Import or add leads manually'],
            ].map(([num, title, sub]) => (
              <div key={num} className="flex gap-4 auth-feature-item">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0 mt-0.5">
                  {num}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{title}</div>
                  <div className="text-blue-300/60 text-xs mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-blue-100/70 text-xs leading-relaxed italic">
              "RealCRM helped me close 3x more deals in my first month. The lead tracking alone saved me hours every week."
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">RS</div>
              <div>
                <div className="text-white text-xs font-semibold">Rohit Sharma</div>
                <div className="text-blue-400/50 text-[10px]">Top Agent, Gurgaon</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-blue-400/40 text-xs">
          © 2025 RealCRM · Free to start, no credit card required
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
            <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-medium auth-tab-inactive rounded-lg no-underline transition-colors">
              Sign In
            </Link>
            <div className="auth-tab-active flex-1 text-center py-2.5 rounded-lg text-sm font-semibold">
              Create Account
            </div>
          </div>

          <h2 className="auth-title-text text-2xl font-bold mb-1">Create your account</h2>
          <p className="auth-sub-text text-sm mb-6">Join thousands of real estate professionals</p>

          {error && (
            <div className="auth-error flex items-center gap-2 rounded-xl px-4 py-3 text-sm mb-4 animate-[fadeIn_0.2s_ease]">
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div className="auth-success flex items-center gap-2 rounded-xl px-4 py-3 text-sm mb-4 animate-[fadeIn_0.2s_ease]">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="auth-label block text-xs font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base auth-icon">👤</span>
                <input
                  type="text" required
                  placeholder="Prince Kumar"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="auth-input w-full h-12 rounded-xl pl-10 pr-4 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="auth-label block text-xs font-semibold uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base auth-icon">✉</span>
                <input
                  type="email" required
                  placeholder="prince@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="auth-input w-full h-12 rounded-xl pl-10 pr-4 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="auth-label block text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base auth-icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'} required
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="auth-input w-full h-12 rounded-xl pl-10 pr-12 text-sm outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm auth-icon-btn">
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>

              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength.score ? strength.color : '#e2e8f0' }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label} password
                  </span>
                </div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="auth-label block text-xs font-semibold uppercase tracking-wider mb-2">Your Role</label>
              <div className="flex gap-2">
                {ROLES.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all border
                      ${form.role === role
                        ? 'bg-blue-50 border-blue-500 text-blue-600 font-semibold'
                        : 'auth-role-btn'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!success}
              className="auth-submit-btn w-full h-12 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Free Account →'}
            </button>
          </form>

          <p className="auth-sub-text text-center text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600 no-underline">
              Sign in here
            </Link>
          </p>
          <p className="auth-sub-text text-center text-xs mt-3 opacity-60">
            By creating an account you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

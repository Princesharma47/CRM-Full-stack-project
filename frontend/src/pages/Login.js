import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const FEATURES = [
  { icon: '📊', text: 'Real-time lead tracking & pipeline' },
  { icon: '🏠', text: 'Delhi NCR property listings' },
  { icon: '🤝', text: 'Deal management with commission tracking' },
  { icon: '👥', text: 'Role-based agent management' },
];

const Login = () => {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f0f4f8' }}>
      {/* ── Left panel ── */}
      <div className="hidden lg:flex" style={{
        width: '42%', background: '#1e3a5f', padding: '48px 44px',
        flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 52 }}>
            <div style={{
              width: 40, height: 40, background: '#3B82F6', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: '#fff',
            }}>RC</div>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>RealCRM</span>
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-block', background: 'rgba(59,130,246,0.2)',
            color: '#93c5fd', fontSize: 11, padding: '3px 12px',
            borderRadius: 20, marginBottom: 16,
            border: '0.5px solid rgba(59,130,246,0.35)',
          }}>
            Real Estate Platform
          </div>

          <h1 style={{
            color: '#fff', fontSize: 26, fontWeight: 700,
            lineHeight: 1.35, marginBottom: 12,
          }}>
            Manage your entire real estate business in one place
          </h1>
          <p style={{ color: '#93b4d4', fontSize: 13, lineHeight: 1.7 }}>
            Leads, properties, deals and agents — all connected seamlessly for maximum productivity.
          </p>

          {/* Features */}
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FEATURES.map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9,
                  background: 'rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 15, flexShrink: 0,
                }}>
                  {icon}
                </div>
                <span style={{ color: '#b8d4ed', fontSize: 13 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: 24, marginTop: 44,
            paddingTop: 28, borderTop: '0.5px solid rgba(255,255,255,0.1)',
          }}>
            {[['500+', 'Properties'], ['1.2K', 'Leads closed'], ['98%', 'Agent satisfaction']].map(([val, label]) => (
              <div key={label}>
                <div style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>{val}</div>
                <div style={{ color: '#6899b8', fontSize: 11, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color: '#3d6480', fontSize: 11 }}>
          © 2025 RealCRM · Built for real estate professionals
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          
          {/* Logo only visible on mobile (since left panel hits hidden) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
              RC
            </div>
            <span className="font-bold text-gray-900 text-xl tracking-tight">RealCRM</span>
          </div>

          {/* Tab switch */}
          <div style={{
            display: 'flex', background: '#e2e8f0', borderRadius: 12,
            padding: 4, marginBottom: 32,
          }}>
            <div style={{
              flex: 1, textAlign: 'center', padding: '9px 0',
              background: '#fff', borderRadius: 9, fontSize: 13,
              fontWeight: 600, color: '#1e293b',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}>
              Sign In
            </div>
            <Link to="/register" style={{
              flex: 1, textAlign: 'center', padding: '9px 0',
              fontSize: 13, fontWeight: 500, color: '#64748b',
              textDecoration: 'none', borderRadius: 9,
            }}>
              Create Account
            </Link>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Welcome back 👋
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>
            Sign in to your RealCRM dashboard
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '0.5px solid #fca5a5',
              borderRadius: 10, padding: '10px 14px',
              color: '#dc2626', fontSize: 13, marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: '#475569', marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 15, color: '#94a3b8',
                }}>✉</span>
                <input
                  type="email" required
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%', height: 46, border: '1px solid #e2e8f0',
                    borderRadius: 11, paddingLeft: 38, paddingRight: 14,
                    fontSize: 14, color: '#0f172a', background: '#fff',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 10 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: '#475569', marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 15, color: '#94a3b8',
                }}>🔒</span>
                <input
                  type={showPass ? 'text' : 'password'} required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%', height: 46, border: '1px solid #e2e8f0',
                    borderRadius: 11, paddingLeft: 38, paddingRight: 44,
                    fontSize: 14, color: '#0f172a', background: '#fff',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', fontSize: 14,
                    color: '#94a3b8', padding: 0,
                  }}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div style={{ textAlign: 'right', marginBottom: 22 }}>
              <span style={{ fontSize: 12, color: '#3B82F6', cursor: 'pointer', fontWeight: 500 }}>
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 46,
                background: loading ? '#93c5fd' : '#2563EB',
                color: '#fff', border: 'none', borderRadius: 11,
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In to Dashboard →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
            <div style={{ flex: 1, height: '0.5px', background: '#e2e8f0' }} />
            <span style={{ fontSize: 11, color: '#94a3b8' }}>or continue with</span>
            <div style={{ flex: 1, height: '0.5px', background: '#e2e8f0' }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            {['🔵  Google', 'in  LinkedIn'].map(label => (
              <button key={label} style={{
                flex: 1, height: 42, border: '1px solid #e2e8f0',
                borderRadius: 10, background: '#fff', fontSize: 13,
                fontWeight: 500, color: '#475569', cursor: 'pointer',
              }}>
                {label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

const ROLES = ['Agent', 'Manager', 'Admin'];

const Register = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'Agent' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = (p) => {
    if (!p) return { score: 0, label: '', color: '#e2e8f0' };
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
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f0f4f8' }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex" style={{
        width: '42%', background: '#1e3a5f', padding: '48px 44px',
        flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 52 }}>
            <div style={{
              width: 40, height: 40, background: '#3B82F6', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: '#fff',
            }}>RC</div>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>RealCRM</span>
          </div>

          <div style={{
            display: 'inline-block', background: 'rgba(59,130,246,0.2)',
            color: '#93c5fd', fontSize: 11, padding: '3px 12px',
            borderRadius: 20, marginBottom: 16,
            border: '0.5px solid rgba(59,130,246,0.35)',
          }}>
            Join 2,000+ agents
          </div>

          <h1 style={{
            color: '#fff', fontSize: 26, fontWeight: 700,
            lineHeight: 1.35, marginBottom: 12,
          }}>
            Start closing more deals today
          </h1>
          <p style={{ color: '#93b4d4', fontSize: 13, lineHeight: 1.7 }}>
            Create your free account and get access to leads, properties, and deal tracking in minutes.
          </p>

          {/* Steps */}
          <div style={{ marginTop: 40 }}>
            {[
              ['01', 'Create your account', 'Fill the form — takes 60 seconds'],
              ['02', 'Set up your profile', 'Add your area and specialization'],
              ['03', 'Start adding leads',  'Import or add leads manually'],
            ].map(([num, title, sub]) => (
              <div key={num} style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
                <div style={{
                  width: 32, height: 32, background: 'rgba(59,130,246,0.25)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 11, fontWeight: 700,
                  color: '#93c5fd', flexShrink: 0, marginTop: 2,
                }}>{num}</div>
                <div>
                  <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{title}</div>
                  <div style={{ color: '#6899b8', fontSize: 12, marginTop: 2 }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            marginTop: 32, padding: '16px 18px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 12, border: '0.5px solid rgba(255,255,255,0.1)',
          }}>
            <p style={{ color: '#b8d4ed', fontSize: 12, lineHeight: 1.6, fontStyle: 'italic' }}>
              "RealCRM helped me close 3x more deals in my first month. The lead tracking alone saved me hours every week."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#3B82F6', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff',
              }}>RS</div>
              <div>
                <div style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>Rohit Sharma</div>
                <div style={{ color: '#4a7aa0', fontSize: 10 }}>Top Agent, Gurgaon</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ color: '#3d6480', fontSize: 11 }}>
          © 2025 RealCRM · Free to start, no credit card required
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          
          {/* Logo visible only on mobile */}
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
            <Link to="/login" style={{
              flex: 1, textAlign: 'center', padding: '9px 0',
              fontSize: 13, fontWeight: 500, color: '#64748b',
              textDecoration: 'none', borderRadius: 9,
            }}>
              Sign In
            </Link>
            <div style={{
              flex: 1, textAlign: 'center', padding: '9px 0',
              background: '#fff', borderRadius: 9, fontSize: 13,
              fontWeight: 600, color: '#1e293b',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}>
              Create Account
            </div>
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Create your account
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
            Join thousands of real estate professionals
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '0.5px solid #fca5a5',
              borderRadius: 10, padding: '10px 14px',
              color: '#dc2626', fontSize: 13, marginBottom: 16,
            }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#f0fdf4', border: '0.5px solid #86efac',
              borderRadius: 10, padding: '10px 14px',
              color: '#16a34a', fontSize: 13, marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: '#475569', marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 15, color: '#94a3b8',
                }}>👤</span>
                <input
                  type="text" required
                  placeholder="Prince Kumar"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%', height: 46, border: '1px solid #e2e8f0',
                    borderRadius: 11, paddingLeft: 38, paddingRight: 14,
                    fontSize: 14, color: '#0f172a', background: '#fff', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: '#475569', marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 15, color: '#94a3b8',
                }}>✉</span>
                <input
                  type="email" required
                  placeholder="prince@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%', height: 46, border: '1px solid #e2e8f0',
                    borderRadius: 11, paddingLeft: 38, paddingRight: 14,
                    fontSize: 14, color: '#0f172a', background: '#fff', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 6 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: '#475569', marginBottom: 6,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: 13, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 15, color: '#94a3b8',
                }}>🔒</span>
                <input
                  type={showPass ? 'text' : 'password'} required
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%', height: 46, border: '1px solid #e2e8f0',
                    borderRadius: 11, paddingLeft: 38, paddingRight: 44,
                    fontSize: 14, color: '#0f172a', background: '#fff', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#3B82F6'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', fontSize: 14, color: '#94a3b8', padding: 0,
                  }}>
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Password strength bar */}
            {form.password.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 4,
                      background: i <= strength.score ? strength.color : '#e2e8f0',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: strength.color, fontWeight: 500 }}>
                  {strength.label} password
                </span>
              </div>
            )}

            {/* Role selector */}
            <div style={{ marginBottom: 22 }}>
              <label style={{
                display: 'block', fontSize: 11, fontWeight: 600,
                color: '#475569', marginBottom: 8,
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>Your Role</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {ROLES.map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    style={{
                      flex: 1, height: 40, border: form.role === role
                        ? '1.5px solid #3B82F6' : '1px solid #e2e8f0',
                      borderRadius: 10, background: form.role === role ? '#eff6ff' : '#fff',
                      color: form.role === role ? '#2563EB' : '#64748b',
                      fontSize: 13, fontWeight: form.role === role ? 600 : 400,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!success}
              style={{
                width: '100%', height: 46,
                background: loading ? '#93c5fd' : '#2563EB',
                color: '#fff', border: 'none', borderRadius: 11,
                fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 22 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
              Sign in here
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 14 }}>
            By creating an account you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

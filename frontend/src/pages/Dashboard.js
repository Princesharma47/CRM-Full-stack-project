import { useState, useEffect, useRef } from 'react';
import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
  PieChart, Pie, Cell,
} from 'recharts';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

// ─── Constants ────────────────────────────────────────────────────────────────
const PIE_COLORS  = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'];
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const STATUS_BADGE = {
  New:         'bg-blue-50   text-blue-700   ring-1 ring-blue-600/20',
  Contacted:   'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
  Qualified:   'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
  Negotiation: 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20',
  Closed:      'bg-green-50  text-green-700  ring-1 ring-green-600/20',
  Lost:        'bg-red-50    text-red-700    ring-1 ring-red-600/20',
  Agreement:   'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatCurrency(val) {
  if (!val) return '₹0';
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
}

function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon, colorBadge, to }) => (
  <Link to={to || '#'} className="block group stat-card">
    <div className="relative overflow-hidden rounded-3xl p-6 border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl ${colorBadge}`} />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${colorBadge}`}>
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{value}</p>
        {sub && (
          <span className="mt-2 inline-block px-2 py-0.5 rounded-md bg-gray-50 text-xs font-medium text-gray-500 border border-gray-100">
            {sub}
          </span>
        )}
      </div>
    </div>
  </Link>
);

const Badge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-600'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
    {status}
  </span>
);

// ─── Main Dashboard ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user }  = useAuth();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // GSAP animations after data loads
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(dashboardRef.current, { opacity: 0, y: -10, duration: 0.5, ease: 'power2.out' });
      gsap.from('.stat-card',    { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.animate-block',{ y: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out', delay: 0.4 });
      gsap.from('.progress-bar', { width: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2, delay: 0.4 });
    }, dashboardRef);
    return () => ctx.revert();
  }, [loading]);

  // ── Derived chart data ──────────────────────────────────────────────────────
  const barData = (stats?.monthlyRevenue || []).map((m) => ({
    name:    MONTH_NAMES[m._id.month - 1],
    Revenue: m.revenue,
    Deals:   m.deals,
  }));

  const pieData = (stats?.leadStats || []).map((l) => ({
    name:  l._id || 'Unknown',
    value: l.count,
  }));

  const recentLeads = stats?.recentLeads || [];
  const recentDeals = stats?.recentDeals || [];

  const dateString = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Greeting Banner ───────────────────────────────────────────────── */}
      <div className="relative mb-10 overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-8 lg:p-10 shadow-lg animate-block">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5 blur-3xl" />
        <div className="absolute bottom-0 left-20 w-60 h-60 rounded-full bg-blue-500 opacity-20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                {user?.name?.split(' ')[0]}! 👋
              </span>
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-2 font-medium flex items-center gap-2">
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dateString}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-sm font-semibold tracking-wide">System Online</span>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Leads"    value={stats?.totalLeads ?? 0}
          sub="All-time pipeline"    icon="👥" colorBadge="bg-blue-50 text-blue-600"    to="/leads" />
        <StatCard label="Properties"     value={stats?.totalProperties ?? 0}
          sub="Active listings"      icon="🏠" colorBadge="bg-indigo-50 text-indigo-600" to="/properties" />
        <StatCard label="Active Deals"   value={stats?.activeDeals ?? 0}
          sub="Currently in play"    icon="🤝" colorBadge="bg-amber-50 text-amber-600"   to="/deals" />
        <StatCard label="Closed Revenue" value={formatCurrency(stats?.closedRevenue)}
          sub="This month"           icon="💰" colorBadge="bg-emerald-50 text-emerald-600" />
      </div>

      {/* ── Charts Row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* ComposedChart — Monthly Revenue (bar) + Deals (line) */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow animate-block">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Monthly Revenue &amp; Deals</h2>
              <p className="text-sm text-gray-400 mt-0.5">Last 6 months — revenue bars, deal count line</p>
            </div>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
              INR
            </span>
          </div>

          {/* Legend pills */}
          <div className="flex items-center gap-4 mt-3 mb-5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <span className="w-5 h-0.5 bg-emerald-500 inline-block rounded-full" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block -ml-1" />
              Deals
            </span>
          </div>

          {barData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 text-gray-400">
              <span className="text-4xl mb-3">📊</span>
              <p className="text-sm font-medium">No deal data yet</p>
              <Link to="/deals" className="text-xs text-blue-500 mt-1 hover:underline">Create your first deal →</Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={barData} margin={{ top: 4, right: 16, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                  axisLine={false} tickLine={false}
                />
                {/* Left Y — Revenue */}
                <YAxis
                  yAxisId="rev"
                  orientation="left"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => v >= 100000 ? `₹${(v/100000).toFixed(0)}L` : `₹${(v/1000).toFixed(0)}K`}
                />
                {/* Right Y — Deals count */}
                <YAxis
                  yAxisId="deals"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false} tickLine={false}
                  allowDecimals={false}
                  width={28}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc', radius: 8 }}
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 30px -5px rgba(0,0,0,0.12)',
                    padding: '10px 14px',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => [
                    name === 'Revenue'
                      ? value >= 100000 ? `₹${(value/100000).toFixed(2)}L` : `₹${value.toLocaleString('en-IN')}`
                      : value,
                    name,
                  ]}
                />
                <Bar
                  yAxisId="rev"
                  dataKey="Revenue"
                  fill="url(#revenueGrad)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={48}
                />
                <Line
                  yAxisId="deals"
                  type="monotone"
                  dataKey="Deals"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart — Lead Status */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow animate-block">
          <h2 className="text-lg font-bold text-gray-900 mb-1">🥧 Lead Status Breakdown</h2>
          <p className="text-sm text-gray-500 mb-6">Distribution across pipeline stages</p>
          {pieData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-52 text-gray-400">
              <span className="text-4xl mb-3">👥</span>
              <p className="text-sm font-medium">No leads yet</p>
              <Link to="/leads" className="text-xs text-blue-500 mt-1 hover:underline">Add your first lead →</Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={85} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Recent Tables ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Recent Leads */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-block">
          <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-base font-bold text-gray-900">🕐 Recent Leads</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest prospects in the system</p>
            </div>
            <Link to="/leads" className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentLeads.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📭</div>
                <p className="text-gray-500 text-sm font-medium">No leads yet</p>
                <Link to="/leads" className="text-blue-500 text-xs mt-1 inline-block hover:underline">Add your first lead</Link>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Source</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-xs ring-2 ring-white">
                            {lead.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{lead.phone}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                          {lead.source || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4"><Badge status={lead.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Deals */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-block">
          <div className="px-6 pt-6 pb-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-base font-bold text-gray-900">💼 Recent Deals</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest deals in the pipeline</p>
            </div>
            <Link to="/deals" className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentDeals.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📋</div>
                <p className="text-gray-500 text-sm font-medium">No deals yet</p>
                <Link to="/deals" className="text-blue-500 text-xs mt-1 inline-block hover:underline">Create your first deal</Link>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Value</th>
                    <th className="px-6 py-3">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentDeals.map((deal) => (
                    <tr key={deal._id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{deal.title}</td>
                      <td className="px-6 py-4 text-gray-500">{deal.client}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(deal.dealValue)}</td>
                      <td className="px-6 py-4"><Badge status={deal.stage} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-sm font-medium text-gray-400 pb-8">
        <p>RealCRM Platform © 2026</p>
      </div>
    </div>
  );
};

export default Dashboard;

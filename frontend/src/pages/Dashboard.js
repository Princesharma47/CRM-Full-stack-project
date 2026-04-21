import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';

const StatCard = ({ label, value, sub, colorBadge, icon, to, isRevenue }) => (
  <Link to={to || '#'} className="block group stat-card">
    <div className="relative overflow-hidden rounded-3xl p-6 border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
      {/* Decorative gradient blob inside the card */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 blur-2xl ${colorBadge}`}></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${colorBadge}`}>
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <p className={`text-4xl font-extrabold text-gray-900 tracking-tight ${isRevenue ? 'revenue-text' : ''}`}>
          {value}
        </p>
        <div className="flex items-center gap-2 mt-2">
          {sub && <span className="px-2 py-0.5 rounded-md bg-gray-50 text-xs font-medium text-gray-500 border border-gray-100">{sub}</span>}
        </div>
      </div>
    </div>
  </Link>
);

const MONTHLY_DATA = [
  { month: 'Jan', leads: 12, deals: 3 },
  { month: 'Feb', leads: 19, deals: 5 },
  { month: 'Mar', leads: 8,  deals: 2 },
  { month: 'Apr', leads: 25, deals: 7 },
  { month: 'May', leads: 17, deals: 4 },
  { month: 'Jun', leads: 30, deals: 9 },
];

const STATUS_COLORS = {
  New:       'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
  Contacted: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
  Qualified: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
  Closed:    'bg-green-50 text-green-700 ring-1 ring-green-600/20',
  Lost:      'bg-red-50 text-red-700 ring-1 ring-red-600/20',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]   = useState({ leads: 0, properties: 0 });
  const [leads, setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const dashboardRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [leadsRes, propsRes] = await Promise.all([
          API.get('/leads'),
          API.get('/properties'),
        ]);
        setStats({ 
          leads: leadsRes.data.count || leadsRes.data.length || leadsRes.data.data?.length || 0, 
          properties: propsRes.data.count || propsRes.data.length || propsRes.data.data?.length || 0 
        });
        setLeads((leadsRes.data.data || leadsRes.data || []).slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (loading) return; // Wait until data loads

    let ctx = gsap.context(() => {
      // 1. Page arrival transition
      gsap.from(dashboardRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        ease: 'power2.out'
      });

      // 2. Stat Cards Staggered load
      gsap.from('.stat-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });

      // 3. Number Counter for Revenue
      gsap.fromTo('.revenue-text', 
        { innerHTML: 0 }, 
        { 
          innerHTML: 420000, 
          duration: 1.5, 
          snap: { innerHTML: 1 },
          onUpdate: function() {
            const el = document.querySelector('.revenue-text');
            if (el) el.innerHTML = '₹' + (Number(el.innerHTML) / 100000).toFixed(1) + 'L';
          },
          ease: 'power3.out',
          delay: 0.6
        }
      );

      // 4. Pipeline Progress Bars
      gsap.from('.progress-bar', {
        width: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.2,
        delay: 0.4
      });

      // 5. Chart & Table slide up
      gsap.from('.animate-block', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        delay: 0.5
      });
      
    }, dashboardRef);

    return () => ctx.revert(); // clean up on unmount
  }, [loading]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const dateString = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 opacity-100">
      
      {/* Premium Header Container */}
      <div className="relative mb-10 overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-8 lg:p-10 shadow-lg animate-block">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white opacity-5 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-20 w-60 h-60 rounded-full bg-blue-500 opacity-20 blur-3xl mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">{user?.name?.split(' ')[0]}! 👋</span>
            </h1>
            <p className="text-blue-100 text-sm md:text-base mt-2 font-medium flex items-center gap-2">
              <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              {dateString}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white text-sm font-semibold tracking-wide">System Online</span>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          label="Total Leads" value={loading ? '...' : stats.leads}
          sub="All time pipeline" icon="👥" colorBadge="bg-blue-50 text-blue-600" to="/leads"
        />
        <StatCard
          label="Properties" value={loading ? '...' : stats.properties}
          sub="Active listings" icon="🏠" colorBadge="bg-indigo-50 text-indigo-600" to="/properties"
        />
        <StatCard
          label="Active Deals" value="5"
          sub="Currently in play" icon="🤝" colorBadge="bg-amber-50 text-amber-600" to="/deals"
        />
        <StatCard
          label="Closed Revenue" value="₹4.2L" isRevenue={true}
          sub="Current month" icon="💰" colorBadge="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow animate-block">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Performance Analytics</h2>
              <p className="text-sm text-gray-500 mt-1">Leads and deals tracking for 2025</p>
            </div>
            <div className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-100">
              Monthly View
            </div>
          </div>
          <div className="recharts-wrapper">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MONTHLY_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px 16px' }} 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="deals" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorDeals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden animate-block">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -z-0"></div>
          
          <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-6 relative z-10">Pipeline Status</h2>
          
          <div className="space-y-6 relative z-10">
            {[
              { stage: 'Negotiation', count: 2, color: 'bg-amber-400', pct: 40, icon: '💬' },
              { stage: 'Agreement',   count: 2, color: 'bg-blue-500',  pct: 40, icon: '📄' },
              { stage: 'Closed',      count: 1, color: 'bg-emerald-500', pct: 20, icon: '🏆' },
            ].map(({ stage, count, color, pct, icon }) => (
              <div key={stage} className="group">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <span className="opacity-70">{icon}</span> {stage}
                  </span>
                  <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{count} active</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${color} progress-bar group-hover:brightness-110`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 relative z-10">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Pipeline Value</p>
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">₹4,20,000</p>
              </div>
              <div className="text-emerald-500 bg-emerald-50 px-2 flex items-center py-1 rounded-lg text-xs font-bold border border-emerald-100">
                +12% <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads Table Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-block">
        <div className="p-6 sm:px-8 sm:pt-8 sm:pb-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Recent Leads</h2>
            <p className="text-sm text-gray-500 mt-1">Latest prospects added to the system</p>
          </div>
          <Link to="/leads" className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
            View All Directory →
          </Link>
        </div>

        <div className="overflow-x-auto">
          {leads.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📭</div>
              <p className="text-gray-500 font-medium">No leads in the system yet</p>
              <Link to="/leads" className="text-blue-600 font-medium text-sm mt-2 inline-block hover:underline">Add your first lead</Link>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4">Client Name</th>
                  <th className="px-8 py-4">Contact Detail</th>
                  <th className="px-8 py-4">Lead Source</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-500 font-medium">{lead.phone}</td>
                    <td className="px-8 py-5 capitalize">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status] || STATUS_COLORS['New']}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          lead.status === 'Closed' ? 'bg-green-500' : 
                          lead.status === 'Lost' ? 'bg-red-500' : 
                          lead.status === 'Qualified' ? 'bg-purple-500' : 
                          lead.status === 'Contacted' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></span>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <div className="mt-12 text-center text-sm font-medium text-gray-400 pb-8">
        <p>RealCRM Platform © 2026</p>
      </div>
    </div>
  );
};

export default Dashboard;

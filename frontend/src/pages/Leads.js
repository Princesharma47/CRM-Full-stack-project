import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { fetchLeads, createLead, updateLead, deleteLead } from '../api/leadApi';
import { useDebouncedValue } from '../hooks/useDebounce';

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  New:         'bg-blue-50   text-blue-700   ring-1 ring-blue-600/20',
  Contacted:   'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20',
  Qualified:   'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
  Negotiation: 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20',
  Closed:      'bg-green-50  text-green-700  ring-1 ring-green-600/20',
  Lost:        'bg-red-50    text-red-700    ring-1 ring-red-600/20',
};

const ALL_STATUSES = ['New', 'Contacted', 'Qualified', 'Negotiation', 'Closed', 'Lost'];
const ALL_SOURCES  = ['Website', 'Facebook', 'Call', 'Referral', 'Ad', 'Other'];

const EMPTY_FORM = {
  name: '', phone: '', email: '', budget: '',
  source: 'Website', status: 'New', followUpDate: '',
};

// ─── Sub-components ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
    {status}
  </span>
);

const InputField = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
      {label}{required && ' *'}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 focus:bg-white';

// ─── Main Component ──────────────────────────────────────────────────────────
const Leads = () => {
  const [leads,         setLeads]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [showModal,     setShowModal]     = useState(false);
  const [editLead,      setEditLead]      = useState(null);   // null = create mode
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');
  const [filterStatus,  setFilterStatus]  = useState('');
  const [filterSource,  setFilterSource]  = useState('');
  const [search,        setSearch]        = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const leadsRef = useRef(null);

  // Re-fetch whenever filters change
  // debouncedSearch prevents an API call on every keystroke
  useEffect(() => { loadLeads(); }, [filterStatus, filterSource, debouncedSearch]); // eslint-disable-line

  const loadLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterStatus)   params.status = filterStatus;
      if (filterSource)   params.source = filterSource;
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await fetchLeads(params);
      setLeads(res.data.data || []);
    } catch {
      setError('Failed to load leads. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // GSAP row stagger — only on first successful load, not every filter change
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!loading && leads.length > 0 && !hasAnimated.current) {
      hasAnimated.current = true;
      const ctx = gsap.context(() => {
        gsap.from('.lead-row', {
          y: 16, opacity: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out',
        });
      }, leadsRef);
      return () => ctx.revert();
    }
  }, [loading, leads]);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditLead(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (lead) => {
    setEditLead(lead);
    setForm({
      name:        lead.name,
      phone:       lead.phone,
      email:       lead.email || '',
      budget:      lead.budget || '',
      source:      lead.source || 'Website',
      status:      lead.status,
      followUpDate: lead.followUpDate
        ? new Date(lead.followUpDate).toISOString().split('T')[0]
        : '',
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setError(''); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and Phone are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editLead) {
        await updateLead(editLead._id, form);
      } else {
        await createLead(form);
      }
      closeModal();
      loadLeads();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lead.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead? This cannot be undone.')) return;
    try {
      await deleteLead(id);
      loadLeads();
    } catch {
      setError('Failed to delete lead.');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateLead(id, { status });
      loadLeads();
    } catch {
      setError('Failed to update status.');
    }
  };

  const clearFilters = () => { setFilterStatus(''); setFilterSource(''); setSearch(''); };
  const hasFilters   = filterStatus || filterSource || search;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={leadsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Leads Directory</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `${leads.length} lead${leads.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button
          id="add-lead-btn"
          onClick={openAdd}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm transition-all hover:shadow-md active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Lead
        </button>
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────── */}
      {error && !showModal && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl mb-6 shadow-sm">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search name, phone, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-shadow"
          />
        </div>

        {/* Status filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Source filter */}
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="">All Sources</option>
          {ALL_SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-50/80 text-xs text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Follow-Up</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="text-4xl mb-3">📭</div>
                      <p className="text-gray-500 font-medium">
                        {hasFilters ? 'No leads match your filters' : 'No leads in your database'}
                      </p>
                      {hasFilters ? (
                        <button onClick={clearFilters} className="text-blue-600 text-sm font-semibold mt-2">
                          Clear filters →
                        </button>
                      ) : (
                        <button onClick={openAdd} className="text-blue-600 text-sm font-semibold mt-2">
                          Add your first lead →
                        </button>
                      )}
                    </td>
                  </tr>
                ) : leads.map((lead) => (
                  <tr key={lead._id} className="lead-row hover:bg-gray-50/50 transition-colors group">
                    {/* Client */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-sm ring-2 ring-white shadow-sm flex-shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lead.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{lead.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    {/* Phone */}
                    <td className="px-6 py-5 text-gray-600 font-medium">{lead.phone}</td>
                    {/* Budget */}
                    <td className="px-6 py-5 font-semibold text-gray-700">
                      {lead.budget ? `₹${Number(lead.budget).toLocaleString('en-IN')}` : <span className="text-gray-400 font-normal">TBD</span>}
                    </td>
                    {/* Source */}
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 capitalize">
                        {lead.source}
                      </span>
                    </td>
                    {/* Follow-up */}
                    <td className="px-6 py-5 text-gray-500 text-xs">
                      {lead.followUpDate
                        ? new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : <span className="text-gray-300">—</span>}
                    </td>
                    {/* Stage inline dropdown */}
                    <td className="px-6 py-5 w-44">
                      <div className="relative">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`appearance-none w-full px-3 py-1.5 pr-7 rounded-full text-xs font-bold border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-all ${STATUS_COLORS[lead.status]}`}
                        >
                          {ALL_STATUSES.map(s => <option key={s} className="bg-white text-gray-800">{s}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                          <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(lead)}
                          className="text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 p-2 rounded-lg transition-colors"
                          title="Edit Lead"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete Lead"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl animate-[slideUp_0.3s_ease-out]">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {editLead ? '✏️ Edit Lead' : '➕ Add New Prospect'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editLead ? 'Update lead information' : 'Enter client details to track in pipeline'}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Error inside modal */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 border border-red-100">
                {error}
              </div>
            )}

            {/* Form Grid */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Client Name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="Jane Doe"
                  />
                </InputField>
                <InputField label="Phone Number" required>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+91 98765 43210"
                  />
                </InputField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Email Address">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="jane@company.com"
                  />
                </InputField>
                <InputField label="Est. Budget (₹)">
                  <input
                    type="number"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className={inputClass}
                    placeholder="5000000"
                  />
                </InputField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Lead Source">
                  <select
                    value={form.source}
                    onChange={(e) => setForm({ ...form, source: e.target.value })}
                    className={inputClass + ' cursor-pointer'}
                  >
                    {ALL_SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </InputField>
                <InputField label="Current Status">
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={inputClass + ' cursor-pointer'}
                  >
                    {ALL_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </InputField>
              </div>

              <InputField label="Follow-Up Date">
                <input
                  type="date"
                  value={form.followUpDate}
                  onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
                  className={inputClass}
                />
              </InputField>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50"
              >
                {saving ? 'Saving…' : editLead ? 'Update Lead' : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default Leads;

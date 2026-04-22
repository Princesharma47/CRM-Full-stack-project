import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import gsap from 'gsap';
import { fetchDeals, fetchSummary, createDeal, updateDeal, deleteDeal } from '../api/dealApi';
import { useDebouncedValue } from '../hooks/useDebounce';

// ─── Constants ────────────────────────────────────────────────────────────────
const STAGES = ['Negotiation', 'Agreement', 'Closed', 'Lost'];

const STAGE_CONFIG = {
  Negotiation: {
    icon:       '🤝',
    gradient:   'from-amber-400 to-orange-500',
    cardBorder: 'border-l-amber-400',
    shadow:     'shadow-amber-500/20',
    badge:      'bg-amber-100 text-amber-700',
  },
  Agreement: {
    icon:       '📝',
    gradient:   'from-blue-400 to-indigo-500',
    cardBorder: 'border-l-blue-400',
    shadow:     'shadow-blue-500/20',
    badge:      'bg-blue-100 text-blue-700',
  },
  Closed: {
    icon:       '✅',
    gradient:   'from-emerald-400 to-teal-500',
    cardBorder: 'border-l-emerald-400',
    shadow:     'shadow-emerald-500/20',
    badge:      'bg-emerald-100 text-emerald-700',
  },
  Lost: {
    icon:       '❌',
    gradient:   'from-red-400 to-rose-500',
    cardBorder: 'border-l-red-400',
    shadow:     'shadow-red-500/20',
    badge:      'bg-red-100 text-red-700',
  },
};

const EMPTY_FORM = {
  title: '', client: '', dealValue: '', stage: 'Negotiation',
  commission: '', property: '', assignedAgent: '', notes: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v) =>
  Number(v) >= 100000
    ? `₹${(Number(v) / 100000).toFixed(1)}L`
    : `₹${Number(v).toLocaleString('en-IN')}`;

// ─── Deal Card (Draggable) ────────────────────────────────────────────────────
const DealCard = ({ deal, index, onEdit, onDelete }) => {
  const cfg = STAGE_CONFIG[deal.stage];
  const commissionAmt = deal.commission
    ? Math.round((deal.dealValue * deal.commission) / 100)
    : null;

  return (
    <Draggable draggableId={deal._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`deal-card group relative border-l-[6px] border border-gray-100 bg-white rounded-2xl p-4 shadow-sm
            hover:shadow-lg transition-all cursor-grab active:cursor-grabbing
            ${cfg.cardBorder}
            ${snapshot.isDragging ? `shadow-xl rotate-1 scale-105 ring-2 ring-blue-300` : ''}`}
        >
          {/* Edit / Delete on hover */}
          <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(deal)}
              className="text-indigo-400 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-100 w-6 h-6 rounded-md flex items-center justify-center text-xs transition-colors"
              title="Edit"
            >✏️</button>
            <button
              onClick={() => onDelete(deal._id)}
              className="text-red-300 hover:text-red-500 bg-red-50 hover:bg-red-100 w-6 h-6 rounded-md flex items-center justify-center text-xs transition-colors"
              title="Delete"
            >🗑</button>
          </div>

          {/* Deal title */}
          <p className="font-extrabold text-gray-900 text-sm leading-snug pr-14">{deal.title}</p>

          {/* Client */}
          <p className="text-xs text-gray-500 mt-1 font-medium">👤 {deal.client}</p>

          {/* Property */}
          {deal.property && (
            <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs font-medium">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {deal.property}
            </div>
          )}

          {/* Notes */}
          {deal.notes && (
            <p className="text-xs text-gray-400 italic mt-1.5 truncate">📝 {deal.notes}</p>
          )}

          {/* Value + Commission */}
          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                {fmt(deal.dealValue)}
              </p>
              {commissionAmt && (
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Comm: {fmt(commissionAmt)} ({deal.commission}%)
                </p>
              )}
            </div>
            <p className="text-[10px] text-gray-300 font-medium">
              {new Date(deal.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
};

// ─── Kanban Column ────────────────────────────────────────────────────────────
const KanbanColumn = ({ stage, deals, summaryItem, onEdit, onDelete }) => {
  const cfg        = STAGE_CONFIG[stage];
  const totalValue = deals.reduce((s, d) => s + Number(d.dealValue), 0);

  return (
    <div className="kanban-col flex-1 min-w-[260px] bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col max-h-full">
      {/* Column Header */}
      <div className={`shrink-0 p-4 rounded-t-3xl bg-gradient-to-r ${cfg.gradient} text-white shadow-sm ${cfg.shadow} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span>{cfg.icon}</span>
          <h3 className="font-extrabold tracking-wide uppercase text-sm drop-shadow-sm">{stage}</h3>
          <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm">
            {deals.length}
          </span>
        </div>
        <div className="text-xs font-bold opacity-90 drop-shadow-sm">
          {totalValue > 0 ? fmt(totalValue) : '—'}
        </div>
      </div>

      {/* Droppable Body */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 flex-1 overflow-y-auto space-y-3 scrollbar-hide transition-colors rounded-b-3xl
              ${snapshot.isDraggingOver ? 'bg-blue-50/60' : ''}`}
            style={{ minHeight: '280px' }}
          >
            {deals.length === 0 && !snapshot.isDraggingOver && (
              <div className="h-28 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-sm font-medium text-gray-300 bg-white/50">
                Drag deals here
              </div>
            )}
            {deals.map((deal, index) => (
              <DealCard
                key={deal._id}
                deal={deal}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

// ─── Main Deals Page ──────────────────────────────────────────────────────────
const Deals = () => {
  const [deals,     setDeals]     = useState([]);
  const [summary,   setSummary]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDeal,  setEditDeal]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [search,    setSearch]    = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const kanbanRef = useRef(null);

  useEffect(() => { loadAll(); }, [debouncedSearch]); // eslint-disable-line

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (debouncedSearch) params.search = debouncedSearch;
      const [dealsRes, sumRes] = await Promise.all([
        fetchDeals(params),
        fetchSummary(),
      ]);
      setDeals(dealsRes.data.data || []);
      setSummary(sumRes.data.data || []);
    } catch {
      setError('Failed to load deals. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // GSAP entrance animations — only on initial load
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (loading || hasAnimated.current) return;
    hasAnimated.current = true;
    const ctx = gsap.context(() => {
      gsap.fromTo('.deals-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo('.kanban-col',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.deal-card',
        { opacity: 0, scale: 0.92, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, stagger: 0.03, ease: 'back.out(1.2)', delay: 0.35, clearProps: 'all' }
      );
    }, kanbanRef);
    return () => ctx.revert();
  }, [loading]);

  // ── Drag & Drop handler ────────────────────────────────────────────────────
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStage = destination.droppableId;

    // Optimistic UI update
    setDeals((prev) =>
      prev.map((d) => d._id === draggableId ? { ...d, stage: newStage } : d)
    );

    try {
      await updateDeal(draggableId, { stage: newStage });
      loadAll(); // refreshes summary counts
    } catch {
      setError('Failed to update stage. Reverting…');
      loadAll();
    }
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditDeal(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (deal) => {
    setEditDeal(deal);
    setForm({
      title:         deal.title,
      client:        deal.client,
      dealValue:     deal.dealValue,
      stage:         deal.stage,
      commission:    deal.commission || '',
      property:      deal.property || '',
      assignedAgent: deal.assignedAgent || '',
      notes:         deal.notes || '',
    });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setError(''); };

  const handleSave = async () => {
    if (!form.title || !form.client || !form.dealValue) {
      setError('Title, Client and Deal Value are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editDeal) {
        await updateDeal(editDeal._id, form);
      } else {
        await createDeal(form);
      }
      closeModal();
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save deal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deal?')) return;
    try {
      await deleteDeal(id);
      loadAll();
    } catch {
      setError('Failed to delete deal.');
    }
  };

  // Group deals by stage
  const grouped = STAGES.reduce((acc, stage) => {
    acc[stage] = deals.filter((d) => d.stage === stage);
    return acc;
  }, {});

  // Total active pipeline value (exclude Lost)
  const totalPipeline = deals
    .filter((d) => d.stage !== 'Lost')
    .reduce((s, d) => s + Number(d.dealValue), 0);

  // Commission preview in modal
  const commissionPreview =
    form.dealValue && form.commission
      ? Math.round((Number(form.dealValue) * Number(form.commission)) / 100)
      : null;

  const inputClass =
    'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors font-medium';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={kanbanRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="deals-header flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 shrink-0 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Deal Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">
            {deals.length} deal{deals.length !== 1 ? 's' : ''} &nbsp;•&nbsp; Active Pipeline: {fmt(totalPipeline)}
          </p>
        </div>
        <div className="flex gap-3 items-center w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search deals…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 font-medium"
            />
          </div>
          <button
            id="add-deal-btn"
            onClick={openAdd}
            className="bg-gray-900 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl active:scale-95 flex items-center gap-2 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Deal</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && !showModal && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl mb-4 shrink-0 text-sm font-medium">
          {error}
        </div>
      )}

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 shrink-0">
        {STAGES.map((stage) => {
          const s   = summary.find((x) => x._id === stage);
          const cfg = STAGE_CONFIG[stage];
          return (
            <div key={stage} className={`bg-gradient-to-r ${cfg.gradient} text-white rounded-2xl p-4 shadow-sm ${cfg.shadow}`}>
              <p className="text-xs font-bold opacity-90">{cfg.icon} {stage}</p>
              <p className="text-2xl font-extrabold mt-1 drop-shadow-sm">{s?.count || 0}</p>
              <p className="text-xs opacity-80 font-medium">{s ? fmt(s.totalValue) : '₹0'}</p>
            </div>
          );
        })}
      </div>

      {/* ── Kanban Board ─────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex flex-col sm:flex-row gap-5 sm:min-w-[1060px] h-full items-start">
              {STAGES.map((stage) => (
                <KanbanColumn
                  key={stage}
                  stage={stage}
                  deals={grouped[stage]}
                  summaryItem={summary.find((x) => x._id === stage)}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </DragDropContext>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {editDeal ? '✏️ Edit Deal' : '➕ New Deal'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {editDeal ? 'Update deal details' : 'Track a new deal in the pipeline'}
                </p>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl mb-4 border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deal Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 3BHK Deal — Salt Lake"
                  className={inputClass}
                />
              </div>

              {/* Client */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Client Name *</label>
                <input
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Deal Value */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Deal Value (₹) *</label>
                  <input
                    type="number"
                    value={form.dealValue}
                    onChange={(e) => setForm({ ...form, dealValue: e.target.value })}
                    placeholder="5000000"
                    className={inputClass}
                  />
                </div>
                {/* Commission % */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Commission (%)</label>
                  <input
                    type="number"
                    value={form.commission}
                    onChange={(e) => setForm({ ...form, commission: e.target.value })}
                    placeholder="2"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Commission Preview */}
              {commissionPreview && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium">
                  💰 Commission Amount: <strong>{fmt(commissionPreview)}</strong>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Stage */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Stage</label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className={inputClass + ' cursor-pointer'}
                  >
                    {STAGES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                {/* Property */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Property</label>
                  <input
                    value={form.property}
                    onChange={(e) => setForm({ ...form, property: e.target.value })}
                    placeholder="e.g. 3BHK Salt Lake"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Agent */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Assigned Agent</label>
                <input
                  value={form.assignedAgent}
                  onChange={(e) => setForm({ ...form, assignedAgent: e.target.value })}
                  placeholder="e.g. Romi Singh"
                  className={inputClass}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any deal notes or next steps…"
                  className={inputClass + ' resize-none'}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-black hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? 'Saving…' : editDeal ? 'Update Deal' : 'Save Deal'}
              </button>
              <button
                onClick={closeModal}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Deals;

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const STAGES = ['Negotiation', 'Agreement', 'Closed'];

const DEAL_COLORS = {
  Negotiation: 'border-l-amber-400 bg-white ring-amber-500/10',
  Agreement:   'border-l-blue-400 bg-white ring-blue-500/10',
  Closed:      'border-l-emerald-400 bg-white ring-emerald-500/10',
};

const HEADER_GRADIENTS = {
  Negotiation: 'from-amber-400 to-orange-500 text-white shadow-amber-500/20',
  Agreement:   'from-blue-400 to-indigo-500 text-white shadow-blue-500/20',
  Closed:      'from-emerald-400 to-teal-500 text-white shadow-emerald-500/20',
};

const EMPTY_FORM = { lead: '', property: '', stage: 'Negotiation', commission: '' };

const Deals = () => {
  const [deals, setDeals] = useState([
    { id: 1, lead: 'Rahul Sharma', property: '3BHK Noida', stage: 'Negotiation', commission: 50000 },
    { id: 2, lead: 'Neha Gupta', property: 'Office Sector 62', stage: 'Negotiation', commission: 150000 },
    { id: 3, lead: 'Priya Mehta',  property: 'Shop Sector 18', stage: 'Agreement', commission: 80000 },
    { id: 4, lead: 'Amit Singh',   property: 'Plot Delhi', stage: 'Closed', commission: 120000 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const kanbanRef = useRef(null);

  // GSAP Entrance Animations
  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Header fades in
      gsap.fromTo('.deals-header', 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      
      // 2. Kanban columns slide up with stagger
      gsap.fromTo('.kanban-col', {
        opacity: 0,
        y: 40,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });
      
      // 3. Deal cards pop into existence
      gsap.fromTo('.deal-card', {
        opacity: 0,
        scale: 0.9,
        y: 10,
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.2)',
        delay: 0.5,
        clearProps: 'all'
      });
    }, kanbanRef);
    return () => ctx.revert();
  }, []);

  const moveStage = (id, direction) => {
    setDeals(prev => prev.map(d => {
      if (d.id !== id) return d;
      const idx = STAGES.indexOf(d.stage);
      const next = STAGES[idx + direction];
      return next ? { ...d, stage: next } : d;
    }));
  };

  const addDeal = (e) => {
    e.preventDefault();
    setDeals(prev => [...prev, { ...form, id: Date.now(), commission: Number(form.commission) }]);
    setShowModal(false);
    setForm(EMPTY_FORM);
    
    // Animate newly added card by targeting it after render
    setTimeout(() => {
      gsap.fromTo(`.deal-card.deal-${Date.now()}`, 
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)' }
      );
    }, 50);
  };

  const deleteDeal = (id) => {
    // Optional: animate out before deleting
    gsap.to(`.deal-${id}`, {
      opacity: 0, scale: 0.8, duration: 0.3, onComplete: () => {
        setDeals(prev => prev.filter(d => d.id !== id));
      }
    });
  };

  return (
    <div ref={kanbanRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col">
      
      {/* Header */}
      <div className="deals-header flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Deal Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Track conversions and track expected commissions.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 mt-4 sm:mt-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Deal
        </button>
      </div>

      {/* Kanban Board Container (Scrollable horizontally on small screens) */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-[900px] h-full items-start">
          {STAGES.map((stage) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            
            // Total pipeline value for column
            const stageValue = stageDeals.reduce((sum, d) => sum + d.commission, 0);

            return (
              <div key={stage} className="kanban-col flex-1 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col max-h-full">
                
                {/* Column Header */}
                <div className={`shrink-0 p-4 rounded-t-3xl bg-gradient-to-r ${HEADER_GRADIENTS[stage]} shadow-sm flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <h3 className="font-extrabold tracking-wide uppercase text-sm drop-shadow-sm">{stage}</h3>
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm shadow-inner">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-xs font-bold opacity-90 drop-shadow-sm">
                    ₹{(stageValue/100000).toFixed(1)}L
                  </div>
                </div>

                {/* Column Body */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3 scrollbar-hide" style={{ minHeight: '300px' }}>
                  {stageDeals.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-sm font-medium text-gray-400 bg-white/50">
                      Drag deals here
                    </div>
                  )}

                  {stageDeals.map(deal => (
                    <div key={deal.id} className={`deal-card deal-${deal.id} group relative border-l-[6px] border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all ${DEAL_COLORS[stage]}`}>
                      
                      {/* Delete cross absolute top right */}
                      <button onClick={() => deleteDeal(deal.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>

                      <p className="font-extrabold text-gray-900 text-sm">{deal.lead}</p>
                      
                      <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-xs font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        {deal.property}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                        <p className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100/50">
                          Comm: ₹{Number(deal.commission).toLocaleString()}
                        </p>
                        <div className="flex gap-1.5">
                          {STAGES.indexOf(deal.stage) > 0 && (
                            <button onClick={() => moveStage(deal.id, -1)}
                              className="text-xs bg-gray-50 border border-gray-200 text-gray-600 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white hover:shadow transition-all" title="Move Back">
                              ←
                            </button>
                          )}
                          {STAGES.indexOf(deal.stage) < STAGES.length - 1 && (
                            <button onClick={() => moveStage(deal.id, 1)}
                              className="text-xs bg-blue-50 border border-blue-200 text-blue-600 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:shadow transition-all" title="Move Forward">
                              →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">New Deal Map</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900 bg-gray-50 p-2 rounded-full"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <form onSubmit={addDeal} className="space-y-4">
              {[
                { label: 'Client Name *', key: 'lead',       type: 'text', placeholder: 'e.g. John Smith' },
                { label: 'Property *',    key: 'property',   type: 'text', placeholder: 'e.g. 3BHK Noida' },
                { label: 'Expected Comm. (₹) *', key: 'commission', type: 'number', placeholder: '50000' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder} required value={form[key]}
                    onChange={e => setForm({...form, [key]: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Starting Stage</label>
                <div className="relative">
                  <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})}
                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white cursor-pointer select-none font-medium">
                    {STAGES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></div>
                </div>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-3 mt-2 rounded-xl text-sm font-bold hover:bg-black hover:shadow-lg transition-all">Save Deal tracking</button>
            </form>
          </div>
        </div>
      )}

      {/* Global Style for modal */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Deals;

import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { DELHI_NCR_PROPERTIES } from '../api/propertyData';
import gsap from 'gsap';

const STATUS_COLORS = {
  Available: 'bg-green-100 text-green-700',
  Sold:      'bg-red-100 text-red-700',
  Rented:    'bg-yellow-100 text-yellow-700',
};

const TYPE_ICONS = {
  residential: '🏠',
  commercial:  '🏢',
  land:        '🌿',
};

const EMPTY_FORM = {
  title: '', type: 'residential', price: '', description: '',
  size: '', city: '', state: '', status: 'Available',
};

const PropertyCard = ({ p }) => (
  <div className="property-card bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow group">
    <div className="relative overflow-hidden">
      <img
        src={p.images?.[0]?.startsWith('/') ? `http://localhost:5000${p.images[0]}` : p.images?.[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'}
        alt={p.title}
        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="absolute top-4 left-4 z-10">
        <span className={`text-xs px-3 py-1.5 rounded-full font-extrabold shadow-md backdrop-blur-md bg-white/90 border border-white/20 ${STATUS_COLORS[p.status]}`}>
          {p.status}
        </span>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-gray-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md capitalize border border-white/10">
          {TYPE_ICONS[p.type]} {p.subtype || p.type}
        </span>
      </div>
    </div>

    <div className="p-5">
      <h3 className="font-extrabold text-gray-900 text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">{p.title}</h3>
      <p className="text-xs font-semibold text-gray-400 mb-4 flex items-center gap-1">
        <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
        {p.location?.address ? `${p.location.address}, ` : ''}{p.location?.city || p.location}
      </p>
      
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 font-black text-2xl tracking-tight">
          ₹{(p.price / 100000).toFixed(1)}L
        </p>
        <button className="bg-gray-50 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-blue-600 hover:text-white transition-colors duration-300">
          →
        </button>
      </div>

      <div className="flex gap-4 text-xs font-bold text-gray-400">
        {p.bedrooms > 0 && <span className="flex items-center gap-1.5 object-cover"><span className="text-gray-300">🛏</span> {p.bedrooms} BHK</span>}
        {p.bathrooms > 0 && <span className="flex items-center gap-1.5 object-cover"><span className="text-gray-300">🚿</span> {p.bathrooms} Bath</span>}
        {p.size && <span className="flex items-center gap-1.5 object-cover"><span className="text-gray-300">📐</span> {p.size} sqft</span>}
      </div>
      
      {p.amenities?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {p.amenities.slice(0, 3).map(a => (
            <span key={a} className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100 line-clamp-1">
              {a}
            </span>
          ))}
          {p.amenities.length > 3 && (
            <span className="text-[10px] font-bold bg-blue-50 text-blue-500 px-2 py-1 rounded-md">
              +{p.amenities.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);

const Properties = () => {
  const [dbProperties, setDbProperties]  = useState([]);
  const [showModal, setShowModal]        = useState(false);
  const [form, setForm]                  = useState(EMPTY_FORM);
  const [images, setImages]              = useState([]);
  const [filters, setFilters]            = useState({ city: '', type: '', minPrice: '', maxPrice: '', subtype: '' });
  const [activeTab, setActiveTab]        = useState('all');
  const [loading, setLoading]            = useState(true);

  const containerRef = useRef(null);

  const fetchDBProperties = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/properties');
      setDbProperties(data.data || data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchDBProperties(); }, []);

  // Merge DB properties with Delhi NCR sample data
  const allProperties = [...dbProperties, ...DELHI_NCR_PROPERTIES];

  const filtered = allProperties.filter(p => {
    const cityMatch  = !filters.city    || (p.location?.city || p.location)?.toLowerCase().includes(filters.city.toLowerCase());
    const typeMatch  = !filters.type    || p.type?.toLowerCase() === filters.type?.toLowerCase() || (filters.type === 'residential' && p.type === 'Apartment'); 
    const minMatch   = !filters.minPrice|| p.price >= Number(filters.minPrice);
    const maxMatch   = !filters.maxPrice|| p.price <= Number(filters.maxPrice);
    const tabMatch   = activeTab === 'all' || p.type?.toLowerCase() === activeTab?.toLowerCase() || (activeTab === 'residential' && p.type === 'Apartment');
    return cityMatch && typeMatch && minMatch && maxMatch && tabMatch;
  });

  // GSAP Animation when filters/tabs change
  useEffect(() => {
    if (loading) return;
    let ctx = gsap.context(() => {
      // Filter controls slide in from top on load
      gsap.from('.filter-controls', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.out' });
      
      // Animate cards on every filter execution
      if (filtered.length > 0) {
        gsap.fromTo('.property-card', 
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'back.out(1.1)', clearProps: 'all' }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [loading, filters, activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.append('location', `${form.city}, ${form.state}`);
    images.forEach(img => formData.append('images', img));
    await API.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    setShowModal(false);
    setForm(EMPTY_FORM);
    fetchDBProperties();
  };

  const CITIES = ['All Cities', 'Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Greater Noida', 'Faridabad'];

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Property Gallery</h1>
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>
            {filtered.length} active listings in Delhi NCR
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-black hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 mt-4 sm:mt-0"
        >
          <span>🏠</span> Add Property
        </button>
      </div>

      <div className="filter-controls">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all', label: 'All Listings' },
            { key: 'residential', label: '🏠 Residential' },
            { key: 'commercial',  label: '🏢 Commercial'  },
            { key: 'land',        label: '🌿 Land/Plots'  },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-8 shadow-sm flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Location</label>
            <select
              value={filters.city}
              onChange={e => setFilters({ ...filters, city: e.target.value === 'All Cities' ? '' : e.target.value })}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer w-40 bg-gray-50 hover:bg-white transition-colors"
            >
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Min Price</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 font-medium font-serif">₹</span>
              <input
                type="number" placeholder="50 L"
                value={filters.minPrice}
                onChange={e => setFilters({ ...filters, minPrice: e.target.value ? e.target.value * 100000 : '' })}
                className="border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-medium w-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Max Price</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 font-medium font-serif">₹</span>
              <input
                type="number" placeholder="500 L"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: e.target.value ? e.target.value * 100000 : '' })}
                className="border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm font-medium w-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
          </div>
          <button
            onClick={() => setFilters({ city: '', type: '', minPrice: '', maxPrice: '', subtype: '' })}
            className="border border-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-56 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                <div className="h-8 bg-gray-100 rounded-lg w-1/3 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <div className="text-6xl mb-4 opacity-50 block filter grayscale">🏚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Matching Properties</h3>
              <p className="text-gray-500 font-medium">Try adjusting your filters or location to see more results.</p>
              <button 
                onClick={() => setFilters({ city: '', type: '', minPrice: '', maxPrice: '', subtype: '' })}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filtered.map(p => <PropertyCard key={p._id} p={p} />)
          )}
        </div>
      )}

      {/* Add Property Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">Add Property Listing</h2>
                <p className="text-sm text-gray-500 font-medium">Publish a new asset to the catalog</p>
              </div>
              <button onClick={() => setShowModal(false)} className="bg-gray-50 hover:bg-gray-100 text-gray-500 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Property Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 3BHK Luxury Apartment in Sector 62"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer">
                    <option>residential</option>
                    <option>commercial</option>
                    <option>land</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (₹) *</label>
                  <input required type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 8500000"
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
                  <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer">
                    <option value="">Select city</option>
                    {['Delhi','Noida','Gurgaon','Ghaziabad','Greater Noida','Faridabad'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Size (sq ft)</label>
                  <input type="number" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}
                    placeholder="e.g. 1200"
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Property Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the property's key features..."
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cover Images (Multiple)</label>
                <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                  <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files))}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 cursor-pointer" />
                </div>
              </div>
              <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
                <button type="submit" className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-black hover:shadow-lg transition-all">
                  Publish Property
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Style for modal and utilities */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Properties;

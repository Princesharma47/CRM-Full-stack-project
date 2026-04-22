import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  fetchProperties, createProperty,
  updateProperty, deleteProperty, deleteImage,
} from '../api/propertyApi';
import { useDebouncedValue } from '../hooks/useDebounce';

// ─── Constants ────────────────────────────────────────────────────────────────
const IMG_BASE = `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/`;

const getImgSrc = (img) => {
  if (!img) return null;
  if (img.startsWith('http://') || img.startsWith('https://')) return img;
  if (img.startsWith('/')) return `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${img}`;
  return IMG_BASE + img;
};

const STATUS_COLORS = {
  Available: 'bg-green-100 text-green-700',
  Sold:      'bg-red-100 text-red-700',
  Reserved:  'bg-yellow-100 text-yellow-700',
  Pending:   'bg-yellow-100 text-yellow-700',
};

const TYPE_ICONS = {
  Residential: '🏠',
  Commercial:  '🏢',
  Plot:        '🌍',
  Villa:       '🏡',
  // legacy lowercase values
  residential: '🏠',
  commercial:  '🏢',
  land:        '🌿',
};

const ALL_TYPES    = ['Residential', 'Commercial', 'Plot', 'Villa'];
const ALL_STATUSES = ['Available', 'Sold', 'Reserved'];

const EMPTY_FORM = {
  title: '', location: '', price: '', size: '',
  type: 'Residential', status: 'Available',
  amenities: '', description: '',
};

// ─── Property Card ────────────────────────────────────────────────────────────
const PropertyCard = ({ p, onEdit, onDelete, onView }) => {
  const imgSrc = getImgSrc(p.images?.[0]);

  return (
    <div className="property-card bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow group">
      {/* Image */}
      <div className="relative overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={p.title}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-6xl">
            {TYPE_ICONS[p.type] || '🏠'}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 z-10">
          <span className={`text-xs px-3 py-1.5 rounded-full font-extrabold shadow-md backdrop-blur-md bg-white/90 border border-white/20 ${STATUS_COLORS[p.status] || 'bg-gray-100 text-gray-600'}`}>
            {p.status}
          </span>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gray-900/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-md capitalize">
            {TYPE_ICONS[p.type]} {p.type}
          </span>
        </div>
        {/* Photo count badge */}
        {p.images?.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-md">
            🖼 {p.images.length}
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="font-extrabold text-gray-900 text-base leading-snug mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {p.title}
        </h3>
        <p className="text-xs font-semibold text-gray-400 mb-4 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {p.location}
        </p>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 font-black text-2xl tracking-tight">
            ₹{p.price >= 100000 ? `${(p.price / 100000).toFixed(1)}L` : Number(p.price).toLocaleString('en-IN')}
          </p>
          {p.size && (
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
              📐 {p.size}
            </span>
          )}
        </div>

        {/* Amenities */}
        {p.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {p.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100">
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

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onView(p)}
            className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-xs font-bold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            👁 View
          </button>
          <button
            onClick={() => onEdit(p)}
            className="flex-1 bg-gray-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(p._id)}
            className="px-3 border border-red-200 text-red-500 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Properties = () => {
  const [properties,    setProperties]   = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [showModal,     setShowModal]    = useState(false);
  const [editProperty,  setEditProperty] = useState(null);
  const [viewProperty,  setViewProperty] = useState(null);
  const [form,          setForm]         = useState(EMPTY_FORM);
  const [files,         setFiles]        = useState([]);
  const [previews,      setPreviews]     = useState([]);
  const [saving,        setSaving]       = useState(false);
  const [error,         setError]        = useState('');
  const [filterStatus,  setFilterStatus] = useState('');
  const [filterType,    setFilterType]   = useState('');
  const [search,        setSearch]       = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [activeTab,     setActiveTab]    = useState('all');
  const containerRef = useRef(null);

  useEffect(() => { loadProperties(); }, [filterStatus, filterType, debouncedSearch]); // eslint-disable-line

  const loadProperties = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus)    params.status = filterStatus;
      if (filterType)      params.type   = filterType;
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await fetchProperties(params);
      setProperties(res.data.data || res.data || []);
    } catch {
      setError('Failed to load properties. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // GSAP card animation — only on first mount, not on every filter change
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (loading) return;
    if (!hasAnimated.current && properties.length > 0) {
      hasAnimated.current = true;
    }
    const ctx = gsap.context(() => {
      if (!loading) {
        gsap.from('.filter-controls', { y: -16, opacity: 0, duration: 0.4, ease: 'power2.out' });
      }
      if (properties.length > 0) {
        gsap.fromTo(
          '.property-card',
          { opacity: 0, scale: 0.93, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(1.1)', clearProps: 'all' }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditProperty(null);
    setForm(EMPTY_FORM);
    setFiles([]);
    setPreviews([]);
    setError('');
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProperty(p);
    setForm({
      title:       p.title,
      location:    p.location,
      price:       p.price,
      size:        p.size || '',
      type:        p.type,
      status:      p.status,
      amenities:   p.amenities?.join(', ') || '',
      description: p.description || '',
    });
    setFiles([]);
    setPreviews([]);
    setError('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setError(''); };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSave = async () => {
    if (!form.title || !form.location || !form.price) {
      setError('Title, Location and Price are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append('images', f));

      if (editProperty) {
        await updateProperty(editProperty._id, fd);
      } else {
        await createProperty(fd);
      }
      closeModal();
      loadProperties();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save property.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property? Images will also be removed.')) return;
    try {
      await deleteProperty(id);
      if (viewProperty?._id === id) setViewProperty(null);
      loadProperties();
    } catch {
      setError('Failed to delete property.');
    }
  };

  const handleDeleteImage = async (propId, filename) => {
    if (!window.confirm('Remove this image?')) return;
    try {
      const res = await deleteImage(propId, filename);
      // Update the view modal in real-time
      setViewProperty(res.data.data);
      loadProperties();
    } catch {
      setError('Failed to remove image.');
    }
  };

  // Tab + filter combined filtering (client-side for tab, server-side for status/type/search)
  const displayed = activeTab === 'all'
    ? properties
    : properties.filter((p) => p.type?.toLowerCase() === activeTab.toLowerCase());

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Property Gallery</h1>
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
            {displayed.length} listing{displayed.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          id="add-property-btn"
          onClick={openAdd}
          className="bg-gray-900 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-gray-900/20 hover:bg-black hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 mt-4 sm:mt-0"
        >
          🏠 Add Property
        </button>
      </div>

      {/* ── Error Banner ────────────────────────────────────────────────── */}
      {error && !showModal && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl mb-6 shadow-sm">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="filter-controls">
        {/* ── Type Tabs ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all',         label: 'All Listings' },
            { key: 'Residential', label: '🏠 Residential' },
            { key: 'Commercial',  label: '🏢 Commercial' },
            { key: 'Plot',        label: '🌍 Plots' },
            { key: 'Villa',       label: '🏡 Villa' },
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

        {/* ── Filter Bar ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-8 shadow-sm flex flex-wrap gap-4 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Search</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search title or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-gray-50 hover:bg-white transition-colors"
            >
              <option value="">All Status</option>
              {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-gray-50 hover:bg-white transition-colors"
            >
              <option value="">All Types</option>
              {ALL_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Clear */}
          <button
            onClick={() => { setFilterStatus(''); setFilterType(''); setSearch(''); setActiveTab('all'); }}
            className="border border-gray-200 text-gray-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* ── Property Cards Grid ──────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <div className="text-6xl mb-4 opacity-50">🏚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Matching Properties</h3>
          <p className="text-gray-500 font-medium">Try adjusting your filters or search term.</p>
          <button
            onClick={() => { setFilterStatus(''); setFilterType(''); setSearch(''); setActiveTab('all'); }}
            className="mt-4 text-blue-600 font-bold hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayed.map((p) => (
            <PropertyCard
              key={p._id}
              p={p}
              onView={setViewProperty}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── View Detail Modal ────────────────────────────────────────────── */}
      {viewProperty && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">{viewProperty.title}</h2>
                <p className="text-sm text-gray-400 mt-1">📍 {viewProperty.location}</p>
              </div>
              <button onClick={() => setViewProperty(null)} className="bg-gray-50 hover:bg-gray-100 text-gray-500 p-2 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</p>
                <p className="font-bold text-indigo-600 text-lg mt-0.5">
                  ₹{viewProperty.price >= 100000 ? `${(viewProperty.price / 100000).toFixed(1)}L` : Number(viewProperty.price).toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[viewProperty.status] || 'bg-gray-100 text-gray-600'}`}>
                  {viewProperty.status}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
                <p className="font-semibold text-gray-700 mt-0.5">{TYPE_ICONS[viewProperty.type]} {viewProperty.type}</p>
              </div>
              {viewProperty.size && (
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Size</p>
                  <p className="font-semibold text-gray-700 mt-0.5">📐 {viewProperty.size}</p>
                </div>
              )}
            </div>

            {viewProperty.description && (
              <div className="mb-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed">{viewProperty.description}</p>
              </div>
            )}

            {viewProperty.amenities?.length > 0 && (
              <div className="mb-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {viewProperty.amenities.map((a) => (
                    <span key={a} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-semibold">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {viewProperty.images?.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Photos ({viewProperty.images.length})
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {viewProperty.images.map((img) => {
                    const src = getImgSrc(img);
                    return (
                      <div key={img} className="relative group">
                        <img
                          src={src}
                          alt="property"
                          className="w-full h-28 object-cover rounded-xl border border-gray-100"
                        />
                        <button
                          onClick={() => handleDeleteImage(viewProperty._id, img)}
                          className="absolute top-1.5 right-1.5 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewProperty.images?.length === 0 && (
              <div className="text-center py-8 text-gray-300 text-sm border border-dashed border-gray-200 rounded-2xl">
                No photos uploaded yet
              </div>
            )}

            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              <button
                onClick={() => { setViewProperty(null); openEdit(viewProperty); }}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-colors"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(viewProperty._id)}
                className="flex-1 border border-red-200 text-red-500 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ─────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  {editProperty ? '✏️ Edit Property' : '🏠 Add Property Listing'}
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {editProperty ? 'Update property details' : 'Publish a new asset to the catalog'}
                </p>
              </div>
              <button onClick={closeModal} className="bg-gray-50 hover:bg-gray-100 text-gray-500 p-2 rounded-full transition-colors">
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
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Property Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 3BHK Luxury Apartment in Sector 62"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Location *</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="e.g. Salt Lake, Kolkata"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="5000000"
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                {/* Size */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Size (sq ft)</label>
                  <input
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="e.g. 1200 sq.ft"
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    {ALL_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                {/* Status */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
                  >
                    {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Amenities (comma separated)</label>
                <input
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                  placeholder="e.g. Parking, Gym, Swimming Pool, Lift"
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the property's key features..."
                  className="w-full border border-gray-200 bg-gray-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {editProperty ? 'Add More Images (max 5)' : 'Cover Images (max 5)'}
                </label>
                <div className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-4 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFiles}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700 cursor-pointer"
                  />
                </div>
                {/* Image previews */}
                {previews.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {previews.map((src, i) => (
                      <img key={i} src={src} alt="preview" className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm" />
                    ))}
                  </div>
                )}
                {editProperty?.images?.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    📌 {editProperty.images.length} existing photo{editProperty.images.length > 1 ? 's' : ''} — new uploads will be appended
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-black hover:shadow-lg transition-all disabled:opacity-50"
              >
                {saving ? 'Saving…' : editProperty ? 'Update Property' : 'Publish Property'}
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

      {/* Global animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Properties;

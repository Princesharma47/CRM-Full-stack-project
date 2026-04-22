const activities = [
  {
    title: 'Team Building Workshop',
    date: 'March 2025',
    description: 'An immersive full-day workshop focused on collaboration, communication, and strengthening team bonds across departments.',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    tag: 'Workshop',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Annual Celebration Event',
    date: 'January 2025',
    description: 'A grand evening celebrating another successful year — recognizing achievements, milestones, and the spirit of Agnayi.',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    tag: 'Celebration',
    tagColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    title: 'Client Success Meet',
    date: 'February 2025',
    description: 'An exclusive gathering with our valued clients to share success stories, insights, and future real estate opportunities.',
    img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
    tag: 'Client Event',
    tagColor: 'bg-cyan-100 text-cyan-700',
  },
  {
    title: 'Employee Recognition Day',
    date: 'April 2025',
    description: 'Honouring our top performers and long-serving team members who embody the values and vision of Agnayi Infra Resources.',
    img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
    tag: 'Recognition',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
];

const LifeAtAgnayi = () => (
  <div className="min-h-screen bg-gray-50">

    {/* ── Hero ──────────────────────────────────────────────────────────── */}
    <section className="relative bg-[#0a1628] overflow-hidden">
      {/* subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      {/* glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
        {/* eyebrow */}
        <span className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Our Culture
        </span>

        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-none mb-6">
          LIFE AT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">AGNAYI</span>
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          At Agnayi Infra Resources, we believe that our greatest strength lies in our people.
          Life at Agnayi is more than just work — it is about learning, growing, celebrating,
          and building a culture rooted in respect, collaboration, and purpose. Whether it's a
          team training workshop, an outing, or celebrating a colleague's milestone, life at
          Agnayi reflects a vibrant and people-first culture.
        </p>

        {/* quote card */}
        <div className="relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 max-w-2xl mx-auto">
          <svg className="w-8 h-8 text-blue-400/60 mb-3 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <p className="text-white/90 text-base font-medium leading-relaxed italic">
            Because at Agnayi, we don't just facilitate real estate journeys — we create a culture
            where our team feels as valued as our clients.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-blue-400/40" />
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Agnayi Infra Resources</span>
            <div className="h-px w-8 bg-blue-400/40" />
          </div>
        </div>
      </div>
    </section>

    {/* ── Stats strip ───────────────────────────────────────────────────── */}
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {[
          { value: '200+', label: 'Team Members' },
          { value: '12+', label: 'Years of Excellence' },
          { value: '5000+', label: 'Happy Clients' },
          { value: '98%', label: 'Employee Satisfaction' },
        ].map(({ value, label }) => (
          <div key={label}>
            <p className="text-3xl font-black text-blue-600">{value}</p>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Activities ────────────────────────────────────────────────────── */}
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
          What We've Been Up To
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 mb-3 tracking-tight">
          Recent Activities at Agnayi
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          A glimpse into the moments that define our culture — from workshops to celebrations,
          every event is a reflection of who we are.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activities.map((a) => (
          <div
            key={a.title}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
          >
            {/* image */}
            <div className="relative overflow-hidden h-44">
              <img
                src={a.img}
                alt={a.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${a.tagColor}`}>
                {a.tag}
              </span>
            </div>

            {/* body */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mb-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {a.date}
              </div>
              <h3 className="font-extrabold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                {a.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{a.description}</p>

              <div className="mt-4 pt-4 border-t border-gray-50">
                <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  View Highlights
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── CTA Banner ────────────────────────────────────────────────────── */}
    <section className="bg-gradient-to-r from-blue-700 to-indigo-700 mx-6 mb-12 rounded-3xl overflow-hidden">
      <div className="max-w-3xl mx-auto px-8 py-14 text-center">
        <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
          Want to be part of the Agnayi family?
        </h3>
        <p className="text-blue-100 text-sm mb-7 leading-relaxed">
          We're always looking for passionate individuals who share our vision of building
          exceptional real estate experiences.
        </p>
        <button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
          Explore Careers at Agnayi
        </button>
      </div>
    </section>

  </div>
);

export default LifeAtAgnayi;

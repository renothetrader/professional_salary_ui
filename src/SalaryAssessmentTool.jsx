import React, { useMemo, useState, useEffect } from 'react';
import './SalaryAssessmentTool.css';

// Utility to format currency
const formatAED = (n) => `AED ${n.toLocaleString()}`;

// UAE Min-Mid-Max salary data with categories and locations (truncated subset for brevity; extend as needed)
const salaryData = [
  { title: 'Partner', category: 'Audit', location: 'UAE', min: 94000, mid: 113000, max: 132000, currency: 'AED', notes: '5+ years' },
  { title: 'Partner', category: 'Audit', location: 'UAE', min: 66000, mid: 77000, max: 88000, currency: 'AED', notes: '1-4 years' },
  { title: 'Director', category: 'Audit', location: 'UAE', min: 44000, mid: 49500, max: 55000, currency: 'AED' },
  { title: 'Senior Manager', category: 'Audit', location: 'UAE', min: 36000, mid: 38500, max: 41000, currency: 'AED' },
  { title: 'Manager', category: 'Audit', location: 'UAE', min: 24000, mid: 28500, max: 33000, currency: 'AED' },
  { title: 'Assistant Manager', category: 'Audit', location: 'UAE', min: 20000, mid: 22000, max: 24000, currency: 'AED' },
  { title: 'Senior Associate', category: 'Audit', location: 'UAE', min: 14000, mid: 16500, max: 19000, currency: 'AED' },
  { title: 'Associate', category: 'Audit', location: 'UAE', min: 8000, mid: 10500, max: 13000, currency: 'AED' },
  { title: 'Head of Corporate Banking', category: 'Corporate Banking', location: 'UAE', min: 96000, mid: 121000, max: 146000, currency: 'AED' },
  { title: 'Chief Compliance Officer (CCO)', category: 'Compliance & Regulation', location: 'UAE', min: 102000, mid: 113500, max: 125000, currency: 'AED' },
  { title: 'Chief Risk Officer', category: 'Risk', location: 'UAE', min: 82000, mid: 106500, max: 131000, currency: 'AED' },
  { title: 'Group Chief Financial Officer', category: 'Finance & Accounting', location: 'UAE', min: 102000, mid: 127500, max: 153000, currency: 'AED' },
  { title: 'HR Director', category: 'HR', location: 'UAE', min: 58000, mid: 75000, max: 92000, currency: 'AED' },
  { title: 'Chief Legal Officer', category: 'Legal', location: 'UAE', min: 92000, mid: 112000, max: 132000, currency: 'AED' },
  { title: 'Managing Director', category: 'Manufacturing', location: 'UAE', min: 103000, mid: 122500, max: 142000, currency: 'AED' },
  { title: 'Supply Chain Director', category: 'Supply Chain', location: 'UAE', min: 49000, mid: 60000, max: 71000, currency: 'AED' },
  { title: 'Programme Director', category: 'Construction & Project Management', location: 'UAE', min: 78000, mid: 105500, max: 133000, currency: 'AED' },
  { title: 'Chief Commercial Officer', category: 'Sales & Post Construction', location: 'UAE', min: 99000, mid: 125500, max: 152000, currency: 'AED' },
  { title: 'Chief Marketing Officer (CMO)', category: 'Consumer (B2C) Marketing', location: 'UAE', min: 85000, mid: 102500, max: 120000, currency: 'AED' },
  { title: 'Head of Equities', category: 'Asset Management', location: 'UAE', min: 82000, mid: 101000, max: 120000, currency: 'AED' },
  { title: 'Managing Director', category: 'Investment Banking', location: 'UAE', min: 99000, mid: 128000, max: 157000, currency: 'AED' },
  { title: 'Chief Investment Officer', category: 'Public Sector (Investments)', location: 'UAE', min: 137000, mid: 172500, max: 208000, currency: 'AED' },
  { title: 'Partner', category: 'Private Practice - Regional Firms', location: 'UAE', min: 110000, mid: 175500, max: 241000, currency: 'AED' },
];

const unique = (arr) => Array.from(new Set(arr)).sort();

const SalaryAssessmentTool = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('UAE');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Derived lists
  const allTitles = useMemo(() => unique(salaryData.map(d => d.title)), []);
  const allCategories = useMemo(() => ['All', ...unique(salaryData.map(d => d.category))], []);
  const allLocations = useMemo(() => ['UAE', ...unique(salaryData.map(d => d.location).filter(l => l !== 'UAE'))], []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allTitles.slice(0, 8);
    return allTitles.filter(t => t.toLowerCase().includes(q)).slice(0, 10);
  }, [query, allTitles]);

  const results = useMemo(() => {
    return salaryData.filter((r) => {
      const matchesTitle = selectedTitle ? r.title === selectedTitle : query ? r.title.toLowerCase().includes(query.toLowerCase()) : true;
      const matchesCategory = category === 'All' ? true : r.category === category;
      const matchesLocation = location ? r.location === location : true;
      return matchesTitle && matchesCategory && matchesLocation;
    });
  }, [query, selectedTitle, category, location]);

  useEffect(() => {
    if (!query) setSelectedTitle('');
  }, [query]);

  const handleSuggestionClick = (t) => {
    setSelectedTitle(t);
    setQuery(t);
    setShowSuggestions(false);
  };

  return (
    <div className="sat-wrapper">
      <header className="sat-header">
        <div className="sat-brand">
          <img src="/logo.png" alt="Company Logo" className="sat-logo" onError={(e)=>{e.currentTarget.style.display='none'}} />
          <div className="sat-title">
            <h1>Professional UAE Salary Assessment</h1>
            <p>Min–Mid–Max ranges • Live search • Category filter</p>
          </div>
        </div>
      </header>

      <section className="sat-controls">
        <div className="sat-control search">
          <label>Job Title</label>
          <div className="sat-searchbox">
            <input
              type="text"
              value={query}
              onChange={(e)=>{ setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={()=> setShowSuggestions(true)}
              placeholder="Type to search job titles..."
            />
            {query && (
              <button className="sat-clear" aria-label="Clear" onClick={()=>{ setQuery(''); setSelectedTitle(''); }}>×</button>
            )}
          </div>
          {showSuggestions && (
            <ul className="sat-suggestions" onMouseLeave={()=> setShowSuggestions(false)}>
              {suggestions.length ? suggestions.map((t)=> (
                <li key={t} onClick={()=> handleSuggestionClick(t)}>{t}</li>
              )) : (
                <li className="muted">No matches. Try a different term.</li>
              )}
            </ul>
          )}
        </div>

        <div className="sat-control">
          <label>Category</label>
          <select value={category} onChange={(e)=> setCategory(e.target.value)}>
            {allCategories.map((c)=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="sat-control">
          <label>Location</label>
          <select value={location} onChange={(e)=> setLocation(e.target.value)}>
            {allLocations.map((l)=> <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </section>

      <section className="sat-results">
        {results.length === 0 && (
          <div className="sat-empty">No results found. Adjust filters or search.</div>
        )}

        {results.length > 0 && (
          <div className="sat-cards">
            {results.map((r, idx)=> (
              <article key={`${r.title}-${r.category}-${idx}`} className="sat-card">
                <header>
                  <h3>{r.title}</h3>
                  <span className="sat-badge">{r.category}</span>
                </header>
                <div className="sat-range">
                  <div className="min">
                    <span className="label">Min</span>
                    <strong>{formatAED(r.min)}</strong>
                  </div>
                  <div className="mid">
                    <span className="label">Mid</span>
                    <strong>{formatAED(r.mid)}</strong>
                  </div>
                  <div className="max">
                    <span className="label">Max</span>
                    <strong>{formatAED(r.max)}</strong>
                  </div>
                </div>
                <footer>
                  <span className="muted">{r.location} • {r.currency}{r.notes ? ` • ${r.notes}` : ''}</span>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="sat-footer">Data provided as guidance only. © {new Date().getFullYear()}</footer>
    </div>
  );
};

export default SalaryAssessmentTool;

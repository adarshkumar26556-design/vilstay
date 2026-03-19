import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getResorts } from '../services/api';
import ResortCard from '../components/ResortCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiFilter, FiX, FiGrid, FiList } from 'react-icons/fi';
import { MdHotel } from 'react-icons/md';

const CATEGORIES = ['luxury', 'boutique', 'heritage', 'eco', 'budget'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name', label: 'A – Z' },
];

export default function ResortListPage() {
  const [params, setParams] = useSearchParams();
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || 'newest';

  const setParam = (k, v) => {
    const p = new URLSearchParams(params);
    if (v) p.set(k, v); else p.delete(k);
    p.delete('page');
    setPage(1);
    setParams(p);
  };

  useEffect(() => {
    setLoading(true);
    const p = { page, limit: 12 };
    if (search) p.search = search;
    if (category) p.category = category;
    if (sort) p.sort = sort;

    getResorts(p)
      .then((r) => { setResorts(r.data.resorts); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, category, sort, page]);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Search bar strip */}
      <div className="bg-white shadow-sm border-b border-gray-100 py-4 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6"><SearchBar compact /></div>
      </div>

      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`${filterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="card p-5 sticky top-36">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {(category || sort !== 'newest') && (
                  <button onClick={() => { setParam('category', ''); setParam('sort', ''); }} className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><FiX size={12} />Clear</button>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Category</p>
                <div className="space-y-2">
                  {CATEGORIES.map((c) => (
                    <label key={c} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={category === c}
                        onChange={() => setParam('category', c)}
                        className="accent-primary-600"
                      />
                      <span className={`text-sm capitalize ${category === c ? 'text-primary-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>{c}</span>
                    </label>
                  ))}
                  {category && (
                    <button onClick={() => setParam('category', '')} className="text-xs text-gray-400 hover:text-primary-600 mt-1">Show all</button>
                  )}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Sort By</p>
                <div className="space-y-2">
                  {SORT_OPTIONS.map((s) => (
                    <label key={s.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="sort"
                        checked={sort === s.value}
                        onChange={() => setParam('sort', s.value)}
                        className="accent-primary-600"
                      />
                      <span className={`text-sm ${sort === s.value ? 'text-primary-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'}`}>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {search ? `Results for "${search}"` : category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Resorts` : 'All Resorts'}
                </h1>
                {!loading && <p className="text-sm text-gray-400 mt-0.5">{total} properties found</p>}
              </div>
              <button onClick={() => setFilterOpen(!filterOpen)} className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
                <FiFilter size={14} /> Filters
              </button>
            </div>

            {loading ? (
              <LoadingSpinner text="Searching resorts..." />
            ) : resorts.length === 0 ? (
              <div className="card p-16 text-center">
                <MdHotel size={56} className="mx-auto mb-4 text-gray-200" />
                <h3 className="font-bold text-gray-700 mb-2">No resorts found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {resorts.map((r) => <ResortCard key={r._id} resort={r} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${page === p ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

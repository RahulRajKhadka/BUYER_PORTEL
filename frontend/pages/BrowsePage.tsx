import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useProperties } from '../hooks/useProperties.js';
import { PropertyCard } from '../compnents/property/PropertyCard.js';
import { Spinner } from '../compnents/ui/Spinner.js';
import { EmptyState } from '../compnents/ui/EmptyState.js';
import type { PropertyFilters } from '../services/propertyService.js';

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'commercial', 'land'];
const PROPERTY_STATUSES = ['available', 'sold', 'rented', 'pending'];

const STATUS_PILL: Record<string, string> = {
  available: 'bg-green-50 text-green-700 border-green-200',
  sold:      'bg-red-50 text-red-600 border-red-200',
  rented:    'bg-blue-50 text-blue-700 border-blue-200',
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
};

export const BrowsePage = () => {
  const [filters, setFilters] = useState<PropertyFilters>({ page: 1, limit: 12 });
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { data, isLoading, isFetching, isError, refetch } = useProperties(filters);

  const properties = data?.data ?? [];
  const meta = data?.meta;

 
  const setFilter = (key: keyof PropertyFilters, value: string | number | undefined) =>
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));

  const clearFilters = () => { 
    setFilters({ page: 1, limit: 12 }); 
    setSearch(''); 
  };

  const hasFilters = !!(filters.type || filters.status || filters.search || filters.minPrice || filters.maxPrice);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-[#7a7670] mb-1">Real estate listings</p>
          <h1 className="text-3xl font-light tracking-tight text-[#1a1916]">
            Browse <span className="font-semibold">Properties</span>
          </h1>
          <p className="text-xs text-[#7a7670] mt-1.5">
            {meta ? `${meta.total.toLocaleString()} properties found` : 'Loading listings…'}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors mt-1 ${
            showFilters || hasFilters
              ? 'bg-[#1a1916] text-white border-[#1a1916]'
              : 'bg-white text-[#7a7670] border-[#e5e2da] hover:border-[#c5c2ba] hover:text-[#1a1916]'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-white/70" />}
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b4b2a9] pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, city or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
           
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e5e2da] rounded-[10px] bg-white text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors"
          />
        </div>
      
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-[#e5e2da] rounded-xl p-5 flex flex-col gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-[#7a7670] mb-1.5">Type</label>
              <select
                value={filters.type ?? ''}
                onChange={(e) => setFilter('type', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#e5e2da] rounded-[10px] bg-white text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors"
              >
                <option value="">All types</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-[#7a7670] mb-1.5">Status</label>
              <select
                value={filters.status ?? ''}
                onChange={(e) => setFilter('status', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#e5e2da] rounded-[10px] bg-white text-[#1a1916] outline-none focus:border-[#1a1916] transition-colors"
              >
                <option value="">All statuses</option>
                {PROPERTY_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-[#7a7670] mb-1.5">Min price</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice ?? ''}
                onChange={(e) => setFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2.5 text-sm border border-[#e5e2da] rounded-[10px] bg-white text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-[#7a7670] mb-1.5">Max price</label>
              <input
                type="number"
                placeholder="Any"
                value={filters.maxPrice ?? ''}
                onChange={(e) => setFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2.5 text-sm border border-[#e5e2da] rounded-[10px] bg-white text-[#1a1916] placeholder-[#b4b2a9] outline-none focus:border-[#1a1916] transition-colors"
              />
            </div>
          </div>

          {/* Quick status pills */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[#7a7670] mb-2">Quick status</p>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_STATUSES.map((s) => {
                const active = filters.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setFilter('status', active ? undefined : s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-colors ${
                      active ? 'bg-[#1a1916] text-white border-[#1a1916]' : STATUS_PILL[s] ?? 'bg-white text-[#7a7670] border-[#e5e2da]'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {hasFilters && (
            <div className="flex justify-end border-t border-[#f0ede6] pt-4">
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 text-xs text-[#7a7670] hover:text-[#1a1916] transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 -mt-2">
          {filters.type && (
            <Chip label={`Type: ${filters.type}`} onRemove={() => setFilter('type', undefined)} />
          )}
          {filters.status && (
            <Chip label={`Status: ${filters.status}`} onRemove={() => setFilter('status', undefined)} color={STATUS_PILL[filters.status]} />
          )}
          {filters.search && (
            <Chip label={`"${filters.search}"`} onRemove={() => { setSearch(''); setFilter('search', undefined); }} />
          )}
          {filters.minPrice && (
            <Chip label={`Min $${filters.minPrice.toLocaleString()}`} onRemove={() => setFilter('minPrice', undefined)} />
          )}
          {filters.maxPrice && (
            <Chip label={`Max $${filters.maxPrice.toLocaleString()}`} onRemove={() => setFilter('maxPrice', undefined)} />
          )}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-[#7a7670]">Loading properties…</p>
        </div>
      ) : isError ? (
        <EmptyState
          icon={Search}
          title="Something went wrong"
          description="Failed to load properties. Please try again."
          action={{ label: "Retry", onClick: () => refetch() }}
        />
      ) : properties.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={Search}
            title="No matching properties"
            description="Try adjusting your search or filter criteria to find more properties."
            action={{ label: "Clear filters", onClick: clearFilters }}
          />
        ) : (
          <EmptyState
            icon={SlidersHorizontal}
            title="No properties yet"
            description="Be the first to discover amazing properties in your area. Check back soon!"
          />
        )
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#7a7670]">
              Showing <span className="font-medium text-[#1a1916]">{properties.length}</span>
              {meta && <> of <span className="font-medium text-[#1a1916]">{meta.total.toLocaleString()}</span> properties</>}
            </p>
            {isFetching && (
              <div className="flex items-center gap-1.5 text-xs text-[#7a7670]">
                <Spinner size="sm" /> Updating…
              </div>
            )}
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-200 ${isFetching ? 'opacity-50 pointer-events-none' : ''}`}>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
                className="px-4 py-2 text-xs font-medium border border-[#e5e2da] rounded-[8px] bg-white text-[#7a7670] hover:border-[#c5c2ba] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setFilters((f) => ({ ...f, page }))}
                    className={`w-8 h-8 rounded-[8px] text-xs font-medium transition-colors ${
                      page === filters.page
                        ? 'bg-[#1a1916] text-white'
                        : 'text-[#7a7670] hover:bg-[#f0ede6]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                {meta.totalPages > 5 && (
                  <span className="text-xs text-[#b4b2a9] px-1">… {meta.totalPages}</span>
                )}
              </div>

              <button
                disabled={filters.page === meta.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
                className="px-4 py-2 text-xs font-medium border border-[#e5e2da] rounded-[8px] bg-white text-[#7a7670] hover:border-[#c5c2ba] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Chip = ({ label, onRemove, color }: { label: string; onRemove: () => void; color?: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${color ?? 'bg-[#f7f6f2] text-[#7a7670] border-[#e5e2da]'}`}>
    {label}
    <button onClick={onRemove} className="hover:opacity-60 transition-opacity leading-none">
      <X className="w-3 h-3" />
    </button>
  </span>
);
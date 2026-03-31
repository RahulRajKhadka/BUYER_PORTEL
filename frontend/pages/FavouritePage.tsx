import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavourites } from '../hooks/useFavourties.js';
import { Spinner } from '../compnents/ui/Spinner.js';
import { FavouriteCard } from '../compnents/property/FavoutriteCard.js';
import { EmptyState } from '../compnents/ui/EmptyState.js';
import { useAuthStore } from '../store/authStore.js';
import { Navigate } from 'react-router-dom';

export const FavouritesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useFavourites(page, 10);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Extract data from response
  const favourites = data?.data?.favourites || data?.data || [];
  const meta = data?.meta || { total: favourites.length, page: 1, totalPages: 1 };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-[#7a7670] mb-1">
            Saved properties
          </p>
          <h1 className="text-3xl font-light tracking-tight text-[#1a1916]">
            My <span className="font-semibold">Favourites</span>
          </h1>
          <p className="text-xs text-[#7a7670] mt-1.5">
            {meta.total} saved {meta.total === 1 ? 'property' : 'properties'}
          </p>
        </div>
        <button
          onClick={() => navigate('/browse')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#1a1916] text-white rounded-lg hover:bg-[#333] transition-colors"
        >
          Browse more
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-[#7a7670]">Loading favourites…</p>
        </div>
      ) : isError ? (
        <EmptyState
          icon={Heart}
          title="Something went wrong"
          description="Failed to load your favourites. Please try again."
          action={{ label: "Retry", onClick: () => refetch() }}
        />
      ) : favourites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          description="Save properties by clicking the heart icon while browsing"
          action={{ label: "Browse Properties", onClick: () => navigate('/browse') }}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {favourites.map((favourite: any) => (
              <FavouriteCard key={favourite._id} favourite={favourite} />
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 text-xs font-medium border border-[#e5e2da] rounded-[8px] bg-white text-[#7a7670] hover:border-[#c5c2ba] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              <span className="text-xs text-[#7a7670] px-2">
                Page {page} of {meta.totalPages}
              </span>
              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 text-xs font-medium border border-[#e5e2da] rounded-[8px] bg-white text-[#7a7670] hover:border-[#c5c2ba] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
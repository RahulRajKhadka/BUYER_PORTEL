import { useNavigate } from 'react-router-dom';
import { Heart, Search, Home, Shield, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { useFavourites } from '../hooks/useFavourties.js';
import { useProperties } from '../hooks/useProperties.js';

const roleColor: Record<string, string> = {
  buyer: 'bg-blue-50 text-blue-700',
  agent: 'bg-blue-50 text-blue-700',
  admin: 'bg-purple-50 text-purple-700',
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: favouritesData, isLoading: loadingFavs } = useFavourites(1);
  const { data: propertiesData, isLoading: loadingProps } = useProperties({
    limit: 4,
    status: 'available',
  });

  const favs = favouritesData?.data ?? [];
  const recentProps = propertiesData?.data ?? [];
  const totalFavs = favouritesData?.meta?.total ?? 0;

  return (
    <div className="mx-7 px-4 py-8 flex flex-col mt-7 gap-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">{greeting()}</p>
          <h1 className="text-3xl font-light tracking-tight text-gray-900">
            {user?.name?.split(' ')[0]}{' '}
            <span className="font-semibold">{user?.name?.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${roleColor[user?.role ?? 'buyer']}`}>
              <Shield className="w-3 h-3" />
              {user?.role}
            </span>
            <span className="text-xs text-gray-400">{user?.email}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => navigate('/browse')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:text-gray-900 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            Browse
          </button>
          <button
            onClick={() => navigate('/favourites')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            Favourites
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center mb-3">
            <Heart className="w-3.5 h-3.5 text-red-500" />
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Saved</p>
          <p className="text-2xl font-light text-gray-900">{totalFavs}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <Home className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Listings</p>
          <p className="text-2xl font-light text-gray-900">{propertiesData?.meta?.total ?? '—'}</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center mb-3">
            <Calendar className="w-3.5 h-3.5 text-green-600" />
          </div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Member since</p>
          <p className="text-sm font-medium text-gray-900 mt-1.5">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : '—'}
          </p>
        </div>
      </div>

      {/* Favourites */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">My Favourites</p>
          {favs.length > 0 && (
            <button
              onClick={() => navigate('/favourites')}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              See all →
            </button>
          )}
        </div>

        {loadingFavs ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : favs.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">No favourites yet</p>
            <p className="text-xs text-gray-400 mb-4 mt-4">Save properties you love while browsing</p>
            <button
              onClick={() => navigate('/browse')}
              className="px-4 py-2 mt-6 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Start browsing
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {favs.slice(0, 3).map((fav) => (
              <div
                key={fav._id}
                className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 hover:border-gray-200 transition-colors cursor-pointer"
                onClick={() => navigate(`/properties/${fav.property?._id}`)}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg flex-shrink-0">
                  🏡
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{fav.property?.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{fav.property?.location}</p>
                </div>
                {fav.property?.price && (
                  <p className="text-sm font-semibold text-blue-600 whitespace-nowrap">
                    Rs {(fav.property.price / 100000).toFixed(0)}L
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Listings */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium uppercase tracking-widest text-gray-400">New Listings</p>
          <button
            onClick={() => navigate('/browse')}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Browse all →
          </button>
        </div>

        {loadingProps ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentProps.map((property) => (
              <div
                key={property._id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors cursor-pointer"
                onClick={() => navigate(`/properties/${property._id}`)}
              >
                <div className="h-20 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-2xl border-b border-gray-100">
                  🏠
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{property.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 mb-2">{property.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {property.price ? `Rs ${(property.price / 100000).toFixed(0)}L` : '—'}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
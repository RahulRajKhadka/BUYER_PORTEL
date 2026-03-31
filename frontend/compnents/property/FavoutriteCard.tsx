import { Heart, MapPin, Bed, Bath, Square, Trash2 } from 'lucide-react';
import type { Favourite } from "../../types/index.js"
import { Badge } from '../ui/Badge.js';
import { Button } from '../ui/Button.js';
import { useRemoveFavourite } from '../../hooks/useFavourties.js';

interface FavouriteCardProps {
  favourite: Favourite;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

const statusVariant: Record<string, 'green' | 'yellow' | 'red' | 'stone'> = {
  available: 'green', pending: 'yellow', sold: 'red', rented: 'stone',
};

export const FavouriteCard = ({ favourite }: FavouriteCardProps) => {
  const { property } = favourite;
  const remove = useRemoveFavourite();
  const image = property.images?.[0] || `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80`;

  return (
    <div className="card overflow-hidden hover:shadow-md transition-all duration-300 animate-slide-up">
      <div className="flex gap-4 p-4">
        {/* Thumbnail */}
        <div className="w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-stone-100">
          <img src={image} alt={property.title} className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-display font-semibold text-stone-800 text-base leading-snug line-clamp-1">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-stone-400 text-xs mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{property.address.city}, {property.address.state}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              loading={remove.isPending}
              onClick={() => remove.mutate(favourite._id)}
              className="text-red-400 hover:bg-red-50 hover:text-red-500 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3 text-stone-500 text-xs mt-2">
            {property.features.bedrooms > 0 && (
              <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{property.features.bedrooms}</span>
            )}
            {property.features.bathrooms > 0 && (
              <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{property.features.bathrooms}</span>
            )}
            <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5" />{property.features.area.toLocaleString()} ft²</span>
            <Badge variant={statusVariant[property.status] || 'stone'} className="capitalize">
              {property.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="font-display font-semibold text-brand-700">{formatPrice(property.price)}</span>
            <span className="text-xs text-stone-400">
              Saved {new Date(favourite.createdAt).toLocaleDateString()}
            </span>
          </div>

          {favourite.notes && (
            <p className="mt-2 text-xs text-stone-500 italic bg-stone-50 rounded-lg px-2 py-1 line-clamp-2">
              "{favourite.notes}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
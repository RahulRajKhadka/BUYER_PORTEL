import { Heart, Bed, Bath, Square, MapPin, Car, Sofa } from "lucide-react";
import { clsx } from "clsx";
import toast from 'react-hot-toast';
import type { Property } from "../../types/index.js";
import { Badge } from "../ui/Badge.js";
import { useToggleFavourite } from "../../hooks/useFavourties.js";
import { useAuthStore } from "../../store/authStore.js";

interface PropertyCardProps {
  property: Property;
  isFavourited?: boolean;
  onFavouriteChange?: () => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const statusVariant: Record<string, "green" | "yellow" | "red" | "stone"> = {
  available: "green",
  pending: "yellow",
  sold: "red",
  rented: "stone",
};

const typeLabels: Record<string, string> = {
  apartment: "Apt",
  house: "House",
  villa: "Villa",
  commercial: "Commercial",
  land: "Land",
};

export const PropertyCard = ({
  property,
  isFavourited,
  onFavouriteChange,
}: PropertyCardProps) => {
  const { isAuthenticated } = useAuthStore();
  const toggle = useToggleFavourite();

  const handleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add favourites');
      return;
    }
    
    toggle.mutate(property._id, {
      onSuccess: () => {
        if (onFavouriteChange) onFavouriteChange();
      }
    });
  };

  const favd = isFavourited ?? property.isFavourited ?? false;
  const image = property.images?.[0] ||
    `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80`;

  // Safe navigation
  const features = property.features || {
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    parking: false,
    furnished: false
  };

  const address = property.address || {
    city: 'Location not specified',
    state: ''
  };

  return (
    <div className="card group overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={property.title || "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge
            variant={statusVariant[property.status] || "stone"}
            className="capitalize shadow-sm"
          >
            {property.status || "Unknown"}
          </Badge>
          <Badge variant="stone" className="shadow-sm">
            {typeLabels[property.type] || property.type || "Property"}
          </Badge>
        </div>

        {/* ❤️ FAVOURITE BUTTON - This adds to favourites */}
        <button
          onClick={handleFavourite}
          disabled={toggle.isPending}
          className={clsx(
            "absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center",
            "transition-all duration-200 active:scale-90 shadow-sm z-10",
            favd
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white/90 backdrop-blur-sm text-stone-500 hover:bg-white hover:text-red-400"
          )}
          aria-label={favd ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart className={clsx("w-4 h-4", favd && "fill-current")} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-stone-800 text-base leading-snug line-clamp-1 mb-1">
          {property.title || "Untitled Property"}
        </h3>

        <div className="flex items-center gap-1 text-stone-400 text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">
            {address.city}{address.state && `, ${address.state}`}
          </span>
        </div>

        
        <div className="flex items-center gap-3 text-stone-500 text-xs mb-4">
          {features.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              {features.bedrooms} bd
            </span>
          )}
          {features.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              {features.bathrooms} ba
            </span>
          )}
          <span className="flex items-center gap-1">
            <Square className="w-3.5 h-3.5" />
            {features.area.toLocaleString()} ft²
          </span>
          {features.parking && <Car className="w-3.5 h-3.5"  />}
          {features.furnished && <Sofa className="w-3.5 h-3.5" />}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="font-semibold text-brand-700 text-lg">
            {formatPrice(property.price || 0)}
          </span>
          <span className="text-xs text-stone-400">
            ${Math.round((property.price || 0) / (features.area || 1)).toLocaleString()}/ft²
          </span>
        </div>
      </div>
    </div>
  );
};
import { Clock, MapPin, User } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Listing = Database['public']['Tables']['marketplace_listings']['Row'] & {
  profiles?: { full_name: string; college_name: string };
  categories?: { name: string };
};

interface MarketplaceCardProps {
  listing: Listing;
  onClick: () => void;
}

export default function MarketplaceCard({ listing, onClick }: MarketplaceCardProps) {
  const imageUrl = listing.images?.[0] || 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=400';
  const timeAgo = getTimeAgo(new Date(listing.created_at));

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-xs font-semibold text-gray-900 rounded-full shadow-sm">
            {listing.categories?.name || 'Other'}
          </span>
        </div>
        {listing.status !== 'available' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-white rounded-lg font-bold text-gray-900 uppercase text-sm">
              {listing.status}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {listing.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-blue-600">
            ₹{listing.price.toLocaleString()}
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
            {listing.condition.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-1">
            <User size={14} />
            <span className="line-clamp-1">{listing.profiles?.full_name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{timeAgo}</span>
          </div>
        </div>

        {listing.location && (
          <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
            <MapPin size={14} />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

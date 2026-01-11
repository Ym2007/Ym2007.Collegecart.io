import { MapPin, Phone, Calendar, Users, Home } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type PGListing = Database['public']['Tables']['pg_accommodations']['Row'] & {
  profiles?: { full_name: string; college_name: string };
};

interface PGCardProps {
  pg: PGListing;
  onClick: () => void;
}

export default function PGCard({ pg, onClick }: PGCardProps) {
  const imageUrl = pg.images?.[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 group"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={pg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-xs font-semibold text-gray-900 rounded-full shadow-sm capitalize">
            {pg.room_type}
          </span>
        </div>
        {pg.status !== 'available' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-white rounded-lg font-bold text-gray-900 uppercase text-sm">
              Occupied
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {pg.title}
        </h3>

        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
          <MapPin size={16} className="flex-shrink-0" />
          <span className="line-clamp-1">{pg.address}</span>
        </div>

        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              ₹{pg.rent_per_month.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
          <div className="flex items-center space-x-1 text-gray-600">
            <Home size={16} />
            <span className="text-sm capitalize">{pg.room_type}</span>
          </div>
        </div>

        {pg.amenities && pg.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {pg.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {amenity}
              </span>
            ))}
            {pg.amenities.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{pg.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Users size={14} />
            <span className="capitalize">{pg.gender_preference || 'Any'}</span>
          </div>
          {pg.available_from && (
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>From {new Date(pg.available_from).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

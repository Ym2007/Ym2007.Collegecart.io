import { X, MapPin, Phone, Calendar, Users, Home, Check } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type PGListing = Database['public']['Tables']['pg_accommodations']['Row'] & {
  profiles?: { full_name: string; college_name: string };
};

interface PGDetailModalProps {
  pg: PGListing;
  onClose: () => void;
}

export default function PGDetailModal({ pg, onClose }: PGDetailModalProps) {
  const imageUrl = pg.images?.[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-gray-900 transition-all shadow-lg"
        >
          <X size={24} />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-auto">
            <img
              src={imageUrl}
              alt={pg.title}
              className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-sm font-semibold text-gray-900 rounded-full shadow-lg capitalize">
                {pg.room_type} Room
              </span>
            </div>
          </div>

          <div className="p-8 overflow-y-auto max-h-[600px]">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{pg.title}</h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  ₹{pg.rent_per_month.toLocaleString()}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-700">{pg.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Home className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Room Type</h3>
                  <p className="text-gray-700 capitalize">{pg.room_type}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Gender Preference</h3>
                  <p className="text-gray-700 capitalize">{pg.gender_preference || 'Any'}</p>
                </div>
              </div>

              {pg.available_from && (
                <div className="flex items-start space-x-3">
                  <Calendar className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Available From</h3>
                    <p className="text-gray-700">
                      {new Date(pg.available_from).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{pg.description}</p>
            </div>

            {pg.amenities && pg.amenities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {pg.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2 text-gray-700">
                      <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-blue-600" />
                      </div>
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                Contact Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Phone size={18} className="text-gray-400" />
                  <span className="font-medium">{pg.contact_phone}</span>
                </div>
                {pg.profiles && (
                  <div className="text-sm text-gray-600">
                    <p>Posted by {pg.profiles.full_name}</p>
                    <p>{pg.profiles.college_name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${pg.contact_phone}`}
                className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02]"
              >
                Call Now
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${pg.latitude},${pg.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white border-2 border-blue-600 text-blue-600 text-center py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all"
              >
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

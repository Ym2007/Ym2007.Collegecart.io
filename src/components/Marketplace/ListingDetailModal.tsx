import { X, User, MapPin, Phone, Calendar } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Listing = Database['public']['Tables']['marketplace_listings']['Row'] & {
  profiles?: { full_name: string; college_name: string; phone?: string };
  categories?: { name: string };
};

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

export default function ListingDetailModal({ listing, onClose }: ListingDetailModalProps) {
  const imageUrl = listing.images?.[0] || 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800';

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
              alt={listing.title}
              className="w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-sm font-semibold text-gray-900 rounded-full shadow-lg">
                {listing.categories?.name || 'Other'}
              </span>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h2>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-blue-600">
                  ₹{listing.price.toLocaleString()}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full capitalize">
                  {listing.condition.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {listing.location && (
              <div className="mb-6 flex items-start space-x-3">
                <MapPin className="text-gray-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-700">{listing.location}</p>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Seller Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {listing.profiles?.full_name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {listing.profiles?.college_name || 'College Student'}
                    </p>
                  </div>
                </div>

                {listing.profiles?.phone && (
                  <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <Phone size={18} className="text-gray-400" />
                    <span>{listing.profiles.phone}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2 text-gray-600 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <span>
                    Listed {new Date(listing.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <a
                href={`tel:${listing.profiles?.phone || ''}`}
                className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02]"
              >
                Contact Seller
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

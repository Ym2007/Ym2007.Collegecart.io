import { useState, useEffect } from 'react';
import { X, Upload, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'marketplace' | 'pg';
  onSuccess: () => void;
}

export default function CreateListingModal({ isOpen, onClose, type, onSuccess }: CreateListingModalProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [marketplaceData, setMarketplaceData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    condition: 'good' as const,
    location: '',
  });

  const [pgData, setPgData] = useState({
    title: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    rent_per_month: '',
    room_type: 'single' as const,
    contact_phone: '',
    gender_preference: 'any' as const,
    available_from: '',
    amenities: '',
  });

  useEffect(() => {
    if (type === 'marketplace') {
      loadCategories();
    }
  }, [type]);

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
  };

  if (!isOpen) return null;

  const handleMarketplaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('marketplace_listings')
        .insert({
          user_id: user.id,
          title: marketplaceData.title,
          description: marketplaceData.description,
          price: parseFloat(marketplaceData.price),
          category_id: marketplaceData.category_id,
          condition: marketplaceData.condition,
          location: marketplaceData.location || null,
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePGSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const amenitiesArray = pgData.amenities
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const { error: insertError } = await supabase
        .from('pg_accommodations')
        .insert({
          user_id: user.id,
          title: pgData.title,
          description: pgData.description,
          address: pgData.address,
          latitude: parseFloat(pgData.latitude),
          longitude: parseFloat(pgData.longitude),
          rent_per_month: parseFloat(pgData.rent_per_month),
          room_type: pgData.room_type,
          contact_phone: pgData.contact_phone,
          gender_preference: pgData.gender_preference,
          available_from: pgData.available_from || null,
          amenities: amenitiesArray,
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {type === 'marketplace' ? 'List an Item' : 'Post PG Accommodation'}
          </h2>
          <p className="text-gray-600 mb-6">
            {type === 'marketplace'
              ? 'Fill in the details to list your item for sale'
              : 'Provide details about the PG accommodation'}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {type === 'marketplace' ? (
            <form onSubmit={handleMarketplaceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={marketplaceData.title}
                  onChange={(e) => setMarketplaceData({ ...marketplaceData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="e.g., iPhone 12 Pro Max"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={marketplaceData.category_id}
                    onChange={(e) => setMarketplaceData({ ...marketplaceData, category_id: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={marketplaceData.condition}
                    onChange={(e) =>
                      setMarketplaceData({
                        ...marketplaceData,
                        condition: e.target.value as typeof marketplaceData.condition,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={marketplaceData.price}
                  onChange={(e) => setMarketplaceData({ ...marketplaceData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  min="0"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={marketplaceData.location}
                  onChange={(e) => setMarketplaceData({ ...marketplaceData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Main Campus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={marketplaceData.description}
                  onChange={(e) => setMarketplaceData({ ...marketplaceData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                  rows={4}
                  placeholder="Describe your item in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post Listing'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePGSubmit} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PG Name/Title
                </label>
                <input
                  type="text"
                  value={pgData.title}
                  onChange={(e) => setPgData({ ...pgData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="e.g., Comfortable PG Near College"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address
                </label>
                <input
                  type="text"
                  value={pgData.address}
                  onChange={(e) => setPgData({ ...pgData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  placeholder="Complete address with area and landmarks"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={pgData.latitude}
                    onChange={(e) => setPgData({ ...pgData, latitude: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    placeholder="28.7041"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={pgData.longitude}
                    onChange={(e) => setPgData({ ...pgData, longitude: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    placeholder="77.1025"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent (₹)
                  </label>
                  <input
                    type="number"
                    value={pgData.rent_per_month}
                    onChange={(e) => setPgData({ ...pgData, rent_per_month: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    min="0"
                    placeholder="8000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type
                  </label>
                  <select
                    value={pgData.room_type}
                    onChange={(e) =>
                      setPgData({ ...pgData, room_type: e.target.value as typeof pgData.room_type })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                    <option value="shared">Shared</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={pgData.contact_phone}
                    onChange={(e) => setPgData({ ...pgData, contact_phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender Preference
                  </label>
                  <select
                    value={pgData.gender_preference}
                    onChange={(e) =>
                      setPgData({
                        ...pgData,
                        gender_preference: e.target.value as typeof pgData.gender_preference,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="any">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From (optional)
                </label>
                <input
                  type="date"
                  value={pgData.available_from}
                  onChange={(e) => setPgData({ ...pgData, available_from: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={pgData.amenities}
                  onChange={(e) => setPgData({ ...pgData, amenities: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="WiFi, AC, Laundry, Parking"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={pgData.description}
                  onChange={(e) => setPgData({ ...pgData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                  rows={4}
                  placeholder="Describe the accommodation, nearby facilities, rules, etc."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Posting...' : 'Post PG Listing'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

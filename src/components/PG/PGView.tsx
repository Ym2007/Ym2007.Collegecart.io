import { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Grid, Map as MapIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import PGCard from './PGCard';
import PGDetailModal from './PGDetailModal';
import type { Database } from '../../lib/database.types';

type PGListing = Database['public']['Tables']['pg_accommodations']['Row'] & {
  profiles?: { full_name: string; college_name: string };
};

export default function PGView() {
  const [pgListings, setPgListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPG, setSelectedPG] = useState<PGListing | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [filters, setFilters] = useState({
    roomType: 'all',
    genderPreference: 'all',
    maxRent: '',
  });

  useEffect(() => {
    loadPGListings();
  }, []);

  const loadPGListings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pg_accommodations')
      .select(`
        *,
        profiles (full_name, college_name)
      `)
      .order('created_at', { ascending: false });

    if (data) setPgListings(data);
    setLoading(false);
  };

  const filteredPGListings = pgListings.filter((pg) => {
    const matchesSearch =
      pg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pg.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pg.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoomType =
      filters.roomType === 'all' || pg.room_type === filters.roomType;

    const matchesGender =
      filters.genderPreference === 'all' ||
      pg.gender_preference === filters.genderPreference ||
      pg.gender_preference === 'any';

    const matchesRent =
      !filters.maxRent || pg.rent_per_month <= parseFloat(filters.maxRent);

    return matchesSearch && matchesRoomType && matchesGender && matchesRent;
  });

  const openInGoogleMaps = () => {
    if (filteredPGListings.length > 0) {
      const firstPG = filteredPGListings[0];
      window.open(
        `https://www.google.com/maps/search/PG+accommodation/@${firstPG.latitude},${firstPG.longitude},14z`,
        '_blank'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find PG Accommodation</h1>
          <p className="text-gray-600">Discover comfortable and affordable stays near your college</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by location, area, or PG name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={openInGoogleMaps}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <MapPin size={18} />
                  <span className="hidden sm:inline">View on Maps</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={filters.roomType}
                onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm"
              >
                <option value="all">All Room Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="shared">Shared</option>
              </select>

              <select
                value={filters.genderPreference}
                onChange={(e) => setFilters({ ...filters, genderPreference: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-sm"
              >
                <option value="all">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <input
                type="number"
                placeholder="Max rent"
                value={filters.maxRent}
                onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-32 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter size={16} />
              <span>{filteredPGListings.length} accommodations found</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPGListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No PG accommodations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPGListings.map((pg) => (
              <PGCard
                key={pg.id}
                pg={pg}
                onClick={() => setSelectedPG(pg)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPG && (
        <PGDetailModal
          pg={selectedPG}
          onClose={() => setSelectedPG(null)}
        />
      )}
    </div>
  );
}

import { ShoppingBag, Home, User, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  currentView: 'marketplace' | 'pg';
  onViewChange: (view: 'marketplace' | 'pg') => void;
  onAuthClick: () => void;
  onCreateClick: () => void;
}

export default function Header({ currentView, onViewChange, onAuthClick, onCreateClick }: HeaderProps) {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                CampusHub
              </h1>
            </div>

            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => onViewChange('marketplace')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'marketplace'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => onViewChange('pg')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentView === 'pg'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home size={18} className="inline mr-2" />
                Find PG
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={onCreateClick}
                  className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105"
                >
                  <Plus size={18} />
                  <span>Post</span>
                </button>

                <div className="flex items-center space-x-3 border-l border-gray-200 pl-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                    <p className="text-xs text-gray-500">{profile?.college_name}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <button
                    onClick={signOut}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all"
                    title="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        <nav className="md:hidden flex space-x-1 pb-2">
          <button
            onClick={() => onViewChange('marketplace')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              currentView === 'marketplace'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => onViewChange('pg')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              currentView === 'pg'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home size={18} className="inline mr-2" />
            Find PG
          </button>
        </nav>
      </div>
    </header>
  );
}

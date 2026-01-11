import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import MarketplaceView from './components/Marketplace/MarketplaceView';
import PGView from './components/PG/PGView';
import AuthModal from './components/Auth/AuthModal';
import CreateListingModal from './components/CreateListing/CreateListingModal';
import ChatBot from './components/Chatbot/ChatBot';
import { Plus } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<'marketplace' | 'pg'>('marketplace');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'marketplace' | 'pg'>('marketplace');
  const { user } = useAuth();

  const handleCreateClick = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setCreateType(currentView);
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onAuthClick={() => setShowAuthModal(true)}
        onCreateClick={handleCreateClick}
      />

      {currentView === 'marketplace' ? <MarketplaceView /> : <PGView />}

      {user && (
        <button
          onClick={handleCreateClick}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 flex items-center justify-center md:hidden z-40"
        >
          <Plus size={24} />
        </button>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        type={createType}
        onSuccess={handleCreateSuccess}
      />

      <ChatBot webhookUrl={import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://your-n8n-webhook-url'} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

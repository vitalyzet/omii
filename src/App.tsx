import React, { useState, useRef, useEffect } from 'react'
import { 
  Settings, 
  Moon, 
  Image as ImageIcon, 
  PauseCircle, 
  Globe, 
  ChevronRight,
  FileText,
  LayoutList,
  Crown,
  Plus,
  Check
} from 'lucide-react'
import { 
  onAuthStateChanged, 
  signOut, 
  User 
} from 'firebase/auth';
import { auth } from './firebase';
import OmiiAuthModal from './components/OmiiAuthModal';
import OmiiPublishAdModal from './components/OmiiPublishAdModal';
import { 
  User as UserIcon, 
  LogOut, 
  UserCheck, 
  UserPlus 
} from 'lucide-react';
import ClassicLayout from './components/layouts/ClassicLayout'
import ProLayout from './components/layouts/ProLayout'
import OmiiFooter from './components/OmiiFooter'

import OmiiUserPanelPage from './components/OmiiUserPanelPage'
import OmiiAdminPanelPage from './components/OmiiAdminPanelPage'
import OmiiPublishAdPage from './components/OmiiPublishAdPage'
import OmiiListingDetailPage from './components/OmiiListingDetailPage'
import OmiiAutoDetailPage from './components/OmiiAutoDetailPage'

function App() {
  // Global states for layout, view modes, and active page
  const [pageDesign, setPageDesign] = useState<'classic' | 'pro'>('classic');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activePage, setActivePage] = useState<'home' | 'panel' | 'admin' | 'publish' | 'detail'>('home');
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [userAvatar, setUserAvatar] = useState('/an74.png');
  const [currentLang, setCurrentLang] = useState<'ro' | 'es'>('ro');
  
  // Firebase Auth State & Auth Modal States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Publish Ad Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  const [homeResetKey, setHomeResetKey] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.photoURL) {
        setUserAvatar(user.photoURL);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to global card click event for opening Listing Details Page
  useEffect(() => {
    const handleSelectListing = (e: any) => {
      if (e.detail) {
        setSelectedListing(e.detail);
        setActivePage('detail');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('omii:select_listing', handleSelectListing);
    return () => window.removeEventListener('omii:select_listing', handleSelectListing);
  }, []);

  const handleGoHome = () => {
    setSelectedListing(null);
    setActivePage('home');
    setHomeResetKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsUserMenuOpen(false);
      setActivePage('home');
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Header Mock - Persistent across layouts */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center relative z-50">
        <div 
          onClick={handleGoHome}
          className="flex items-center space-x-2 cursor-pointer select-none group"
          title="Ir a la página principal"
        >
          <img 
            src="/an32.png" 
            alt="Omii Logo" 
            className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" 
          />
          <span className="font-bold text-xl text-gray-800 group-hover:text-blue-600 transition-colors">Omii</span>
          {pageDesign === 'pro' && (
            <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">PRO</span>
          )}
        </div>
        <div className="flex items-center space-x-4 relative" ref={settingsRef}>
          {/* Settings Button & Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <Settings size={24} />
            </button>

            {/* Dropdown Menu */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200/80 py-1.5 overflow-hidden flex flex-col font-sans">
                
                {/* Section Header */}
                <div className="px-3.5 pt-2 pb-1">
                  <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Aparență</span>
                </div>

                {/* Dark Mode */}
                <button className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100/80 transition-colors w-full text-left text-sm text-gray-700 font-medium group">
                  <div className="flex items-center gap-3">
                    <Moon size={18} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                    <span>Mod întunecat</span>
                  </div>
                  <div className="w-8 h-4 rounded-full bg-gray-200 relative transition-colors">
                    <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs absolute top-[1px] left-[1px] transition-transform"></div>
                  </div>
                </button>

                {/* View Mode (Grid vs List) */}
                {viewMode === 'grid' ? (
                  <button 
                    onClick={() => setViewMode('list')}
                    className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100/80 transition-colors w-full text-left text-sm text-gray-700 font-medium group"
                  >
                    <div className="flex items-center gap-3">
                      <LayoutList size={18} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                      <span>Mod listă</span>
                    </div>
                  </button>
                ) : (
                  <button 
                    onClick={() => setViewMode('grid')}
                    className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100/80 transition-colors w-full text-left text-sm text-gray-700 font-medium group"
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon size={18} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                      <span>Mod grilă</span>
                    </div>
                  </button>
                )}

                {/* Page Design (Classic vs Pro) */}
                {pageDesign === 'classic' ? (
                  <button 
                    onClick={() => setPageDesign('pro')}
                    className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100/80 transition-colors w-full text-left text-sm text-gray-700 font-medium group"
                  >
                    <div className="flex items-center gap-3">
                      <Crown size={18} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                      <span>Mod profesional</span>
                    </div>
                  </button>
                ) : (
                  <button 
                    onClick={() => setPageDesign('classic')}
                    className="flex items-center justify-between px-3.5 py-2 bg-indigo-50/70 hover:bg-indigo-100/60 transition-colors w-full text-left text-sm text-indigo-700 font-semibold group"
                  >
                    <div className="flex items-center gap-3">
                      <Crown size={18} className="text-indigo-600" />
                      <span>Mod clasic</span>
                    </div>
                    <span className="text-xs text-indigo-600 font-bold">Activo</span>
                  </button>
                )}

                {/* Infinite Scroll */}
                <button className="flex items-center justify-between px-3.5 py-2 hover:bg-gray-100/80 transition-colors w-full text-left text-sm text-gray-700 font-medium group">
                  <div className="flex items-center gap-3">
                    <PauseCircle size={18} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                    <span>Derulare infinită</span>
                  </div>
                  <div className="w-8 h-4 rounded-full bg-gray-200 relative transition-colors">
                    <div className="w-3.5 h-3.5 rounded-full bg-white shadow-xs absolute top-[1px] left-[1px] transition-transform"></div>
                  </div>
                </button>
                
                {/* Divider */}
                <div className="my-1 border-t border-gray-100"></div>
                
                {/* Section Header */}
                <div className="px-3.5 pt-1.5 pb-1">
                  <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Limbă & Regiune</span>
                </div>

                {/* Romanian Language */}
                <button 
                  onClick={() => setCurrentLang('ro')}
                  className={`flex items-center justify-between px-3.5 py-2 transition-colors w-full text-left text-sm font-medium group cursor-pointer ${
                    currentLang === 'ro' ? 'bg-indigo-50/80 text-indigo-900 font-bold' : 'hover:bg-gray-100/80 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className={currentLang === 'ro' ? 'text-indigo-600' : 'text-gray-500'} />
                    <span>Română (RO)</span>
                  </div>
                  {currentLang === 'ro' ? (
                    <Check size={16} className="text-indigo-600 font-bold" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  )}
                </button>

                {/* Spanish Language */}
                <button 
                  onClick={() => setCurrentLang('es')}
                  className={`flex items-center justify-between px-3.5 py-2 transition-colors w-full text-left text-sm font-medium group cursor-pointer ${
                    currentLang === 'es' ? 'bg-indigo-50/80 text-indigo-900 font-bold' : 'hover:bg-gray-100/80 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} className={currentLang === 'es' ? 'text-indigo-600' : 'text-gray-500'} />
                    <span>Español (ES)</span>
                  </div>
                  {currentLang === 'es' ? (
                    <Check size={16} className="text-indigo-600 font-bold" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  )}
                </button>

              </div>
            )}
          </div>

          {/* Admin Panel Shortcut Pill */}
          <button 
            onClick={() => setActivePage('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-2xs ${
              activePage === 'admin'
                ? 'bg-[#005944] text-white'
                : 'bg-[#ebf3ff] hover:bg-[#deebff] border border-[#d6e6ff] text-[#005944]'
            }`}
            title="Panoul de Administrare Omii"
          >
            <span className={`w-2 h-2 rounded-full ${activePage === 'admin' ? 'bg-white' : 'bg-[#005944]'}`} />
            <span>Admin</span>
          </button>

          {/* User Profile / Auth Pill */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <div 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200/70 rounded-full cursor-pointer transition-colors border border-gray-200/60 select-none"
              >
                <img 
                  src={currentUser.photoURL || userAvatar} 
                  alt={currentUser.displayName || 'Utilizator'} 
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 shadow-xs"
                />
                <span className="font-bold text-sm text-gray-800 pr-1 max-w-[120px] truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0] || 'Alexandru.B'}
                </span>
              </div>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200/80 py-1.5 overflow-hidden flex flex-col font-sans z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {currentUser.displayName || 'Utilizator Omii'}
                    </p>
                    <p className="text-[11px] text-gray-400 truncate font-medium">
                      {currentUser.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setActivePage('panel');
                    }}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors w-full text-left text-xs font-bold text-gray-700 cursor-pointer"
                  >
                    <UserCheck size={16} className="text-blue-600" />
                    <span>{currentLang === 'ro' ? 'Panou Utilizator' : 'Panel de Usuario'}</span>
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors w-full text-left text-xs font-bold border-t border-gray-100 cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span>{currentLang === 'ro' ? 'Deconectare' : 'Cerrar sesión'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200/80 rounded-full text-xs font-extrabold text-gray-800 border border-gray-200/70 transition-all cursor-pointer"
              >
                <UserIcon size={15} className="text-blue-600" />
                <span>{currentLang === 'ro' ? 'Autentificare' : 'Iniciar sesión'}</span>
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-extrabold transition-all cursor-pointer shadow-xs"
              >
                <UserPlus size={15} />
                <span>{currentLang === 'ro' ? 'Înregistrare' : 'Crear cuenta'}</span>
              </button>
            </div>
          )}

          <button 
            onClick={() => setActivePage('publish')}
            className="flex items-center gap-2.5 px-5 py-2 bg-[#ebf3ff] hover:bg-[#deebff] rounded-full border border-[#d6e6ff] text-sm font-extrabold text-[#005944] shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <img src="/publish.png" alt="Publică" className="w-5 h-5 object-contain" />
            <span>{currentLang === 'ro' ? 'Publică anunț' : 'Publicar anuncio'}</span>
          </button>
        </div>
      </header>

      {/* Render the Page Layout */}
      {activePage === 'admin' ? (
        <OmiiAdminPanelPage 
          onBackToHome={handleGoHome} 
          lang={currentLang}
        />
      ) : activePage === 'panel' ? (
        <OmiiUserPanelPage 
          onBackToHome={handleGoHome} 
          currentAvatar={currentUser?.photoURL || userAvatar}
          onAvatarChange={setUserAvatar}
          lang={currentLang}
        />
      ) : activePage === 'publish' ? (
        <OmiiPublishAdPage
          onBackToHome={handleGoHome}
          lang={currentLang}
        />
      ) : activePage === 'detail' || selectedListing ? (
        (selectedListing?.category === 'Auto & Moto' || selectedListing?.category === 'Vehículos' || selectedListing?.category === 'anuncios_auto') ? (
          <OmiiAutoDetailPage
            listing={selectedListing}
            onBackToHome={handleGoHome}
            lang={currentLang}
          />
        ) : (
          <OmiiListingDetailPage
            listing={selectedListing}
            onBackToHome={handleGoHome}
            lang={currentLang}
          />
        )
      ) : pageDesign === 'pro' ? (
        <ProLayout key={homeResetKey} lang={currentLang} onSelectListing={(item) => { setSelectedListing(item); setActivePage('detail'); }} />
      ) : (
        <ClassicLayout key={homeResetKey} viewMode={viewMode} lang={currentLang} onSelectListing={(item) => { setSelectedListing(item); setActivePage('detail'); }} />
      )}

      {/* Footer Component */}
      <OmiiFooter onGoHome={handleGoHome} />

      {/* Firebase Auth Modal (Login / Register / Forgot Password) */}
      <OmiiAuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={currentLang}
        initialMode={authModalMode}
      />

      {/* Publish Ad Modal */}
      <OmiiPublishAdModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        lang={currentLang}
      />
    </div>
  )
}

export default App

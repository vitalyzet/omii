import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, ChevronDown, Plus, Eye, Heart, ShieldCheck, Trash2, Edit3, Camera, User, Mail, Phone, MapPin, Check, Save, X, Upload, Star, LayoutGrid, List } from 'lucide-react';
import { TRANSLATIONS, Language } from '../translations';

interface OmiiUserPanelPageProps {
  onBackToHome: () => void;
  currentAvatar?: string;
  onAvatarChange?: (avatar: string) => void;
  lang?: Language;
}

export default function OmiiUserPanelPage({ onBackToHome, currentAvatar: propsAvatar = '/an74.png', onAvatarChange, lang = 'ro' }: OmiiUserPanelPageProps) {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState('Mis anuncios');
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [panelViewMode, setPanelViewMode] = useState<'list' | 'grid'>('list');

  const [currentAvatar, setCurrentAvatar] = useState(propsAvatar);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarToast, setAvatarToast] = useState(false);

  const handleSelectAvatar = (avatar: string) => {
    setCurrentAvatar(avatar);
    if (onAvatarChange) {
      onAvatarChange(avatar);
    }
    setIsAvatarModalOpen(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const avatarPresets = [
    '/an74.png', '/an32.png', '/an53.png', '/an54.png', '/an55.png', '/an57.png', 
    '/an61.png', '/an62.png', '/an70.png', '/an71.png', '/an75.png', '/an86.png', 
    '/an87.png', '/an89.png', '/an91.png', '/an94.png', '/an95.png', '/an97.png'
  ];

  const [profileData, setProfileData] = useState({
    name: 'Alexandru.B',
    username: 'alexandru_b',
    email: 'alexandru.b@omii.ro',
    phone: '+40 712 345 678',
    city: 'București, România',
    accountType: 'Persoană fizică',
    bio: 'Vânzător verificat pe Omii. Pasionat de tehnologie și autovehicule premium.'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const toggleExpand = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'review' | 'cancelled' | 'sold'>('all');

  const menuItems = [
    { id: 'Publicar anuncio', label: t.menuAddAd, icon: '/publish.png', hasSubmenu: false },
    { 
      id: 'Mis anuncios', 
      label: t.menuMyAds, 
      icon: '/listings.png', 
      hasSubmenu: true,
      subItems: [
        { id: 'Mis anuncios-all', label: t.statusAll, filter: 'all' },
        { id: 'Mis anuncios-active', label: t.statusActive, filter: 'active' },
        { id: 'Mis anuncios-review', label: t.statusInReview, filter: 'review' },
        { id: 'Mis anuncios-cancelled', label: t.statusCancelled, filter: 'cancelled' },
        { id: 'Mis anuncios-sold', label: t.statusSold, filter: 'sold' }
      ]
    },
    { 
      id: 'Favoritos', 
      label: t.menuFavorites, 
      icon: '/favourites.png', 
      hasSubmenu: true,
      subItems: [
        { id: 'Favoritos-Anuncios', label: t.menuFavAds },
        { id: 'Favoritos-Perfiles', label: t.menuFavProfiles }
      ]
    },
    { id: 'Chats', label: t.menuChats, icon: '/chats.png', hasSubmenu: false },
    { 
      id: 'Valoraciones', 
      label: t.menuReviews, 
      icon: '/rating.png', 
      hasSubmenu: true,
      subItems: [
        { id: 'Valoraciones-Recibidas', label: t.menuReviewsReceived },
        { id: 'Valoraciones-Realizadas', label: t.menuReviewsGiven }
      ]
    },
    { 
      id: 'Estadísticas', 
      label: t.menuStats, 
      icon: '/chart.png', 
      hasSubmenu: true,
      subItems: [
        { id: 'Estadisticas-Vistas', label: t.menuStatsViews },
        { id: 'Estadisticas-Contactos', label: t.menuStatsContacts }
      ]
    },
    { id: 'Alertas', label: t.menuAlerts, icon: '/alerts.png', hasSubmenu: false },
    { 
      id: 'Ajustes', 
      label: t.menuSettings, 
      icon: '/man.png', 
      hasSubmenu: true,
      subItems: [
        { id: 'Ajustes-Perfil', label: t.menuMyProfile },
        { id: 'Ajustes-Notificaciones', label: t.menuNotifications },
        { id: 'Ajustes-Avansat', label: t.menuAdvanced }
      ]
    },
    { 
      id: 'Créditos', 
      label: t.menuCredits, 
      icon: '/credits.png', 
      hasSubmenu: true, 
      subItems: [
        { id: 'Creditos-Compras', label: t.menuPurchases },
        { id: 'Creditos-Uso', label: t.menuUsage },
        { id: 'Creditos-Facturacion', label: t.menuBilling }
      ] 
    },
    { 
      id: 'Karma', 
      label: t.menuKarma, 
      icon: '/karma.png', 
      hasSubmenu: true, 
      subItems: [
        { id: 'Karma-Ganancias', label: t.menuEarnings },
        { id: 'Karma-Consumo', label: t.menuConsumptions }
      ] 
    },
  ];

  const userAds = [
    { 
      id: 'ad1', 
      title: 'Mercedes-Benz C 63 AMG', 
      subtitle: 'C 63 S AMG 510PS Drivers Package PAGA HUD', 
      price: '47.999 €', 
      status: lang === 'ro' ? 'ACTIV' : 'NUEVO',
      statusCode: 'active', 
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=600',
      specs: { year: 'PR 10/2015', km: '86.704 km', power: '375 kW (510 cv)', fuel: 'Gasolina' }
    },
    { 
      id: 'ad2', 
      title: 'Toyota Yaris 1.5 Hybrid 2021', 
      subtitle: 'Stare impecabilă, unic proprietar, garanție reprezentanță', 
      price: '14.500 €', 
      status: lang === 'ro' ? 'În verificare' : 'En revisión',
      statusCode: 'review', 
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=600',
      specs: { year: 'PR 05/2021', km: '35.100 km', power: '85 kW (116 cv)', fuel: 'Híbrido' }
    },
    { 
      id: 'ad3', 
      title: 'Volkswagen Golf VIII GTI 2022', 
      subtitle: 'Hatchback sport, 245 CP, Full Option, Plafon panoramic', 
      price: '28.500 €', 
      status: lang === 'ro' ? 'Inactiv / Anulat' : 'Cancelado',
      statusCode: 'cancelled', 
      image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600',
      specs: { year: 'PR 03/2022', km: '24.500 km', power: '180 kW (245 cv)', fuel: 'Gasolina' }
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans pb-16">
      
      {/* Top Header Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-2 text-gray-600 hover:text-[#108474] font-semibold text-sm transition-colors py-1.5 px-3 rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              <ArrowLeft size={18} />
              <span>Înapoi la pagina principală</span>
            </button>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-black text-gray-900 tracking-tight">Panel Usuario</h1>
          </div>

          {/* Top Right Credits and Karma summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#eef7f5] rounded-full border border-[#bce0da] text-sm font-extrabold text-[#108474] shadow-2xs">
              <img src="/credits.png" alt="Créditos" className="w-6 h-6 object-contain" />
              <span>0 Créditos</span>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#eef7f5] rounded-full border border-[#bce0da] text-sm font-extrabold text-[#108474] shadow-2xs">
              <img src="/karma.png" alt="Karma" className="w-6 h-6 object-contain" />
              <span>0 Karma</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Unified Top Profile & Header Bar Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: User Profile Info */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0 cursor-pointer group" onClick={() => setIsAvatarModalOpen(true)} title="Schimbă avatarul">
              <img 
                src={currentAvatar} 
                alt="Alexandru b." 
                className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="absolute bottom-0 right-0 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white" title="Online" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 truncate">Alexandru b.</h2>
                <button 
                  onClick={() => setActiveTab('Perfil')}
                  className="text-xs font-semibold text-[#108474] hover:text-[#0e7063] hover:underline transition-colors cursor-pointer flex items-center gap-0.5"
                >
                  <span>{t.viewProfile}</span>
                  <ChevronRight size={13} />
                </button>
              </div>
              
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-0.5">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="text-gray-500 font-semibold text-[11px] ml-0.5">(0)</span>
                </div>

                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block shrink-0" />

                <span className="text-xs font-medium text-gray-400">{t.memberSince}</span>
              </div>
            </div>
          </div>

          {/* Divider on desktop */}
          <div className="hidden md:block w-px h-10 bg-gray-200" />

          {/* Center/Right: Tab Title & Description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-extrabold text-gray-900">{activeTab}</h3>
            <p className="text-xs font-medium text-gray-500 truncate mt-0.5">
              Administrează {activeTab.toLowerCase()} din contul tău Alexandru.B
            </p>
          </div>

          {/* Far Right: Action Button */}
          <button className="flex items-center gap-2.5 px-5 py-2.5 bg-[#eef7f5] hover:bg-[#deebff] rounded-full border border-[#bce0da] text-sm font-extrabold text-[#108474] shadow-2xs transition-all cursor-pointer shrink-0">
            <img src="/publish.png" alt="Publică" className="w-5 h-5 object-contain" />
            <span>Adaugă anunț nou</span>
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Menu */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">

            {/* Menu List matching screenshot with accordions */}
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden py-2">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                const isExpanded = !!expandedMenus[item.id];

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.hasSubmenu) {
                          toggleExpand(item.id);
                        }
                      }}
                      className={`relative w-full flex items-center justify-between px-5 py-3 text-left transition-colors cursor-pointer group ${
                        isActive 
                          ? 'bg-[#eef7f5] text-[#108474] font-bold border-y border-[#bce0da]/60' 
                          : 'hover:bg-gray-50 text-gray-700 font-medium'
                      }`}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-[#108474] rounded-r-md" />
                      )}

                      <div className="flex items-center gap-3.5">
                        <img 
                          src={item.icon} 
                          alt={item.label} 
                          className="w-5 h-5 object-contain opacity-85 group-hover:opacity-100" 
                        />
                        <span className="text-[14.5px] tracking-tight">{item.label}</span>
                      </div>

                      {item.hasSubmenu && (
                        isExpanded ? (
                          <ChevronDown size={17} className="text-[#108474] font-medium transition-transform duration-200" />
                        ) : (
                          <ChevronRight size={17} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                        )
                      )}
                    </button>

                    {/* Submenu Accordion Items */}
                    {item.hasSubmenu && isExpanded && item.subItems && (
                      <div className="pl-14 pr-5 py-1.5 space-y-1 bg-gray-50/60 border-y border-gray-100">
                        {item.subItems.map((sub: any) => {
                          const isSubActive = activeTab === 'Mis anuncios' 
                            ? (sub.filter ? statusFilter === sub.filter : activeTab === sub.id)
                            : activeTab === sub.id;

                          return (
                            <button
                              key={sub.id}
                              onClick={() => {
                                if (sub.filter) {
                                  setActiveTab('Mis anuncios');
                                  setStatusFilter(sub.filter as any);
                                } else {
                                  setActiveTab(sub.id);
                                }
                              }}
                              className={`w-full text-left py-1.5 px-3 text-[14px] font-medium transition-all rounded-xl cursor-pointer ${
                                isSubActive
                                  ? 'text-[#108474] font-bold bg-[#eef7f5] border border-[#bce0da]/80 shadow-2xs'
                                  : 'text-gray-600 hover:text-[#108474] hover:bg-gray-100/80'
                              }`}
                            >
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* Content for "Mis anuncios" or active tab */}
            {activeTab === 'Mis anuncios' && (
              <div className="space-y-5">
                
                {/* Status Filter Bar & View Mode Toggle matching ice-blue theme */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Status Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {[
                      { id: 'all', label: t.statusAll, count: userAds.length },
                      { id: 'active', label: t.statusActive, count: userAds.filter(a => a.statusCode === 'active').length },
                      { id: 'review', label: t.statusInReview, count: userAds.filter(a => a.statusCode === 'review').length },
                      { id: 'cancelled', label: t.statusCancelled, count: userAds.filter(a => a.statusCode === 'cancelled').length },
                      { id: 'sold', label: t.statusSold, count: userAds.filter(a => a.statusCode === 'sold').length }
                    ].map((st) => {
                      const isActive = statusFilter === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setStatusFilter(st.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            isActive 
                              ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da] shadow-2xs font-extrabold' 
                              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80 font-medium'
                          }`}
                        >
                          <span>{st.label}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-[#108474] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {st.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* View Mode Toggle: List vs Grid 2 Cards */}
                  <div className="flex items-center gap-1 p-1 bg-white border border-gray-200/80 rounded-2xl shrink-0 self-end sm:self-auto shadow-2xs">
                    <button
                      onClick={() => setPanelViewMode('list')}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        panelViewMode === 'list' 
                          ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da]' 
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                      title="Vedere listă"
                    >
                      <List size={17} />
                    </button>
                    <button
                      onClick={() => setPanelViewMode('grid')}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        panelViewMode === 'grid' 
                          ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da]' 
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                      title="Vedere grilă (2 pe rând)"
                    >
                      <LayoutGrid size={17} />
                    </button>
                  </div>
                </div>

                {/* Filtered User Listings */}
                {userAds.filter(ad => statusFilter === 'all' || ad.statusCode === statusFilter).length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 border border-gray-200/80 text-center space-y-3">
                    <p className="text-sm font-semibold text-gray-500">Nu ai niciun anunț în această categorie.</p>
                  </div>
                ) : panelViewMode === 'grid' ? (
                  /* Grid View (2 cards per row) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {userAds
                      .filter(ad => statusFilter === 'all' || ad.statusCode === statusFilter)
                      .map((ad) => (
                        <div key={ad.id} className="bg-white rounded-3xl border border-gray-200/80 p-4 space-y-3.5 hover:border-gray-300 transition-colors font-sans shadow-2xs flex flex-col justify-between">
                          <div className="space-y-3">
                            {/* Top Image */}
                            <div className="relative w-full h-44 bg-gray-100 rounded-2xl overflow-hidden">
                              <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                              <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
                                Autopro
                              </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                                  ad.statusCode === 'active' 
                                    ? 'bg-[#e5f2ef] text-emerald-700 border-emerald-200/80' 
                                    : ad.statusCode === 'review'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                                    : 'bg-red-50 text-red-700 border-red-200/80'
                                }`}>
                                  {ad.status}
                                </span>
                                <h4 className="font-extrabold text-base text-gray-900 truncate">{ad.title}</h4>
                              </div>

                              <p className="text-xs text-gray-500 line-clamp-1">{ad.subtitle}</p>

                              <div className="flex items-center justify-between gap-2 pt-0.5">
                                <span className="font-black text-xl text-gray-900">{ad.price}</span>
                                
                                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200/70 shadow-2xs">
                                  <span>{lang === 'ro' ? 'Preț corect' : 'Precio justo'}</span>
                                </div>
                              </div>

                              <div className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-gray-600 pt-1">
                                <span>{ad.specs.year}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 inline-block shrink-0" />
                                <span>{ad.specs.km}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 inline-block shrink-0" />
                                <span>{ad.specs.fuel}</span>
                              </div>
                            </div>
                          </div>

                          {/* Footer Bar */}
                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={currentAvatar} alt="Alexandru b." className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0" />
                              <span className="font-bold text-gray-900 truncate text-xs">Alexandru b.</span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button className="flex items-center gap-1 px-3 py-1.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] border border-[#bce0da] rounded-full text-xs font-bold transition-colors cursor-pointer shadow-2xs" title="Editează">
                                <img src="/publish.png" alt="Editează" className="w-3.5 h-3.5 object-contain" />
                                <span>{lang === 'ro' ? 'Editează' : 'Editar'}</span>
                              </button>

                              <button className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-full text-xs font-bold transition-colors cursor-pointer" title="Șterge">
                                <img src="/trash-1.png" alt="Șterge" className="w-3.5 h-3.5 object-contain" />
                                <span>{lang === 'ro' ? 'Șterge' : 'Eliminar'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  /* List View */
                  userAds
                    .filter(ad => statusFilter === 'all' || ad.statusCode === statusFilter)
                    .map((ad) => (
                      <div key={ad.id} className="bg-white rounded-3xl border border-gray-200/80 p-4 sm:p-5 space-y-4 hover:border-gray-300 transition-colors font-sans shadow-2xs">
                        
                        {/* Top Main Section: Image + Details & Price */}
                        <div className="flex flex-col sm:flex-row gap-4.5 items-start">
                          {/* Left Image with Autopro Badge */}
                          <div className="relative w-full sm:w-48 h-34 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                            <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
                              Autopro
                            </span>
                          </div>

                          {/* Right Details Column */}
                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Status Badge + Title */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                                ad.statusCode === 'active' 
                                  ? 'bg-[#e5f2ef] text-emerald-700 border-emerald-200/80' 
                                  : ad.statusCode === 'review'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                                  : 'bg-red-50 text-red-700 border-red-200/80'
                              }`}>
                                {ad.status}
                              </span>
                              <h4 className="font-extrabold text-base text-gray-900 truncate">{ad.title}</h4>
                            </div>

                            {/* Subtitle */}
                            <p className="text-xs text-gray-500 line-clamp-1">{ad.subtitle}</p>

                            {/* Price & Fair Price Rating Indicator */}
                            <div className="flex items-center justify-between gap-3 pt-0.5">
                              <span className="font-black text-xl text-gray-900">{ad.price}</span>
                              
                              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-50 px-3 py-1 rounded-full border border-gray-200/70 shadow-2xs">
                                <div className="flex gap-0.5">
                                  <span className="w-2.5 h-1.5 rounded-xs bg-[#008060]" />
                                  <span className="w-2.5 h-1.5 rounded-xs bg-[#008060]" />
                                  <span className="w-2.5 h-1.5 rounded-xs bg-[#008060]" />
                                  <span className="w-2.5 h-1.5 rounded-xs bg-[#008060]" />
                                  <span className="w-2.5 h-1.5 rounded-xs bg-gray-200" />
                                </div>
                                <span>{lang === 'ro' ? 'Preț corect' : 'Precio justo'}</span>
                              </div>
                            </div>

                            {/* Tech Specs Row with Round Dots */}
                            <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-gray-600 pt-1">
                              <span>{ad.specs.year}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block shrink-0" />
                              <span>{ad.specs.km}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block shrink-0" />
                              <span>{ad.specs.power}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300 inline-block shrink-0" />
                              <span>{ad.specs.fuel}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Footer Seller & Action Bar */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
                          {/* Left Seller Details - User Avatar & Name */}
                          <div className="flex items-center gap-3">
                            <img 
                              src={currentAvatar} 
                              alt="Alexandru b." 
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-2xs shrink-0" 
                            />
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-gray-900">Alexandru b.</span>
                              <div className="flex items-center gap-0.5">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <span className="text-xs text-gray-400 ml-0.5">(0)</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Action Buttons with Image Icons matching screenshot */}
                          <div className="flex items-center gap-2.5 shrink-0">
                            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] border border-[#bce0da] rounded-full text-xs font-bold transition-colors cursor-pointer shadow-2xs" title="Editează">
                              <img src="/publish.png" alt="Editează" className="w-4 h-4 object-contain" />
                              <span>{lang === 'ro' ? 'Editează' : 'Editar'}</span>
                            </button>

                            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-full text-xs font-bold transition-colors cursor-pointer" title="Șterge">
                              <img src="/trash-1.png" alt="Șterge" className="w-4 h-4 object-contain" />
                              <span>{lang === 'ro' ? 'Șterge' : 'Eliminar'}</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ))
                )}

              </div>
            )}

            {/* User Profile Form View */}
            {(activeTab === 'Perfil' || activeTab === 'Ajustes-Perfil' || activeTab === 'Favoritos-Perfiles') && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-8">
                


                {/* Avatar Banner Header matching user screenshot */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                  <div className="relative group cursor-pointer" onClick={() => setIsAvatarModalOpen(true)}>
                    <img 
                      src={currentAvatar} 
                      alt="Alexandru b." 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-90 transition-opacity"
                    />
                    <button type="button" className="absolute bottom-0 right-0 p-2 bg-[#108474] hover:bg-[#004736] text-white rounded-full shadow-md transition-transform hover:scale-110 cursor-pointer" title="Schimbă poza de profil">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left space-y-1.5">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Alexandru b.</h3>
                    
                    {/* Star Rating Stars + Dot + Member Since */}
                    <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 text-sm">
                      <div className="flex items-center gap-0.5">
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                        <Star size={16} className="fill-amber-400 text-amber-400" />
                        <span className="text-gray-500 font-semibold text-xs ml-1">(0)</span>
                      </div>

                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block shrink-0" />

                      <span className="text-sm font-medium text-gray-500">{t.memberSince}</span>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] text-xs font-extrabold rounded-full border border-[#bce0da] transition-colors cursor-pointer"
                      >
                        <User size={14} />
                        <span>{t.chooseAvatar}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone Validation Info Banner matching screenshot */}
                <div className="bg-[#dcf4f8] border border-[#b8e5ed] rounded-2xl p-4 flex items-start sm:items-center gap-3.5 text-[#0d596e] text-sm font-medium leading-relaxed shadow-2xs">
                  <div className="p-1 text-[#38bdf8] shrink-0 mt-0.5 sm:mt-0">
                    <Check size={20} className="stroke-[2.5]" />
                  </div>
                  <p>
                    Dacă îți validezi telefonul vei vedea mai multe opțiuni pentru a-ți personaliza profilul, pe lângă obținerea a <strong className="font-extrabold text-[#084555]">+50 de karma</strong>. Este gratuit și numărul nu se face public.
                  </p>
                </div>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <User size={14} className="text-[#108474]" /> {t.fullName}
                      </label>
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#108474] focus:bg-white transition-all"
                        required
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <User size={14} className="text-[#108474]" /> {t.username}
                      </label>
                      <input 
                        type="text" 
                        value={profileData.username} 
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#108474] focus:bg-white transition-all"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Mail size={14} className="text-[#108474]" /> {t.email}
                      </label>
                      <div className="relative">
                        <input 
                          type="email" 
                          value={profileData.email} 
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#108474] focus:bg-white transition-all"
                          required
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                          {t.verifiedAccount}
                        </span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Phone size={14} className="text-[#108474]" /> {t.phone}
                      </label>
                      <div className="relative">
                        <input 
                          type="tel" 
                          value={profileData.phone} 
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-3 pr-40 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#108474] focus:bg-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => alert('SMS Sent: ' + profileData.phone)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200/80 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>{t.unverified}</span>
                          <span className="text-[10px] text-amber-800 font-bold bg-amber-200/70 px-1.5 py-0.5 rounded-full hover:bg-amber-300 transition-colors">{t.validate}</span>
                        </button>
                      </div>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={14} className="text-[#108474]" /> {t.city}
                      </label>
                      <input 
                        type="text" 
                        value={profileData.city} 
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#108474] focus:bg-white transition-all"
                      />
                    </div>

                    {/* Account Type */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        {t.accountType}
                      </label>
                      <select 
                        value={profileData.accountType} 
                        onChange={(e) => setProfileData({ ...profileData, accountType: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#108474] focus:bg-white transition-all"
                      >
                        <option value="Persoană fizică">{t.individual}</option>
                        <option value="Companie / Dealer">{t.company}</option>
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {t.bio}
                    </label>
                    <textarea 
                      rows={3} 
                      value={profileData.bio} 
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#108474] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button 
                      type="submit" 
                      className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-extrabold text-sm border shadow-2xs transition-all cursor-pointer ${
                        isSaved 
                          ? 'bg-[#00664d] text-white border-emerald-700 shadow-md scale-105' 
                          : 'bg-[#eef7f5] hover:bg-[#deebff] border-[#bce0da] text-[#108474]'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check size={18} className="stroke-[3]" />
                          <span>{t.changesSaved}</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>{t.saveChanges}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* Other Empty Sections */}
            {activeTab !== 'Mis anuncios' && activeTab !== 'Perfil' && activeTab !== 'Ajustes-Perfil' && activeTab !== 'Favoritos-Perfiles' && (
              <div className="bg-white rounded-3xl p-12 border border-gray-200/80 shadow-xs text-center space-y-3">
                <img 
                  src={activeTab === 'Publicar anuncio' ? '/chameleon112.png' : '/empty.png'} 
                  alt={activeTab} 
                  className={activeTab === 'Publicar anuncio' ? "w-44 h-44 object-contain mx-auto transition-transform hover:scale-105" : "w-16 h-16 object-contain mx-auto"} 
                />
                <h4 className="text-xl font-medium text-gray-900">Secțiunea {activeTab}</h4>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Aici sunt afișate detaliile și opțiunile salvate pentru {activeTab.toLowerCase()}.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Alege un avatar predefinit</h3>
                <p className="text-xs text-gray-500 mt-1">Selectează o ilustrație pentru profilul tău Omii</p>
              </div>
              <button 
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5 pt-2">
              {avatarPresets.map((avatar, idx) => {
                const isSelected = currentAvatar === avatar;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAvatar(avatar)}
                    className={`relative p-2 rounded-2xl border-2 transition-all cursor-pointer group hover:scale-105 ${
                      isSelected 
                        ? 'border-[#108474] bg-[#eef7f5]/50 shadow-md ring-2 ring-[#108474]/30' 
                        : 'border-gray-100 bg-gray-50/50 hover:border-gray-300 hover:bg-white'
                    }`}
                  >
                    <img 
                      src={avatar} 
                      alt={`Avatar ${idx + 1}`} 
                      className="w-16 h-16 rounded-full object-cover mx-auto"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#108474] rounded-full flex items-center justify-center text-white text-xs shadow-xs">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Upload size={14} className="text-[#108474]" /> Sau încarcă o foto din dispozitiv
              </span>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Închide
              </button>
            </div>

          </div>
        </div>
      )}


    </div>
  );
}

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronDown, 
  Users, 
  FileText, 
  ShieldAlert, 
  CreditCard, 
  Settings, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Search, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw,
  Star,
  LayoutGrid,
  List,
  Eye,
  Check,
  X,
  MapPin,
  Calendar,
  Gauge,
  Car,
  Clock
} from 'lucide-react';
import { TRANSLATIONS, Language } from '../translations';

interface OmiiAdminPanelPageProps {
  onBackToHome: () => void;
  lang?: Language;
}

export default function OmiiAdminPanelPage({ onBackToHome, lang = 'ro' }: OmiiAdminPanelPageProps) {
  const t = TRANSLATIONS[lang];
  const [activeAdminTab, setActiveAdminTab] = useState<'moderation' | 'active_ads' | 'users' | 'reports' | 'contact' | 'analytics' | 'transactions' | 'seo_settings'>('moderation');
  const [adsFilter, setAdsFilter] = useState<'pending' | 'flagged' | 'active' | 'all'>('pending');
  const [adminViewMode, setAdminViewMode] = useState<'list' | 'grid'>('list');
  const [userFilter, setUserFilter] = useState<'all' | 'verified' | 'dealer' | 'unverified'>('all');
  const [userViewMode, setUserViewMode] = useState<'cards' | 'table'>('cards');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock Ads for Moderation
  const [moderationAds, setModerationAds] = useState([
    {
      id: 'mod-1',
      title: 'BMW M3 Competition xDrive 2023',
      subtitle: '3.0 TwinTurbo 510 CP, Laserlight, Carbon Package, PAGA HUD',
      price: '79.900 €',
      seller: 'Mihai Popescu',
      avatar: '/an87.png',
      date: 'Astăzi, 14:20',
      publishDate: '25 Iun 2026',
      expireDate: '25 Iul 2026',
      daysLeft: 0,
      isExpired: true,
      status: 'review',
      statusLabel: lang === 'ro' ? 'În verificare' : 'En revisión',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600',
      specs: { year: 'PR 04/2023', km: '18.200 km', power: '375 kW (510 cv)', fuel: 'Gasolina' }
    },
    {
      id: 'mod-2',
      title: 'Audi RS6 Avant Carbon Black 2022',
      subtitle: 'V8 600 CP, Bang & Olufsen 3D, Ceramic Brakes, Plafon panoramic',
      price: '115.000 €',
      seller: 'Elena Radu',
      avatar: '/an55.png',
      date: 'Ieri, 18:45',
      publishDate: '10 Iul 2026',
      expireDate: '09 Aug 2026',
      daysLeft: 10,
      isExpired: false,
      status: 'review',
      statusLabel: lang === 'ro' ? 'În verificare' : 'En revisión',
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=600',
      specs: { year: 'PR 09/2022', km: '32.500 km', power: '441 kW (600 cv)', fuel: 'Gasolina' }
    },
    {
      id: 'mod-3',
      title: 'Porsche 911 Carrera S (992) 2021',
      subtitle: 'Sport Chrono, Exhaust Sport, Matrix LED, BOSE, Pachet piele',
      price: '128.500 €',
      seller: 'Ionut Ionescu',
      avatar: '/an62.png',
      date: '28 Iul 2026',
      publishDate: '28 Iul 2026',
      expireDate: '27 Aug 2026',
      daysLeft: 28,
      isExpired: false,
      status: 'flagged',
      statusLabel: lang === 'ro' ? 'Reclamat' : 'Reportado',
      reason: 'Suspiciune preț neserios / Kilometraj suspect',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600',
      specs: { year: 'PR 01/2021', km: '24.000 km', power: '331 kW (450 cv)', fuel: 'Gasolina' }
    },
    {
      id: 'mod-4',
      title: 'Mercedes-Benz G 63 AMG Stronger Than Time',
      subtitle: 'V8 Biturbo 585 CP, Night Package II, Burmester, Scaune masaj',
      price: '169.000 €',
      seller: 'Alexandru B.',
      avatar: '/an74.png',
      date: '25 Iul 2026',
      publishDate: '25 Iul 2026',
      expireDate: '24 Aug 2026',
      daysLeft: 25,
      isExpired: false,
      status: 'active',
      statusLabel: lang === 'ro' ? 'ACTIV' : 'ACTIVO',
      image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=600',
      specs: { year: 'PR 06/2020', km: '41.800 km', power: '430 kW (585 cv)', fuel: 'Gasolina' }
    }
  ]);

  // Mock Users State
  const [usersList, setUsersList] = useState([
    {
      id: 'u-1',
      name: 'Alexandru B.',
      email: 'alexandru.b@omii.ro',
      avatar: '/an74.png',
      role: 'Admin',
      isVerified: true,
      adsCount: 3,
      credits: 450
    },
    {
      id: 'u-2',
      name: 'Auto Prestige Dealer SRL',
      email: 'contact@autoprestige.ro',
      avatar: '/an94.png',
      role: 'Dealer PRO',
      isVerified: true,
      adsCount: 42,
      credits: 2400
    },
    {
      id: 'u-3',
      name: 'Mihai Popescu',
      email: 'mihai.p@gmail.com',
      avatar: '/an87.png',
      role: 'Utilizator',
      isVerified: false,
      adsCount: 1,
      credits: 20
    },
    {
      id: 'u-4',
      name: 'User Suspect',
      email: 'scam_test@temp-mail.com',
      avatar: '/an32.png',
      role: 'Utilizator',
      isVerified: false,
      adsCount: 2,
      credits: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Handlers
  const handleApproveAd = (id: string) => {
    setModerationAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'active', statusLabel: lang === 'ro' ? 'ACTIV' : 'ACTIVO' } : ad));
  };

  const handleRejectAd = (id: string) => {
    setModerationAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'rejected', statusLabel: lang === 'ro' ? 'Inactiv' : 'Inactivo' } : ad));
  };

  const handleToggleUserVerification = (id: string) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, isVerified: !u.isVerified } : u));
  };

  const handleGrantCredits = (id: string, amount: number) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, credits: u.credits + amount } : u));
  };

  const handleReactivateAd = (id: string) => {
    setModerationAds(prev => prev.map(ad => {
      if (ad.id === id) {
        return {
          ...ad,
          expireDate: '29 Aug 2026',
          daysLeft: 30,
          isExpired: false
        };
      }
      return ad;
    }));
    setToastMessage('⚡ Anunțul a fost reactivat cu succes pentru încă 30 de zile! (Valabil până la 29 Aug 2026)');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Exact 8 Admin Menu Items matching User Screenshot
  const adminMenuItems = [
    { id: 'moderation', label: lang === 'ro' ? 'Moderare' : 'Moderación', icon: '/listings.png', badge: '1' },
    { id: 'active_ads', label: lang === 'ro' ? 'Anunțuri Active' : 'Anuncios Activos', icon: '/publish.png' },
    { id: 'users', label: lang === 'ro' ? 'Utilizatori' : 'Usuarios', icon: '/man.png' },
    { id: 'reports', label: lang === 'ro' ? 'Rapoarte' : 'Reportes', icon: '/alerts.png' },
    { id: 'contact', label: lang === 'ro' ? 'Contact & Mesaje' : 'Contacto y Mensajes', icon: '/chats.png' },
    { id: 'analytics', label: lang === 'ro' ? 'Analitice' : 'Analíticas', icon: '/chart.png' },
    { id: 'transactions', label: lang === 'ro' ? 'Tranzacții' : 'Transacciones', icon: '/credits.png' },
    { id: 'seo_settings', label: lang === 'ro' ? 'Setări SEO' : 'Ajustes SEO', icon: '/karma.png' }
  ];

  return (
    <div 
      className="min-h-screen font-sans pb-16"
      style={{ 
        backgroundImage: "url('/FONDS.png')",
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: '25px'
      }}
    >
      
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
            <div className="flex items-center gap-2">
              <span className="bg-[#108474] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">ADMIN</span>
              <h1 className="text-lg font-black text-gray-900 tracking-tight">Omii Control Center</h1>
            </div>
          </div>

          {/* Top Right Summary Bar matching User Panel */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#eef7f5] rounded-full border border-[#bce0da] text-sm font-extrabold text-[#108474] shadow-2xs">
              <img src="/credits.png" alt="Credite" className="w-5 h-5 object-contain" />
              <span>18.450 € Credite</span>
            </div>

            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-[#eef7f5] rounded-full border border-[#bce0da] text-sm font-extrabold text-[#108474] shadow-2xs">
              <img src="/karma.png" alt="Karma" className="w-5 h-5 object-contain" />
              <span>100% Sistem OK</span>
            </div>
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#108474] text-white px-5 py-3 rounded-2xl shadow-xl font-extrabold text-xs flex items-center gap-2 border border-emerald-400 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Unified Top Profile & Admin Header Bar Card matching User Panel */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Admin User Info */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative shrink-0">
              <img 
                src="/an74.png" 
                alt="Alexandru B." 
                className="w-13 h-13 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <span className="absolute bottom-0 right-0 bg-[#008060] w-3.5 h-3.5 rounded-full border-2 border-white" title="Online" />
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 truncate">Alexandru B.</h2>
                <span className="bg-[#eef7f5] text-[#108474] border border-[#bce0da] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Administrator Șef
                </span>
              </div>
              
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-0.5">
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <Star size={13} className="fill-amber-400 text-amber-400" />
                  <span className="text-gray-500 font-semibold text-[11px] ml-0.5">(5.0)</span>
                </div>

                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 inline-block shrink-0" />

                <span className="text-xs font-medium text-gray-400">În Omii din 2025</span>
              </div>
            </div>
          </div>

          {/* Divider on desktop */}
          <div className="hidden md:block w-px h-10 bg-gray-200" />

          {/* Center/Right: Active Section Title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-base text-gray-900 truncate">
              {activeAdminTab === 'moderation' && (lang === 'ro' ? 'Moderare Anunțuri & Verificări' : 'Moderación de Anuncios')}
              {activeAdminTab === 'active_ads' && (lang === 'ro' ? 'Anunțuri Active în Platformă' : 'Anuncios Activos')}
              {activeAdminTab === 'users' && (lang === 'ro' ? 'Management Utilizatori & Dealați' : 'Gestión de Usuarios')}
              {activeAdminTab === 'reports' && (lang === 'ro' ? 'Moderare Reclamații & Flaguri' : 'Reportes y Denuncias')}
              {activeAdminTab === 'contact' && (lang === 'ro' ? 'Mesaje Suport & Solicitări Contact' : 'Mensajes y Soporte')}
              {activeAdminTab === 'analytics' && (lang === 'ro' ? 'Analitice & Statistici Platformă' : 'Analíticas y Estadísticas')}
              {activeAdminTab === 'transactions' && (lang === 'ro' ? 'Istoric Tranzacții & Facturare' : 'Historial de Transacciones')}
              {activeAdminTab === 'seo_settings' && (lang === 'ro' ? 'Setări SEO & Indexare Motoare Căutare' : 'Ajustes SEO')}
            </h3>
            <p className="text-xs text-gray-500 line-clamp-1 font-medium">
              Aprobare anunțuri, verificare conturi, alocare credite și securitate sistem
            </p>
          </div>
        </div>

        {/* Metric KPI Row Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Utilizatori</span>
            <p className="text-2xl font-black text-gray-900">1.420</p>
            <span className="text-[11px] font-bold text-[#00664d] flex items-center gap-1">+12% luna aceasta</span>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Anunțuri Active</span>
            <p className="text-2xl font-black text-gray-900">3.850</p>
            <span className="text-[11px] font-medium text-gray-500">98% aprobate</span>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase">În verificări</span>
            <p className="text-2xl font-black text-amber-600">14</p>
            <span className="text-[11px] font-bold text-amber-600">Necesită acțiune</span>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Venituri Credite</span>
            <p className="text-2xl font-black text-gray-900">18.450 €</p>
            <span className="text-[11px] font-bold text-[#00664d]">+8.5% azi</span>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-2xs space-y-1 col-span-2 md:col-span-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase">Reclamații</span>
            <p className="text-2xl font-black text-red-600">3</p>
            <span className="text-[11px] font-bold text-red-600">Urgențe sesizate</span>
          </div>
        </div>

        {/* Responsive Layout Grid matching User Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Menu matching OmiiUserPanelPage */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-gray-100/80">
                <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Meniu Admin</span>
              </div>

              <div className="py-2 divide-y divide-gray-100/60">
                {adminMenuItems.map((item) => {
                  const isActive = activeAdminTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveAdminTab(item.id as any)}
                      className={`relative w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors cursor-pointer group ${
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

                      {item.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#b02e38] text-white shadow-xs">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">

            {/* Dedicated Anunțuri Active View matching screenshot */}
            {activeAdminTab === 'active_ads' && (
              <div className="space-y-4 font-sans">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="font-extrabold text-base text-gray-900">Anunțuri Active în Platformă</h3>
                  <span className="bg-[#e5f2ef] text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
                    3.850 Anunțuri
                  </span>
                </div>

                <div className="space-y-3.5">
                  {moderationAds.map((ad) => (
                    <div key={ad.id} className="bg-white rounded-2xl border border-amber-200/80 p-3 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300 transition-colors">
                      
                      {/* Left Image & Title Details */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative w-36 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 shadow-2xs">
                          <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-0 bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-r-md flex items-center gap-1 shadow-2xs">
                            <LayoutGrid size={10} /> AUTO
                          </span>
                        </div>

                        <div className="space-y-1.5 min-w-0">
                          <h4 className="font-extrabold text-base text-gray-900 truncate">{ad.title}</h4>
                          
                          <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                            <MapPin size={13} className="text-amber-500" />
                            <span>București</span>
                          </div>

                          <span className="bg-amber-50 text-amber-600 border border-amber-200/60 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <LayoutGrid size={10} /> AUTO
                          </span>
                        </div>
                      </div>

                      {/* Right Metadata Status Boxes & Reactivate Action */}
                      <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
                        {/* Tag Pill Box */}
                        <div className="bg-amber-50/70 text-amber-700 border border-amber-200/70 text-xs font-bold px-3.5 py-2.5 rounded-2xl text-center">
                          Vânzare Auto
                        </div>

                        {/* Expiră Box */}
                        <div className={`rounded-2xl px-4 py-2 text-center min-w-[130px] border ${
                          ad.isExpired 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-amber-50/80 text-amber-800 border-amber-200/80'
                        }`}>
                          <div className="text-[10px] font-bold uppercase flex items-center justify-center gap-1">
                            <Clock size={11} /> EXPIRĂ
                          </div>
                          <p className="font-extrabold text-sm">{ad.expireDate || '25 iul. 2026'}</p>
                          <span className="text-[10px] font-bold opacity-80">
                            {ad.isExpired ? 'Expirat (30 zile)' : `Valabil ${ad.daysLeft} zile`}
                          </span>
                        </div>

                        {/* Publicat Box */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-center min-w-[120px]">
                          <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                            <Calendar size={11} /> PUBLICAT
                          </div>
                          <p className="font-extrabold text-sm text-slate-700">{ad.publishDate || '25 iun. 2026'}</p>
                        </div>

                        {/* Reactivate Button */}
                        <button
                          onClick={() => handleReactivateAd(ad.id)}
                          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] border border-[#bce0da] rounded-2xl text-xs font-black transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                          title="Prelungește valabilitatea cu încă 30 de zile"
                        >
                          <RefreshCw size={14} className="animate-spin-slow" />
                          <span>Reactivează (+30d)</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moderare / Moderación View */}
            {(activeAdminTab === 'moderation' || activeAdminTab === 'reports') && (
              <div className="space-y-5">
                
                {/* Top Filter Bar & View Mode Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {[
                      { id: 'pending', label: 'În verificare', count: moderationAds.filter(a => a.status === 'review').length },
                      { id: 'flagged', label: 'Reclamate', count: moderationAds.filter(a => a.status === 'flagged').length },
                      { id: 'active', label: 'Active', count: moderationAds.filter(a => a.status === 'active').length },
                      { id: 'all', label: 'Toate', count: moderationAds.length }
                    ].map((f) => {
                      const isFActive = adsFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setAdsFilter(f.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            isFActive 
                              ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da] shadow-2xs font-extrabold' 
                              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80 font-medium'
                          }`}
                        >
                          <span>{f.label}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFActive ? 'bg-[#108474] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {f.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-1 p-1 bg-white border border-gray-200/80 rounded-2xl shrink-0 self-end sm:self-auto shadow-2xs">
                    <button
                      onClick={() => setAdminViewMode('list')}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        adminViewMode === 'list' 
                          ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da]' 
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                      title="Vedere listă"
                    >
                      <List size={17} />
                    </button>
                    <button
                      onClick={() => setAdminViewMode('grid')}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        adminViewMode === 'grid' 
                          ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da]' 
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                      title="Vedere grilă (2 pe rând)"
                    >
                      <LayoutGrid size={17} />
                    </button>
                  </div>
                </div>

                {/* Moderation Listing Cards matching User Panel */}
                {adminViewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {moderationAds
                      .filter(ad => {
                        if (activeAdminTab === 'reports') return ad.status === 'flagged';
                        if (adsFilter === 'pending') return ad.status === 'review';
                        if (adsFilter === 'flagged') return ad.status === 'flagged';
                        if (adsFilter === 'active') return ad.status === 'active';
                        return true;
                      })
                      .map((ad) => (
                        <div key={ad.id} className="bg-white rounded-3xl border border-gray-200/80 p-4 space-y-3.5 hover:border-gray-300 transition-colors font-sans shadow-2xs flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="relative w-full h-44 bg-gray-100 rounded-2xl overflow-hidden">
                              <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                              <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg">
                                Autopro
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border ${
                                  ad.status === 'review'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200/80'
                                    : ad.status === 'flagged'
                                    ? 'bg-red-50 text-red-700 border-red-200/80'
                                    : 'bg-[#e5f2ef] text-emerald-700 border-emerald-200/80'
                                }`}>
                                  {ad.statusLabel}
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
                              <img src={ad.avatar} alt={ad.seller} className="w-7 h-7 rounded-full object-cover border border-gray-200 shrink-0" />
                              <span className="font-bold text-gray-900 truncate text-xs">{ad.seller}</span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {ad.status !== 'active' && (
                                <button 
                                  onClick={() => handleApproveAd(ad.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] border border-[#bce0da] rounded-full text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                                >
                                  <img src="/publish.png" alt="Aprobă" className="w-3.5 h-3.5 object-contain" />
                                  <span>Aprobă</span>
                                </button>
                              )}

                              <button 
                                onClick={() => handleRejectAd(ad.id)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-full text-xs font-bold transition-colors cursor-pointer"
                              >
                                <img src="/trash-1.png" alt="Respinge" className="w-3.5 h-3.5 object-contain" />
                                <span>Respinge</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  userAdsList(moderationAds, adsFilter, handleApproveAd, handleRejectAd, lang)
                )}

              </div>
            )}

            {/* Management Utilizatori View */}
            {activeAdminTab === 'users' && (
              <div className="space-y-5">
                
                {/* User Filter Pills & View Mode Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {[
                      { id: 'all', label: 'Toți utilizatorii', count: usersList.length },
                      { id: 'verified', label: 'Verificați', count: usersList.filter(u => u.isVerified).length },
                      { id: 'dealer', label: 'Dealați PRO', count: usersList.filter(u => u.role === 'Dealer PRO').length },
                      { id: 'unverified', label: 'Neverificați', count: usersList.filter(u => !u.isVerified).length }
                    ].map((uf) => {
                      const isUActive = (userFilter || 'all') === uf.id;
                      return (
                        <button
                          key={uf.id}
                          onClick={() => setUserFilter(uf.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            isUActive 
                              ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da] shadow-2xs font-extrabold' 
                              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80 font-medium'
                          }`}
                        >
                          <span>{uf.label}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isUActive ? 'bg-[#108474] text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {uf.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative w-full sm:w-56">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Caută utilizator..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200/80 rounded-2xl text-xs font-medium focus:outline-none focus:border-[#108474] shadow-2xs"
                      />
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-white border border-gray-200/80 rounded-2xl shrink-0 shadow-2xs">
                      <button
                        onClick={() => setUserViewMode('cards')}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          (userViewMode || 'cards') === 'cards' 
                            ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da]' 
                            : 'text-gray-400 hover:text-gray-700'
                        }`}
                        title="Vedere carduri"
                      >
                        <LayoutGrid size={17} />
                      </button>
                      <button
                        onClick={() => setUserViewMode('table')}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          userViewMode === 'table' 
                            ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da]' 
                            : 'text-gray-400 hover:text-gray-700'
                        }`}
                        title="Vedere tabelă"
                      >
                        <List size={17} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Cards Grid Layout */}
                {(userViewMode || 'cards') === 'cards' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {usersList
                      .filter(u => {
                        if (userFilter === 'verified') return u.isVerified;
                        if (userFilter === 'dealer') return u.role === 'Dealer PRO';
                        if (userFilter === 'unverified') return !u.isVerified;
                        return true;
                      })
                      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((usr) => (
                        <div key={usr.id} className="bg-white rounded-3xl border border-gray-200/80 p-5 space-y-4 hover:border-gray-300 transition-colors font-sans shadow-2xs flex flex-col justify-between">
                          <div className="space-y-3.5">
                            
                            {/* User Header Row */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                  <img src={usr.avatar} alt={usr.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs" />
                                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#008060] rounded-full border-2 border-white" title="Online" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-extrabold text-base text-gray-900 truncate">{usr.name}</h4>
                                  </div>
                                  <p className="text-xs text-gray-400 font-medium">{usr.email}</p>
                                </div>
                              </div>

                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                                usr.role === 'Admin' 
                                  ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da]' 
                                  : usr.role === 'Dealer PRO'
                                  ? 'bg-[#eef7f5] text-[#0e7063] border border-[#bce0da]'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {usr.role}
                              </span>
                            </div>

                            {/* Verification Pill & Member Metadata */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-100 text-xs">
                              <button 
                                onClick={() => handleToggleUserVerification(usr.id)}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                  usr.isVerified 
                                    ? 'bg-[#e5f2ef] text-emerald-700 border border-emerald-200/80 shadow-2xs' 
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                <ShieldCheck size={14} />
                                <span>{usr.isVerified ? 'Cont Verificat' : 'Neverificat'}</span>
                              </button>

                              <div className="flex items-center gap-0.5 text-xs">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <span className="text-gray-400 text-[11px] font-bold ml-0.5">(5.0)</span>
                              </div>
                            </div>

                            {/* Stats Counter Bar */}
                            <div className="grid grid-cols-2 gap-2 p-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                              <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Anunțuri Active</span>
                                <p className="font-extrabold text-sm text-gray-900">{usr.adsCount}</p>
                              </div>
                              <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase">Credite Omii</span>
                                <p className="font-black text-sm text-[#108474]">{usr.credits} pts</p>
                              </div>
                            </div>

                          </div>

                          {/* Bottom Action Buttons */}
                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 text-xs">
                            <button 
                              onClick={() => handleGrantCredits(usr.id, 50)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] border border-[#bce0da] rounded-full text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                              title="Adaugă +50 Credite"
                            >
                              <img src="/credits.png" alt="Credite" className="w-4 h-4 object-contain" />
                              <span>+50 Credite</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-xs font-bold transition-colors cursor-pointer" title="Editează">
                                <img src="/publish.png" alt="Editează" className="w-3.5 h-3.5 object-contain" />
                                <span>Editează</span>
                              </button>

                              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-full text-xs font-bold transition-colors cursor-pointer" title="Blochează">
                                <img src="/trash-1.png" alt="Blochează" className="w-3.5 h-3.5 object-contain" />
                                <span>Blochează</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                  </div>
                ) : (
                  /* Table View */
                  <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-2xs space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                            <th className="py-3 px-3">Utilizator</th>
                            <th className="py-3 px-3">Rol</th>
                            <th className="py-3 px-3">Status</th>
                            <th className="py-3 px-3">Anunțuri</th>
                            <th className="py-3 px-3">Credite</th>
                            <th className="py-3 px-3 text-right">Acțiune Admin</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {usersList
                            .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((usr) => (
                              <tr key={usr.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2.5">
                                    <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" />
                                    <div>
                                      <p className="font-bold text-gray-900">{usr.name}</p>
                                      <p className="text-[11px] text-gray-400">{usr.email}</p>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-3">
                                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                                    usr.role === 'Admin' 
                                      ? 'bg-[#eef7f5] text-[#108474] border border-[#bce0da]' 
                                      : usr.role === 'Dealer PRO'
                                      ? 'bg-[#eef7f5] text-[#0e7063] border border-[#bce0da]'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {usr.role}
                                  </span>
                                </td>

                                <td className="py-3 px-3">
                                  <button 
                                    onClick={() => handleToggleUserVerification(usr.id)}
                                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                                      usr.isVerified 
                                        ? 'bg-[#e5f2ef] text-emerald-700 border border-emerald-200' 
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                                  >
                                    <ShieldCheck size={13} />
                                    <span>{usr.isVerified ? 'Verificat' : 'Neverificat'}</span>
                                  </button>
                                </td>

                                <td className="py-3 px-3 font-bold text-gray-900">{usr.adsCount}</td>

                                <td className="py-3 px-3">
                                  <span className="font-black text-[#108474]">{usr.credits} pts</span>
                                </td>

                                <td className="py-3 px-3 text-right">
                                  <button 
                                    onClick={() => handleGrantCredits(usr.id, 50)}
                                    className="px-3 py-1.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] border border-[#bce0da] rounded-full text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                                  >
                                    +50 Credite
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Contact & Support View */}
            {activeAdminTab === 'contact' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-5 font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-900">Mesaje Suport & Contact</h3>
                    <p className="text-xs text-gray-500 font-medium">Solicitări primite de la utilizatori și cumpărători</p>
                  </div>
                  <span className="bg-[#eef7f5] text-[#108474] border border-[#bce0da] px-3 py-1 rounded-full text-xs font-bold">
                    3 Solicitări Noi
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'c1', name: 'Marius Popa', email: 'marius.p@yahoo.com', topic: 'Probleme verificare dealer', date: 'Astăzi, 15:10' },
                    { id: 'c2', name: 'Ana Maria', email: 'anamaria@outlook.com', topic: 'Întrebare pachet credite Omii', date: 'Ieri, 11:30' }
                  ].map((msg) => (
                    <div key={msg.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src="/chats.png" alt="Chat" className="w-8 h-8 object-contain" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{msg.topic}</p>
                          <p className="text-xs text-gray-500">De la: {msg.name} ({msg.email}) • {msg.date}</p>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] border border-[#bce0da] rounded-full text-xs font-bold shadow-2xs cursor-pointer">
                        Răspunde
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analíticas View */}
            {activeAdminTab === 'analytics' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6 font-sans">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">Analitice & Statistici Platformă</h3>
                  <p className="text-xs text-gray-500 font-medium">Trafic lunar, căutări populare și rata de conversie</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 text-center space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Vizualizări Totale</span>
                    <p className="text-2xl font-black text-gray-900">142.800</p>
                    <span className="text-xs text-[#00664d] font-bold">+18.4% vs luna trecută</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 text-center space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Contacte Generație</span>
                    <p className="text-2xl font-black text-[#108474]">12.450</p>
                    <span className="text-xs text-[#00664d] font-bold">+10.2% conversie</span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 text-center space-y-1">
                    <span className="text-[11px] font-bold text-gray-400 uppercase">Timp Mediu Site</span>
                    <p className="text-2xl font-black text-gray-900">4m 12s</p>
                    <span className="text-xs text-gray-500 font-medium">Excelent</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transacciones View */}
            {activeAdminTab === 'transactions' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-5 font-sans">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">Istoric Tranzacții & Facturare</h3>
                  <p className="text-xs text-gray-500 font-medium">Cumpărături de credite Omii și abonamente Pro Dealer</p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 't1', user: 'Auto Prestige Dealer SRL', amount: '450 €', plan: 'Pachet 2.500 Credite', date: '30 Iul 2026, 12:40' },
                    { id: 't2', user: 'Elena Radu', amount: '25 €', plan: 'Pachet 100 Credite', date: '29 Iul 2026, 16:15' }
                  ].map((tx) => (
                    <div key={tx.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src="/credits.png" alt="Tranzacție" className="w-8 h-8 object-contain" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{tx.user}</p>
                          <p className="text-xs text-gray-500">{tx.plan} • {tx.date}</p>
                        </div>
                      </div>
                      <span className="font-black text-[#108474] text-sm">{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Setări SEO View */}
            {activeAdminTab === 'seo_settings' && (
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-2xs space-y-6 font-sans">
                <div>
                  <h3 className="font-extrabold text-base text-gray-900">Setări SEO & Indexare Motoare Căutare</h3>
                  <p className="text-xs text-gray-500 font-medium">Meta titluri, sitemap auto-generat și cuvinte cheie globale</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-3">
                    <h4 className="font-bold text-sm text-gray-900">Sitemap XML & Robots.txt</h4>
                    <p className="text-xs text-gray-500">Auto-generare zilnică a anunțurilor pentru Google / Bing</p>
                    <button className="px-4 py-1.5 bg-[#eef7f5] hover:bg-[#deebff] text-[#108474] border border-[#bce0da] rounded-full text-xs font-bold shadow-2xs cursor-pointer">
                      Regenerează Sitemap
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-3">
                    <h4 className="font-bold text-sm text-gray-900">Meta Tags Imobiliare & Auto</h4>
                    <p className="text-xs text-gray-500">Șabloane pentru titlurile de pagină automată</p>
                    <button className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold cursor-pointer">
                      Editează Șabloane Meta
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

// Helper to render Table list view for moderation ads matching exact screenshot layout
function userAdsList(
  moderationAds: any[], 
  adsFilter: string, 
  handleApproveAd: (id: string) => void, 
  handleRejectAd: (id: string) => void, 
  lang: string
) {
  const filteredAds = moderationAds.filter(ad => {
    if (adsFilter === 'pending') return ad.status === 'review';
    if (adsFilter === 'flagged') return ad.status === 'flagged';
    if (adsFilter === 'active') return ad.status === 'active';
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-2xs overflow-x-auto font-sans">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 text-[#4c5f78] font-bold uppercase text-[11px] tracking-wider">
            <th className="py-3 px-4">ANUNȚ</th>
            <th className="py-3 px-4">USUARIO</th>
            <th className="py-3 px-4">PRECIO</th>
            <th className="py-3 px-4 text-right">ACCIÓN</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100/80 text-xs">
          {filteredAds.map((ad) => (
            <tr key={ad.id} className="hover:bg-gray-50/60 transition-colors">
              {/* ANUNȚ Column */}
              <td className="py-4 px-4">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={ad.image} 
                    alt={ad.title} 
                    className="w-22 h-22 rounded-2xl object-cover border border-gray-200/80 shrink-0 shadow-2xs" 
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-[#111827]">{ad.title}</span>
                      <span className="bg-[#eef6ff] text-[#108474] border border-[#dbeafe] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Car size={11} /> AUTO
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <div className="flex items-center gap-1 text-[#38bdf8]">
                        <MapPin size={13} />
                        <span>Slatina, Olt</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <div className="flex items-center gap-1 text-gray-400 font-medium">
                        <Clock size={12} className="text-gray-400" />
                        <span>{ad.date || 'Astăzi, 14:20'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#38bdf8] font-semibold pt-0.5">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} />
                        <span>435</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gauge size={11} />
                        <span>3553 km</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>

              {/* USUARIO Column */}
              <td className="py-4 px-4 align-middle">
                <div className="flex items-center gap-3">
                  <img 
                    src={ad.avatar || '/an87.png'} 
                    alt={ad.seller} 
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-2xs shrink-0" 
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-[#111827]">{ad.seller}</span>
                      <div className="flex items-center gap-0.5">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-400 font-bold ml-0.5">(0)</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6b7280] font-medium">{ad.email || 'alexandruzet29@gmail.com'}</p>
                  </div>
                </div>
              </td>

              {/* PRECIO Column */}
              <td className="py-4 px-4 align-middle">
                <span className="font-black text-base text-[#0284c7]">{ad.price}</span>
              </td>

              {/* ACCIÓN Column */}
              <td className="py-4 px-4 align-middle text-right">
                <div className="flex items-center justify-end gap-3">
                  <button 
                    className="p-1.5 text-[#3b82f6] hover:text-[#108474] hover:bg-[#eff6ff] rounded-xl transition-colors cursor-pointer"
                    title="Vezi anunț"
                  >
                    <Eye size={19} />
                  </button>
                  
                  <button 
                    onClick={() => handleApproveAd(ad.id)}
                    className="p-1.5 text-[#008060] hover:text-[#059669] hover:bg-[#ecfdf5] rounded-xl transition-colors cursor-pointer"
                    title="Aprobă"
                  >
                    <Check size={19} />
                  </button>

                  <button 
                    onClick={() => handleRejectAd(ad.id)}
                    className="p-1.5 text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fef2f2] rounded-xl transition-colors cursor-pointer"
                    title="Respinge"
                  >
                    <X size={19} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

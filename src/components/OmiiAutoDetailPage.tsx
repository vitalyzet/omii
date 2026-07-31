import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Grid, 
  Maximize2, 
  Check, 
  Clock, 
  Flag, 
  Settings, 
  Calendar, 
  User, 
  Zap, 
  ShieldCheck, 
  BatteryCharging, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  X,
  Gauge,
  CheckCircle,
  Star,
  MessageSquare
} from 'lucide-react';
import { Language } from '../translations';

interface OmiiAutoDetailPageProps {
  listing?: {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    location: string;
    imageUrl: string;
    images?: string[];
    description?: string;
    category?: string;
    marca?: string;
    model?: string;
    an?: number | string;
    year?: number | string;
    combustibil?: string;
    kilometros?: number | string;
    condition?: string;
    subcat?: string;
    potencia?: string;
    transmission?: string;
  } | null;
  onBackToHome: () => void;
  lang?: Language;
}

const AUTO_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'
];

export default function OmiiAutoDetailPage({
  listing,
  onBackToHome,
  lang = 'ro'
}: OmiiAutoDetailPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showMoreBattery, setShowMoreBattery] = useState(false);
  const [showMoreSpecs, setShowMoreSpecs] = useState(true);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const displayTitle = listing?.title || 'BMW M3 Competition xDrive 2023';
  const displayPrice = listing?.price || '79.900 €';
  const displayLocation = listing?.location || 'București, Nord';
  const mainImage = listing?.imageUrl || AUTO_GALLERY_IMAGES[0];

  // Load all images if they exist, otherwise fallback to mock gallery
  const galleryList = listing?.images && listing.images.length > 0 
    ? listing.images 
    : [mainImage, ...AUTO_GALLERY_IMAGES.slice(1)];

  // Prepare technical specs for the 2-column layout
  const specsList = [
    { label: lang === 'es' ? 'Marca' : 'Marcă', value: listing?.marca },
    { label: lang === 'es' ? 'Modelo' : 'Model', value: listing?.model },
    { label: lang === 'es' ? 'Año' : 'An fabricație', value: listing?.year || listing?.an },
    { label: lang === 'es' ? 'Categoría' : 'Categorie', value: listing?.subcat || listing?.category },
    { label: lang === 'es' ? 'Kilometraje' : 'Rulaj', value: listing?.kilometros !== undefined ? `${new Intl.NumberFormat('ro-RO').format(Number(listing?.kilometros))} Km` : undefined },
    { label: lang === 'es' ? 'Combustible' : 'Combustibil', value: listing?.combustibil },
    { label: lang === 'es' ? 'Potencia' : 'Putere', value: listing?.potencia },
    { label: lang === 'es' ? 'Transmisión' : 'Cutie viteze', value: listing?.transmission },
    { label: lang === 'es' ? 'Estado' : 'Stare', value: listing?.condition },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans pb-16 pt-6">
      
      {/* Fullscreen Photo Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between p-4 sm:p-8 animate-fade-in backdrop-blur-md">
          {/* Top Bar */}
          <div className="w-full flex items-center justify-between text-white max-w-6xl">
            <span className="text-sm font-bold bg-white/20 px-3.5 py-1.5 rounded-full">
              📷 {activeImageIndex + 1} / {galleryList.length}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Center Image */}
          <div className="relative max-w-5xl max-h-[75vh] flex items-center justify-center my-auto">
            <img 
              src={galleryList[activeImageIndex]} 
              alt={displayTitle} 
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            
            <button
              onClick={handlePrevImage}
              className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center cursor-pointer transition-all"
            >
              <ChevronLeft size={30} />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center cursor-pointer transition-all"
            >
              <ChevronRight size={30} />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex items-center gap-2 max-w-4xl overflow-x-auto p-2">
            {galleryList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx ? 'border-white scale-110' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Breadcrumbs & Action Bar from imoob */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>{lang === 'es' ? 'Volver a resultados' : 'Înapoi la rezultate'}</span>
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-400">vindu24</span>
            <span className="text-gray-300">/</span>
            <span className="text-[#008060] font-bold">Auto & Moto</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{displayTitle}</span>
          </div>

          {/* Live Viewers & Favorites Badge from imoob */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#eef7f5] border border-[#bce0da] px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#0C4A6E]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>15 {lang === 'es' ? 'viendo ahora' : 'văd acum'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FEF2F2] border border-rose-100 px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#9F1239]">
              <Heart size={13} fill="#FB7185" className="text-rose-500" />
              <span>24 {lang === 'es' ? 'guardados' : 'favorite'}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT MAIN COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. PHOTO GALLERY CARD */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-gray-100 overflow-hidden cursor-pointer group"
              >
                <img 
                  src={galleryList[activeImageIndex]} 
                  alt={displayTitle}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
                />

                {/* Counter Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                  <span>📷 {activeImageIndex + 1}/{galleryList.length + 10}</span>
                </div>

                {/* Top Right Action Icons: Favorite Heart & Share */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
                    className={`p-2.5 rounded-full shadow-md backdrop-blur-xs border border-gray-200 transition-transform active:scale-90 cursor-pointer ${
                      isLiked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white/90 hover:bg-white text-gray-700'
                    }`}
                  >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(lang === 'es' ? 'Enlace copiado al portapapeles' : 'Link copiat în clipboard');
                    }}
                    className="p-2.5 bg-white/90 hover:bg-white text-gray-700 hover:text-[#108474] rounded-full shadow-md backdrop-blur-xs border border-gray-200 transition-transform active:scale-90 cursor-pointer"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Navigation Arrows (Prev / Next) */}
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                >
                  <ChevronRight size={22} />
                </button>

                {/* Overlay Action Buttons */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="pointer-events-auto bg-white/90 hover:bg-white text-[#108474] font-bold text-xs px-3.5 py-2 rounded-xl shadow-md border border-gray-200 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Grid size={15} />
                    <span>{lang === 'es' ? 'Todas las imágenes' : 'Toate imaginile'}</span>
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="pointer-events-auto bg-white/90 hover:bg-white text-[#108474] font-bold text-xs px-3.5 py-2 rounded-xl shadow-md border border-gray-200 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Maximize2 size={15} />
                    <span>{lang === 'es' ? 'Maximizar' : 'Mărește photo'}</span>
                  </button>
                </div>
              </div>

              {/* Thumbnails Row */}
              <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2.5 overflow-x-auto">
                {galleryList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#108474] ring-2 ring-[#108474]/20 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* 2. AUTO QUICK SPECIFICATIONS CARD (1:1 from screenshot 1) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                    <Flag size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Kilometraje' : 'Kilometraj'}</p>
                    <p className="text-base font-extrabold text-gray-900">{listing?.kilometros || '86.704'} km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] text-[#38bdf8] flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Año' : 'An'}</p>
                    <p className="text-base font-extrabold text-gray-900">{listing?.year || listing?.an || '2023'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fdf4ff] text-[#e879f9] flex items-center justify-center shrink-0">
                    <Gauge size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Potencia' : 'Putere'}</p>
                    <p className="text-base font-extrabold text-gray-900">510 CP</p>
                  </div>
                </div>

              </div>
            </div>

            {/* 4. DATOS TÉCNICOS TABLE CARD (1:1 from screenshot 4 & 5) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {lang === 'es' ? 'Datos técnicos' : 'Date tehnice'}
              </h3>

              <div className="flex flex-col text-sm pt-2">
                {Array.from({ length: Math.ceil(specsList.length / 2) }).map((_, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 py-3.5 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between py-1 md:py-0">
                      <span className="text-gray-400 font-semibold">{specsList[i * 2].label}</span>
                      <span className="font-extrabold text-gray-900">{specsList[i * 2].value}</span>
                    </div>
                    {specsList[i * 2 + 1] && (
                      <div className="flex items-center justify-between py-1 md:py-0 mt-2 md:mt-0 pt-2 md:pt-0 border-t border-gray-100 md:border-0">
                        <span className="text-gray-400 font-semibold">{specsList[i * 2 + 1].label}</span>
                        <span className="font-extrabold text-gray-900">{specsList[i * 2 + 1].value}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Optional Warranty Box */}
              {(listing as any)?.garantie && (
                <div className="mt-4 bg-[#f0fdf4] text-[#059669] p-4 rounded-xl flex items-center justify-between border border-[#bbf7d0]">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle size={18} className="text-[#059669]" />
                    <span>{lang === 'es' ? 'Garantía' : 'Garanție'}</span>
                  </div>
                  <span className="font-extrabold text-[#059669]">{(listing as any).garantie}</span>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT STICKY ACTION COLUMN (4 Cols) */}
          <div className="lg:col-span-4 sticky top-6">
            
            {/* Unified Seller & Price Card */}
            <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-gray-200/80 shadow-md space-y-6">
              
              {/* 1. Price & Title Section */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                    {displayPrice}
                  </h2>
                  <h3 className="text-base font-extrabold text-gray-800 mt-1">
                    {displayTitle}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    {displayLocation}
                  </p>
                </div>

                {/* Price Comparison Badge */}
                <div className="bg-gray-100/70 p-3 rounded-2xl flex items-center gap-3">
                  <span className="bg-[#008060] text-white font-extrabold text-[11px] px-2.5 py-1 rounded-md tracking-wider uppercase shadow-2xs">
                    EXCELENTE
                  </span>
                  <span className="text-xs font-bold text-gray-700">
                    {lang === 'es' ? 'Comparación de precio' : 'Comparație de preț'}
                  </span>
                </div>
              </div>

              {/* Subtle Divider */}
              <hr className="border-gray-100" />

              {/* 2. Seller Information Section */}
              <div className="space-y-4">
                {/* Top Badge */}
                <div className="bg-[#f0f9ff] text-[#0369a1] px-3.5 py-1.5 rounded-lg inline-flex items-center gap-2 self-start">
                  <User size={15} strokeWidth={2.5} />
                  <span className="text-xs font-extrabold tracking-wide uppercase">
                    {lang === 'es' ? 'Vendedor particular' : 'Vânzător particular'}
                  </span>
                </div>

                {/* Seller Profile Row */}
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-[#e0f2fe] flex items-center justify-center shrink-0">
                    <User size={26} className="text-[#0284c7]" strokeWidth={2} />
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col pt-0.5">
                    <h4 className="text-lg font-black text-gray-900 leading-tight">Alexandru B.</h4>
                    
                    <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 mt-1 text-xs">
                      <span className="flex items-center gap-1 text-[#16a34a] font-bold">
                        <ShieldCheck size={13} strokeWidth={2.5} /> {lang === 'es' ? 'Verificado' : 'Verificat'}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400 font-semibold">
                        <Clock size={13} /> {lang === 'es' ? 'En omii desde 2026' : 'Pe omii din 2026'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex items-center text-[#fbbf24]">
                        <Star size={13} className="fill-current" />
                        <Star size={13} className="fill-current" />
                        <Star size={13} className="fill-current" />
                        <Star size={13} className="fill-current" />
                        <Star size={13} className="fill-current" />
                      </div>
                      <span className="text-xs font-black text-gray-900 ml-1">5.0 (3)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Action Buttons Section */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  className="w-full py-3.5 px-4 bg-[#0ea5e9] hover:bg-[#0284c7] active:scale-[0.99] text-white font-extrabold text-[15px] rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-sm"
                >
                  <Phone size={19} />
                  <span>{lang === 'es' ? 'Mostrar teléfono' : 'Afișează telefonul'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert(lang === 'es' ? 'Mensaje enviado al vendedor.' : 'Mesaj trimis vânzătorului.')}
                  className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 active:scale-[0.99] text-[#1e293b] font-extrabold text-[15px] rounded-2xl transition-all cursor-pointer border-2 border-gray-100 flex items-center justify-center gap-2.5"
                >
                  <MessageSquare size={19} />
                  <span>{lang === 'es' ? 'Enviar mensaje' : 'Trimite mesaj'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

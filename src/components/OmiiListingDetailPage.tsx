import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Grid, 
  Maximize2, 
  Home, 
  Maximize, 
  Bed, 
  Bath, 
  MapPin, 
  Globe, 
  Check, 
  Star, 
  Calendar, 
  ThumbsUp, 
  ChevronUp, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Building,
  Heart,
  Share2,
  X
} from 'lucide-react';
import { Language } from '../translations';

interface OmiiListingDetailPageProps {
  listing?: {
    id: string;
    title: string;
    subtitle: string;
    price: string;
    location: string;
    imageUrl: string;
    category?: string;
    marca?: string;
    model?: string;
    an?: number | string;
    combustibil?: string;
    kilometros?: number | string;
  } | null;
  onBackToHome: () => void;
  lang?: Language;
}

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1de2d936b4?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
];

export default function OmiiListingDetailPage({
  listing,
  onBackToHome,
  lang = 'ro'
}: OmiiListingDetailPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showMoreInfo, setShowMoreInfo] = useState(true);
  const [showMoreAmenities, setShowMoreAmenities] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const isRealEstate = !listing?.category || 
    listing.category === 'Imobiliare' || 
    listing.category === 'Inmuebles' || 
    listing.category === 'anuncios';

  const isAuto = listing?.category === 'Auto & Moto' || listing?.category === 'Vehículos' || listing?.category === 'anuncios_auto';

  // Defaults based on category
  const displayTitle = listing?.title || (isAuto ? 'BMW M3 Competition xDrive 2023' : 'Apartament modern în centru');
  const displayPrice = listing?.price || (isAuto ? '79.900 €' : '350.000 €');
  const displayLocation = listing?.location || (isAuto ? 'București, Nord' : 'București');
  const mainImage = listing?.imageUrl || GALLERY_IMAGES[0];

  const galleryList = [mainImage, ...GALLERY_IMAGES.slice(1)];

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
            <span className="text-[#008060] font-bold">Imobiliare</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 truncate max-w-[200px]">{displayTitle}</span>
          </div>

          {/* Live Viewers & Favorites Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#eef7f5] border border-[#bce0da] px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#0C4A6E]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              <span>12 {lang === 'es' ? 'viendo ahora' : 'persoane văd acum'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FEF2F2] border border-rose-100 px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#9F1239]">
              <Heart size={13} fill="#FB7185" className="text-rose-500" />
              <span>18 {lang === 'es' ? 'guardados' : 'favorite'}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT MAIN COLUMN (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. MAIN PHOTO GALLERY CARD */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              
              {/* Main Image Viewport */}
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-gray-100 overflow-hidden cursor-pointer group"
              >
                <img 
                  src={galleryList[activeImageIndex]} 
                  alt={displayTitle}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02]"
                />

                {/* Photo Counter Badge (1/15) */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                  <span>📷 {activeImageIndex + 1}/{galleryList.length + 9}</span>
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

                {/* Overlay Action Buttons at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="pointer-events-auto bg-white/90 hover:bg-white text-[#108474] font-bold text-xs px-3.5 py-2 rounded-xl shadow-md border border-gray-200 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <Grid size={15} />
                    <span>{lang === 'es' ? 'Todas las imágenes' : 'Toate imaginile'}</span>
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="pointer-events-auto bg-white/90 hover:bg-white text-[#108474] font-bold text-xs px-3.5 py-2 rounded-xl shadow-md border border-gray-200 backdrop-blur-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <Maximize2 size={15} />
                    <span>{lang === 'es' ? 'Maximizar' : 'Mărește photo'}</span>
                  </button>
                </div>
              </div>

              {/* Thumbnail Previews Row */}
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

            {/* 2. QUICK FEATURES GRID CARD (Icons + Values) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/80 shadow-xs grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-6">
              {isAuto ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0 font-bold">
                      🏎️
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Marcă</p>
                      <p className="text-sm font-extrabold text-gray-900">{listing?.marca || 'BMW'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0 font-bold">
                      🚗
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Model</p>
                      <p className="text-sm font-extrabold text-gray-900">{listing?.model || 'M3 Competition'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0 font-bold">
                      📅
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Año / An</p>
                      <p className="text-sm font-extrabold text-gray-900">{listing?.an || '2023'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0 font-bold">
                      ⛽
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Combustible</p>
                      <p className="text-sm font-extrabold text-gray-900">{listing?.combustibil || 'Benzină'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0 font-bold">
                      🛣️
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Kilómetros</p>
                      <p className="text-sm font-extrabold text-gray-900">{listing?.kilometros || '24.500'} km</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0 font-bold">
                      📍
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">Ciudad</p>
                      <p className="text-sm font-extrabold text-gray-900">{displayLocation}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                      <Home size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Tipo' : 'Tip'}</p>
                      <p className="text-sm font-extrabold text-gray-900">Apartamente</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                      <Maximize size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Superficie' : 'Suprafață'}</p>
                      <p className="text-sm font-extrabold text-gray-900">120 m²</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                      <Bed size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Habitaciones' : 'Camere'}</p>
                      <p className="text-sm font-extrabold text-gray-900">3</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                      <Bath size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Baños' : 'Băi'}</p>
                      <p className="text-sm font-extrabold text-gray-900">2</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Ciudad' : 'Oraș'}</p>
                      <p className="text-sm font-extrabold text-gray-900">{displayLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'País' : 'Țară'}</p>
                      <p className="text-sm font-extrabold text-gray-900">RO</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 3. INFORMACIÓN BÁSICA TABLE CARD */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {lang === 'es' ? 'Información básica' : 'Informații de bază'}
              </h3>

              <div className="space-y-0.5 text-sm divide-y divide-gray-100">
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Tipo de inmueble' : 'Tip imobil'}</span>
                  <span className="font-bold text-gray-900">Apartamente</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Ubicación' : 'Ubicație'}</span>
                  <span className="font-bold text-gray-900">{displayLocation}, RO</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Precio' : 'Preț'}</span>
                  <span className="font-bold text-gray-900">{displayPrice}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Superficie construida' : 'Suprafață construită'}</span>
                  <span className="font-bold text-gray-900">120 m²</span>
                </div>

                {showMoreInfo && (
                  <>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Habitaciones' : 'Camere'}</span>
                      <span className="font-bold text-gray-900">3</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Baños' : 'Băi'}</span>
                      <span className="font-bold text-gray-900">2</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowMoreInfo(!showMoreInfo)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#108474] hover:underline cursor-pointer"
                >
                  <span>{showMoreInfo ? (lang === 'es' ? 'Mostrar menos' : 'Arată mai puțin') : (lang === 'es' ? 'Mostrar más' : 'Arată mai mult')}</span>
                  {showMoreInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* 4. EQUIPAMIENTO CARD */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-5">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {lang === 'es' ? 'Equipamiento' : 'Dotări și Echipamente'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-100/70 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-gray-800">
                  <Check size={16} className="text-gray-700" />
                  <span>{lang === 'es' ? 'Aire acondicionado' : 'Aer condiționat'}</span>
                </div>

                <div className="bg-gray-100/70 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-gray-800">
                  <Check size={16} className="text-gray-700" />
                  <span>{lang === 'es' ? 'Calefacción central' : 'Centrală termică propriie'}</span>
                </div>

                <div className="bg-gray-100/70 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-gray-800">
                  <Check size={16} className="text-gray-700" />
                  <span>{lang === 'es' ? 'Balcón' : 'Balcon'}</span>
                </div>

                <div className="bg-gray-100/70 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-gray-800">
                  <Check size={16} className="text-gray-700" />
                  <span>{lang === 'es' ? 'Terraza' : 'Terasă'}</span>
                </div>

                <div className="bg-gray-100/70 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-gray-800">
                  <Check size={16} className="text-gray-700" />
                  <span>{lang === 'es' ? 'Trastero' : 'Boxă depozitare'}</span>
                </div>

                <div className="bg-gray-100/70 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-gray-800">
                  <Check size={16} className="text-gray-700" />
                  <span>{lang === 'es' ? 'Ascensor' : 'Ascensor / Lift'}</span>
                </div>

                {showMoreAmenities && (
                  <>
                    <div className="bg-gray-100/70 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-gray-800">
                      <Check size={16} className="text-gray-700" />
                      <span>{lang === 'es' ? 'Armarios empotrados' : 'Dulapuri încorporate'}</span>
                    </div>

                    <div className="bg-gray-100/70 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-extrabold text-gray-800">
                      <Check size={16} className="text-gray-700" />
                      <span>{lang === 'es' ? 'Piscina comunitaria' : 'Piscină privată'}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowMoreAmenities(!showMoreAmenities)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#108474] hover:underline cursor-pointer"
                >
                  <span>{showMoreAmenities ? (lang === 'es' ? 'Mostrar menos' : 'Arată mai puțin') : (lang === 'es' ? 'Mostrar más' : 'Arată mai mult')}</span>
                  {showMoreAmenities ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>

            {/* 5. DESCRIPCIÓN DEL INMUEBLE CARD */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {lang === 'es' ? 'Descripción del Inmueble' : 'Descrierea Imobilului'}
              </h3>

              <div className="space-y-3 text-sm text-gray-700 leading-relaxed font-medium">
                <p className="font-extrabold text-gray-900 text-base">
                  {displayTitle}
                </p>
                <p className="font-semibold text-gray-800">
                  {lang === 'es' ? 'Vedere panoramică, recent renovat.' : 'Vedere panoramică, recent renovat complet.'}
                </p>
                <p>
                  Magnífico apartamento situado en una de las mejores zonas de București. Cuenta con 120 m² distribuidos en 3 amplias habitaciones y 2 cuartos de baño completos. Destaca por su excelente orientación, que garantiza luz natural durante la mayor parte del día, y sus materiales de alta calidad.
                </p>
                <p>
                  La propiedad incluye plaza de garaje y trastero en el mismo edificio. Gastos de comunidad muy razonables. No pierda la oportunidad de visitarlo. Póngase en contacto con nosotros para más información o para concertar una cita.
                </p>
              </div>
            </div>

            {/* 6. ACERCA DE ESTA INMOBILIARIA CARD */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {lang === 'es' ? 'Acerca de esta inmobiliaria' : 'Despre această agenție imobiliară'}
              </h3>

              {/* Rating header */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-gray-900">4,9</span>
                <div>
                  <div className="flex text-amber-500 gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={18} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-400 mt-0.5">
                    (42 {lang === 'es' ? 'Valoraciones' : 'Evaluări'})
                  </p>
                </div>
              </div>

              {/* Value Badges */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-900">
                  {lang === 'es' ? 'Los clientes valoran:' : 'Clienții apreciază:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100/80 text-gray-800 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    {lang === 'es' ? 'Excelente trato' : 'Atitudine excelentă'} <Check size={14} className="text-gray-700" />
                  </span>
                  <span className="bg-gray-100/80 text-gray-800 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    {lang === 'es' ? 'Responde rápido' : 'Răspuns rapid'} <Check size={14} className="text-gray-700" />
                  </span>
                  <span className="bg-gray-100/80 text-gray-800 text-xs font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    {lang === 'es' ? 'Muy profesionales' : 'Profesionalism'} <Check size={14} className="text-gray-700" />
                  </span>
                </div>
              </div>

              {/* Stat Metrics Grid */}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Experiencia en el sector' : 'Experiență în domeniu'}</p>
                    <p className="text-base font-extrabold text-gray-900">15 {lang === 'es' ? 'años' : 'ani'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0">
                    <Building size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Propiedades activas' : 'Anunțuri active'}</p>
                    <p className="text-base font-extrabold text-gray-900">30</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eef7f5] text-[#108474] flex items-center justify-center shrink-0">
                    <ThumbsUp size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Tasa de éxito' : 'Rată de succes'}</p>
                    <p className="text-base font-extrabold text-gray-900">98%</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT STICKY ACTION COLUMN (4 Cols) */}
          <div className="lg:col-span-4 sticky top-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-md space-y-5">
              
              {/* Price */}
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

              {/* Price Comparison Box */}
              <div className="bg-gray-100/70 p-3.5 rounded-2xl flex items-center gap-3">
                <span className="bg-[#008060] text-white font-extrabold text-[11px] px-2.5 py-1 rounded-md tracking-wider uppercase shadow-2xs">
                  EXCELENTE
                </span>
                <span className="text-xs font-bold text-gray-700">
                  {lang === 'es' ? 'Comparación de precio' : 'Comparație de preț'}
                </span>
              </div>

              {/* Primary Action Button: Enviar mensaje */}
              <button
                type="button"
                onClick={() => alert(lang === 'es' ? 'Mensaje enviado a la inmobiliaria.' : 'Mesaj trimis agenției imobiliare.')}
                className="w-full py-3.5 px-4 bg-[#108474] hover:bg-[#0e7063] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                <span>{lang === 'es' ? 'Enviar mensaje' : 'Trimite mesaj'}</span>
              </button>

              {/* imoob Green Call Agent Button */}
              <a 
                href="tel:+40721890123"
                className="w-full py-3.5 px-4 bg-[#008060] hover:bg-[#006c51] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                <span>{lang === 'es' ? 'Llamar al agente' : 'Apelează agentul'}</span>
              </a>

              {/* imoob Black WhatsApp Chat Button with Orange Notification Dot */}
              <a 
                href="https://wa.me/40721890123"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-black hover:bg-stone-800 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 relative shadow-md"
              >
                <span>Chat WhatsApp</span>
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#f97316] rounded-full border-2 border-white shadow-sm"></div>
              </a>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

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
  X
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

  const galleryList = [mainImage, ...AUTO_GALLERY_IMAGES.slice(1)];

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
                  <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Potencia' : 'Putere'}</p>
                    <p className="text-base font-extrabold text-gray-900">375 kW (510 cv)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                    <Settings size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Transmisión' : 'Transmisie'}</p>
                    <p className="text-base font-extrabold text-gray-900">Automático</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Primer registro' : 'An fabricație'}</p>
                    <p className="text-base font-extrabold text-gray-900">{listing?.an ? `01/${listing.an}` : '10/2015'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Propietarios' : 'Proprietari'}</p>
                    <p className="text-base font-extrabold text-gray-900">1</p>
                  </div>
                </div>
              </div>

              {/* Special dealer features */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <p className="text-xs font-extrabold text-gray-900">
                  {lang === 'es' ? 'Características especiales según el concesionario' : 'Dotări speciale menționate de dealer'}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <span className="bg-gray-100/80 text-gray-800 text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-gray-200/60">
                    <Check size={14} className="text-gray-700" /> 1-Hand*Xenon*SHz
                  </span>
                  <span className="bg-gray-100/80 text-gray-800 text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-gray-200/60">
                    <Check size={14} className="text-gray-700" /> Lagerschaden
                  </span>
                  <span className="bg-gray-100/80 text-gray-800 text-xs font-extrabold px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-gray-200/60">
                    <Check size={14} className="text-gray-700" /> Klima*Tempomat*BC
                  </span>
                </div>
              </div>

            </div>

            {/* 3. BATTERY INFORMATION CARD (1:1 from screenshot 2 & 3) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    {lang === 'es' ? 'Información sobre la batería' : 'Informații despre baterie'}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      {lang === 'es' ? 'Salud de la batería' : 'Sănătate baterie'} <HelpCircle size={13} className="text-gray-400" />
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-3xl font-black text-gray-900">93.0%</span>
                    <span className="bg-[#008060] text-white font-extrabold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5">
                      🔋 {lang === 'es' ? 'Muy buena' : 'Excelentă'}
                    </span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => alert(lang === 'es' ? 'Certificado de batería verificado: OK 93.0%' : 'Certificat baterie verificat: OK 93.0%')}
                  className="px-4 py-2.5 bg-[#108474] hover:bg-[#5B21B6] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
                >
                  <ShieldCheck size={16} />
                  <span>{lang === 'es' ? 'Mostrar certificado de batería' : 'Arată certificat baterie'}</span>
                </button>
              </div>

              {/* Battery Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      {lang === 'es' ? 'Autonomía (WLTP)' : 'Autonomie (WLTP)'} <HelpCircle size={12} />
                    </p>
                    <p className="text-base font-extrabold text-gray-900">419 km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      {lang === 'es' ? 'Garantía de la batería' : 'Garanție baterie'} <HelpCircle size={12} />
                    </p>
                    <p className="text-xs font-extrabold text-gray-900 leading-tight">
                      Hasta 12/2028 o 160.000 km
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#fff6ef] text-[#fea74f] flex items-center justify-center shrink-0">
                    <BatteryCharging size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{lang === 'es' ? 'Capacidad de la batería' : 'Capacitate baterie'}</p>
                    <p className="text-base font-extrabold text-gray-900">62 kWh</p>
                  </div>
                </div>
              </div>

              {/* Charging Times expandable section */}
              {showMoreBattery && (
                <div className="pt-4 border-t border-gray-100 space-y-4 animate-fade-in">
                  <h4 className="text-sm font-extrabold text-gray-900">{lang === 'es' ? 'Tiempo de carga' : 'Timp de încărcare'}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-semibold text-gray-500 flex items-center gap-1">
                        {lang === 'es' ? 'Carga rápida' : 'Încărcare rapidă'} <HelpCircle size={12} />
                      </p>
                      <p className="font-bold text-gray-800 mt-1">-</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500 flex items-center gap-1">
                        {lang === 'es' ? 'Tiempo de carga en casa (11 kW)' : 'Timp încărcare acasă (11 kW)'} <HelpCircle size={12} />
                      </p>
                      <p className="font-bold text-gray-800 mt-1">9 Horas 30 Min.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500 flex items-center gap-1">
                        {lang === 'es' ? 'Tipos de conectores' : 'Tip conector'} <HelpCircle size={12} />
                      </p>
                      <p className="font-bold text-gray-800 mt-1">-</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-500 flex items-center gap-1">
                        {lang === 'es' ? 'Carga bidireccional' : 'Încărcare bidirecțională'} <HelpCircle size={12} />
                      </p>
                      <p className="font-bold text-gray-800 mt-1">-</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowMoreBattery(!showMoreBattery)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#108474] hover:underline cursor-pointer"
                >
                  <span>{showMoreBattery ? (lang === 'es' ? 'Mostrar menos' : 'Arată mai puțin') : (lang === 'es' ? 'Mostrar más' : 'Arată mai mult')}</span>
                  {showMoreBattery ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

            </div>

            {/* 4. DATOS TÉCNICOS TABLE CARD (1:1 from screenshot 4 & 5) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                {lang === 'es' ? 'Datos técnicos' : 'Date tehnice'}
              </h3>

              <div className="space-y-0.5 text-xs sm:text-sm divide-y divide-gray-100">
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold flex items-center gap-1">
                    {lang === 'es' ? 'Estado del vehículo' : 'Stare vehicul'} <HelpCircle size={13} className="text-gray-400" />
                  </span>
                  <span className="font-bold text-gray-900">{lang === 'es' ? 'Ocasión, Con daños, Sin accidentes' : 'Second-hand, Fără accidente'}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Categoría' : 'Categorie'}</span>
                  <span className="font-bold text-gray-900">Sedán</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Gama de modelos' : 'Gama de modele'}</span>
                  <span className="font-bold text-gray-900">BM</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Línea de recorte' : 'Echipare'}</span>
                  <span className="font-bold text-gray-900">Active</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Origen' : 'Origine'}</span>
                  <span className="font-bold text-gray-900">{lang === 'es' ? 'Edición para Alemania' : 'Ediție Germania'}</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Kilometraje' : 'Rulaj KM'}</span>
                  <span className="font-bold text-gray-900">77.272 km</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Capacidad cúbica' : 'Capacitate cilindrică'}</span>
                  <span className="font-bold text-gray-900">1.998 ccm</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Potencia' : 'Putere motor'}</span>
                  <span className="font-bold text-gray-900">110 kW (150 cv)</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Tipo de tracción' : 'Tip tracțiune'}</span>
                  <span className="font-bold text-gray-900">Motor de combustión interna</span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Combustible' : 'Combustibil'}</span>
                  <span className="font-bold text-gray-900">Diesel</span>
                </div>

                {showMoreSpecs && (
                  <>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Consumo de energía (comb.)2' : 'Consum energie (comb.)'}</span>
                      <span className="font-bold text-gray-900">5,5 l/100km</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Emisiones de CO₂ (comb.)2' : 'Emisii CO₂'}</span>
                      <span className="font-bold text-gray-900">156 g/km</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Clase de CO₂' : 'Clasă CO₂'}</span>
                      <span className="font-bold text-gray-900 text-right max-w-xs">
                        {lang === 'es' ? 'Sobre la base de las emisiones de CO₂ (combinadas)' : 'Pe baza emisiilor combinate de CO₂'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Consumo de combustible2' : 'Consum detaliat'}</span>
                      <span className="font-bold text-gray-900 text-right max-w-xs">
                        5,5 l/100km (combinado), 7,0 l/100km (urbano), 4,7 l/100km (autovía)
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Número de asientos' : 'Număr locuri'}</span>
                      <span className="font-bold text-gray-900">5</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Número de puertas' : 'Număr meciuri/uși'}</span>
                      <span className="font-bold text-gray-900">4/5</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Transmisión' : 'Cutie de viteze'}</span>
                      <span className="font-bold text-gray-900">Cambio manual</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Clase de emisión' : 'Normă poluare'}</span>
                      <span className="font-bold text-gray-900">Euro5</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Pegatina de emisiones' : 'Etihetă emisii'}</span>
                      <span className="font-bold text-gray-900">4 (Verde)</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-500 font-semibold">{lang === 'es' ? 'Primer registro' : 'Prima înmatriculare'}</span>
                      <span className="font-bold text-gray-900">03/2012</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#108474] hover:underline cursor-pointer"
                >
                  <span>{showMoreSpecs ? (lang === 'es' ? 'Mostrar menos' : 'Arată mai puțin') : (lang === 'es' ? 'Mostrar más' : 'Arată mai mult')}</span>
                  {showMoreSpecs ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
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
                onClick={() => alert(lang === 'es' ? 'Mensaje enviado al vendedor.' : 'Mesaj trimis vânzătorului.')}
                className="w-full py-3.5 px-4 bg-[#108474] hover:bg-[#0e7063] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                <span>{lang === 'es' ? 'Enviar mensaje' : 'Trimite mesaj'}</span>
              </button>

              {/* imoob Green Call Agent Button */}
              <a 
                href="tel:+40733987654"
                className="w-full py-3.5 px-4 bg-[#008060] hover:bg-[#006c51] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                <span>{lang === 'es' ? 'Llamar al vendedor' : 'Apelează vânzătorul'}</span>
              </a>

              {/* imoob Black WhatsApp Chat Button with Orange Notification Dot */}
              <a 
                href="https://wa.me/40733987654"
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

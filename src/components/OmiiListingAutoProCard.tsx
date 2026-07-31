import React from 'react';
import { MapPin, Heart, Calendar, Gauge, Fuel, Sparkles } from 'lucide-react';

interface OmiiListingAutoProCardProps {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  location: string;
  imageUrl: string;
  category?: string;
  autoDetails?: {
    year?: string;
    mileage?: string;
    fuel?: string;
    transmission?: string;
    bodyType?: string;
    color?: string;
  };
}

export default function OmiiListingAutoProCard({
  id,
  title,
  subtitle,
  price,
  location,
  imageUrl,
  autoDetails
}: OmiiListingAutoProCardProps) {
  const details = autoDetails || {
    year: '2022',
    mileage: '35,100',
    fuel: 'Gasolina',
    transmission: 'Auto',
    bodyType: 'SUV',
    color: 'Negro'
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full shadow-sm relative cursor-pointer">
      {/* Promotion Pill */}
      <div className="absolute top-3 left-3 z-30">
        <div className="bg-sky-100/95 backdrop-blur-sm text-sky-700 px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5 border border-sky-200/60">
          <Sparkles size={11} className="text-sky-500" />
          <span className="font-extrabold text-[9px] uppercase tracking-widest mt-0.5">Promovată</span>
        </div>
      </div>

      <div className="relative h-[220px] sm:h-[200px] w-full shrink-0 overflow-hidden rounded-t-2xl">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hover Overlay with Vezi anunțul */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2350] via-[#0f2350]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-5 z-20">
          <span className="text-white font-bold text-[16px] tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            Vezi anunțul
          </span>
        </div>

        {/* Gradient line at the bottom of the image */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-amber-400 via-[#1d4ed8] to-[#1d4ed8] z-30"></div>
        
        {/* Favorite Heart Button */}
        <div className="absolute top-3 right-3 z-20">
          <button 
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:scale-110 transition-transform text-gray-400 hover:text-red-500"
          >
            <Heart size={16} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Top Badge */}
        <div className="absolute top-12 left-3 z-10 flex flex-col gap-1.5">
          <span className="bg-[#008060] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm w-fit">
            Nou
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow bg-white rounded-b-2xl">
        <div className="flex justify-between items-start mb-4 gap-2">
          <div className="flex flex-col min-w-0 pt-0.5">
            <h3 className="font-extrabold text-[#1e3a8a] text-[17px] tracking-tight leading-tight mb-1 truncate">
              {title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium mb-0.5 truncate">
              <MapPin size={11} className="text-gray-400 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <span className="text-[12px] text-gray-400 font-medium truncate">
              {subtitle || `${details.bodyType} - ${details.color}`}
            </span>
          </div>
          
          <div className="flex flex-col items-end shrink-0">
            <div className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200/80 text-gray-900 px-4 py-1.5 rounded-full shadow-sm font-extrabold text-[15px] tracking-tight mb-1.5 flex items-center whitespace-nowrap">
              {price}
            </div>
            <div className="flex items-center gap-1.5 text-[9.5px] text-gray-400 font-bold tracking-wider uppercase">
              <span>#{id.substring(0, 6).toUpperCase()}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="w-full h-px bg-gray-100 mb-3"></div>
          
          <div className="grid grid-cols-4 gap-1 divide-x divide-gray-100">
            {/* Kilometraj */}
            <div className="flex flex-col items-center justify-center px-0.5 text-center">
              <Gauge size={16} className="text-gray-400 mb-1.5" strokeWidth={2.5} />
              <span className="text-[7.5px] font-black uppercase tracking-wide text-gray-400 mb-0.5">KILOMETRAJE</span>
              <span className="text-[11px] font-extrabold text-gray-800 truncate w-full">{details.mileage}</span>
            </div>
            
            {/* Combustibil */}
            <div className="flex flex-col items-center justify-center px-0.5 text-center">
              <Fuel size={16} className="text-gray-400 mb-1.5" strokeWidth={2.5} />
              <span className="text-[7.5px] font-black uppercase tracking-wide text-gray-400 mb-0.5">COMBUSTIBLE</span>
              <span className="text-[11px] font-extrabold text-gray-800 truncate w-full">{details.fuel}</span>
            </div>
            
            {/* Transmisie */}
            <div className="flex flex-col items-center justify-center px-0.5 text-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-1.5">
                <path d="M6 4v16"/><path d="M12 4v16"/><path d="M18 4v16"/><path d="M6 12h12"/>
              </svg>
              <span className="text-[7.5px] font-black uppercase tracking-wide text-gray-400 mb-0.5">TRANSMISIÓN</span>
              <span className="text-[11px] font-extrabold text-gray-800 truncate w-full">{details.transmission}</span>
            </div>
            
            {/* An */}
            <div className="flex flex-col items-center justify-center px-0.5 text-center">
              <Calendar size={16} className="text-gray-400 mb-1.5" strokeWidth={2.5} />
              <span className="text-[7.5px] font-black uppercase tracking-wide text-gray-400 mb-0.5">AÑO</span>
              <span className="text-[11px] font-extrabold text-gray-800 truncate w-full">{details.year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

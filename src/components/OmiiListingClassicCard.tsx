import React from 'react';
import { Heart, Camera } from 'lucide-react';

interface OmiiListingClassicCardProps {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  location: string;
  imageUrl: string;
  category?: string;
}

export default function OmiiListingClassicCard({
  title,
  subtitle,
  price,
  location,
  imageUrl
}: OmiiListingClassicCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200 cursor-pointer group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:h-[240px] w-full bg-gray-100 flex-shrink-0 overflow-hidden rounded-t-xl">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Camera icon with photo count */}
        <div className="absolute top-2.5 left-2.5 bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 backdrop-blur-xs">
          <Camera size={12} strokeWidth={2.5} />
          <span>1/4</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Title in blue, uppercase-like */}
          <h3 className="font-extrabold text-[15px] text-[#0066cc] uppercase line-clamp-2 leading-snug mb-1 group-hover:text-[#0e7063] transition-colors">
            {title}
          </h3>

          {/* Subtitle in dark gray */}
          <p className="text-gray-600 text-[13.5px] font-normal line-clamp-2 mb-3 leading-relaxed">
            {subtitle}
          </p>

          {/* Price */}
          <div className="font-extrabold text-[18px] text-gray-900 mb-2">
            {price}
          </div>
        </div>

        {/* Separator line */}
        <div className="w-full h-[1px] bg-[#bce0da]/60 my-2.5"></div>

        {/* Footer: Location/Time and Heart */}
        <div className="flex justify-between items-end mt-auto pt-1">
          <div className="text-[12px] text-gray-500 font-medium">
            <div className="truncate max-w-[170px]">{location}</div>
            <div className="text-gray-400 text-[11px] mt-0.5">Hace 2 horas</div>
          </div>

          {/* Heart icon on bottom right */}
          <button className="text-[#0066cc] hover:text-[#0a5248] transition-colors bg-[#eef7f5]/60 p-2 rounded-full border-none cursor-pointer hover:bg-[#bce0da]/60">
            <Heart size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

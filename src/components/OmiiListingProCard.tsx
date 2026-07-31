import React from 'react';
import { Heart } from 'lucide-react';

interface OmiiListingProCardProps {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  location: string;
  imageUrl: string;
  category?: string;
  oldPrice?: string;
  discount?: string;
}

export default function OmiiListingProCard({
  title,
  price,
  location,
  imageUrl,
  category = 'Computadora portátil',
  oldPrice,
  discount
}: OmiiListingProCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer font-sans border border-gray-200/60 shadow-xs relative group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full bg-gray-100 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        
        {/* Discount ribbon */}
        {discount && (
          <div className="absolute top-0 left-0 w-[70px] h-[70px] overflow-hidden z-10">
             <div className="bg-[#7c83fd] text-white text-[12px] font-bold py-1 w-[100px] text-center absolute top-3 -left-7 -rotate-45 shadow-sm">
                {discount}
             </div>
          </div>
        )}

        {/* Top-left category badge (if no discount overlay) */}
        {!discount && category && (
          <div className="absolute top-0 left-0 bg-[#3a3f47]/90 text-white text-[12px] font-medium px-2 py-0.5">
            {category}
          </div>
        )}

        {/* Bottom-left location overlay */}
        <div className="absolute bottom-2 left-2 bg-[#444341]/80 text-white text-[12px] font-medium px-2 py-1 rounded flex items-center gap-1.5 backdrop-blur-xs">
          <div className="w-3.5 h-3.5 bg-white rounded-sm flex items-center justify-center">
            <span className="text-[#444341] text-[9px] font-black">₽</span>
          </div>
          <span>{location}</span>
        </div>
      </div>

      {/* Floating Heart Button */}
      <div className="relative w-full h-0 z-10">
        <button className="absolute -top-4.5 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-gray-100/50 hover:text-red-500 transition-colors text-gray-700 hover:scale-105 active:scale-95">
          <Heart size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-3.5 pt-4 flex flex-col flex-1 bg-white">
        {/* Price Row */}
        <div className="flex items-end gap-2 mb-1.5">
          <span className="font-bold text-[18px] text-[#2c2d2e] leading-none">
            {price}
          </span>
          {oldPrice && (
            <span className="text-gray-400 text-[13px] line-through font-medium leading-none mb-[2px]">
              {oldPrice}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-[14.5px] font-normal text-[#2c2d2e] line-clamp-2 leading-snug">
          {title}
        </h3>
      </div>
    </div>
  );
}

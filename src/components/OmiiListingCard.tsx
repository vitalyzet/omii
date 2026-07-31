import React from 'react';
import { Heart, MapPin, Tag } from 'lucide-react';

interface OmiiListingCardProps {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  location: string;
  imageUrl: string;
  category?: string;
}

export default function OmiiListingCard({
  title,
  subtitle,
  price,
  location,
  imageUrl,
  category
}: OmiiListingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-gray-200 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={18} className="text-gray-500 hover:text-red-500 cursor-pointer" />
        </div>
        {category && (
          <div className="absolute top-2 left-2 bg-indigo-600/90 text-white text-xs px-2 py-1 rounded shadow-sm font-medium">
            {category}
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">{title}</h3>
          <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="font-bold text-lg text-indigo-700">{price}</span>
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate max-w-[100px]">{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

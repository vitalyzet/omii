import React from 'react';
import { Heart, MapPin } from 'lucide-react';

interface OmiiListingListCardProps {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  location: string;
  imageUrl: string;
  category?: string;
}

export default function OmiiListingListCard({
  title,
  subtitle,
  price,
  location,
  imageUrl,
  category
}: OmiiListingListCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col sm:flex-row h-full sm:h-48">
      <div className="relative w-full sm:w-1/3 h-48 sm:h-full bg-gray-200 flex-shrink-0">
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

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-2 leading-tight flex-1 pr-4">{title}</h3>
            <span className="font-bold text-lg text-indigo-700 whitespace-nowrap">{price}</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">{subtitle}</p>
        </div>

        <div className="flex items-center text-gray-400 text-sm mt-4 pt-4 border-t border-gray-100">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">{location}</span>
          <span className="ml-auto text-xs text-gray-400">Hace 2h</span>
        </div>
      </div>
    </div>
  );
}

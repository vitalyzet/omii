import React, { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';

export default function OmiiSearchBar() {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="w-full flex flex-col md:flex-row gap-0 border-b border-gray-200 bg-white">
      {/* Keyword Search */}
      <div className="flex-1 flex items-center bg-gray-50 px-4 py-3 border-r border-gray-200">
        <input 
          type="text" 
          placeholder="Busco..." 
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <div className="flex items-center space-x-2 text-[#108474]">
          <Search size={20} className="cursor-pointer hover:text-[#0a5248]" />
          {keyword && <X size={20} className="cursor-pointer hover:text-[#0a5248]" onClick={() => setKeyword('')} />}
        </div>
      </div>

      {/* Location Search */}
      <div className="flex-1 flex items-center bg-gray-50 px-4 py-3">
        <div className="flex-1 flex flex-col">
          <span className="text-xs text-gray-400">Cerca de...</span>
          <input 
            type="text" 
            placeholder="Código postal, ciudad..." 
            className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 text-[#108474]">
          <MapPin size={20} className="cursor-pointer hover:text-[#0a5248]" />
          {location && <X size={20} className="cursor-pointer hover:text-[#0a5248]" onClick={() => setLocation('')} />}
        </div>
      </div>

      {/* Location Permission Error Mock */}
      <div className="w-full bg-white px-4 py-1 text-xs text-red-500 absolute top-full left-0 hidden">
        El permiso de ubicación está bloqueado. Actívalo en la configuración del navegador.
      </div>
    </div>
  );
}

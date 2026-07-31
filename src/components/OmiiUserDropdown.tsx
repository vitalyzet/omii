import React, { useState } from 'react';
import { TRANSLATIONS, Language } from '../translations';

interface OmiiUserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

export default function OmiiUserDropdown({ isOpen, onClose, lang = 'ro' }: OmiiUserDropdownProps) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ro;
  const [activeTab, setActiveTab] = useState('Mis anuncios');

  if (!isOpen) return null;

  const menuItems = [
    { id: 'Mis anuncios', label: t.menuMyAds, icon: '/listings.png' }
  ];

  return (
    <>
      {/* Click outside backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-2xs" 
        onClick={onClose} 
      />

      {/* User Panel Dropdown Container */}
      <div className="absolute right-0 top-full mt-2.5 w-[260px] bg-white rounded-2xl shadow-2xl border border-gray-200/90 z-50 overflow-hidden font-sans text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
        
        {/* Top Credits & Karma Bar */}
        <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
            <img src="/credits.png" alt="Créditos" className="w-4 h-4 object-contain" />
            <span>0 {lang === 'ro' ? 'Credite' : 'Créditos'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
            <img src="/karma.png" alt="Karma" className="w-4 h-4 object-contain" />
            <span>0 Karma</span>
          </div>
        </div>

        {/* Navigation Menu List */}
        <div className="py-1.5">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`relative w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer group ${
                  isActive 
                    ? 'bg-[#eef7f5]/40 text-gray-900 font-bold' 
                    : 'hover:bg-gray-50 text-gray-700 font-medium'
                }`}
              >
                {/* Active Indicator Bar on Left */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3.5px] h-6 bg-[#108474] rounded-r-md" />
                )}

                {/* Left Icon + Text */}
                <div className="flex items-center gap-3">
                  <img 
                    src={item.icon} 
                    alt={item.label} 
                    className="w-5 h-5 object-contain opacity-85 group-hover:opacity-100 transition-opacity" 
                  />
                  <span className="text-[14.5px] tracking-tight">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </>
  );
}

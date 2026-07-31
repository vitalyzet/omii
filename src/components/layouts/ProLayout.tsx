import React, { useState, useRef } from 'react';
import OmiiListingGrid from '../OmiiListingGrid';
import { 
  Building2, 
  CarFront, 
  ShoppingBag, 
  Briefcase,
  Store,
  Wrench,
  GraduationCap,
  Coffee,
  Grid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { TRANSLATIONS, Language } from '../../translations';

interface ProLayoutProps {
  lang?: Language;
  onSelectListing?: (listing: any) => void;
}

export default function ProLayout({ lang = 'ro', onSelectListing }: ProLayoutProps) {
  const t = TRANSLATIONS[lang];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categories = [
    { key: 'catAll', name: t.catAll, icon: Grid, color: 'bg-gray-800' },
    { key: 'catBuySell', name: t.catBuySell, icon: ShoppingBag, color: 'bg-[#5a55d1]' },
    { key: 'catVehicles', name: t.catVehicles, icon: CarFront, color: 'bg-[#ef4444]' },
    { key: 'catRealEstate', name: t.catRealEstate, icon: Building2, color: 'bg-[#22c55e]' },
    { key: 'catJobs', name: t.catJobs, icon: Briefcase, color: 'bg-[#7c3aed]' },
    { key: 'catBusiness', name: t.catBusiness, icon: Store, color: 'bg-[#f97316]' },
    { key: 'catServices', name: t.catServices, icon: Wrench, color: 'bg-[#3b82f6]' },
    { key: 'catCourses', name: t.catCourses, icon: GraduationCap, color: 'bg-[#ec4899]' },
    { key: 'catLeisure', name: t.catLeisure, icon: Coffee, color: 'bg-[#eab308]' },
  ];

  const handleSelectCategory = (categoryKey: string) => {
    if (categoryKey === 'catAll' || selectedCategory === categoryKey) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

  const currentSelectedCategoryName = categories.find(c => c.key === selectedCategory)?.name || selectedCategory;

  return (
    <div className="flex-1 w-full bg-gray-50 overflow-y-auto">
      {/* Centered Page Wrapper */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-6">
        
        {/* Top Horizontal Categories Slider Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-gray-900">
                Categorías
              </h2>
              {selectedCategory && (
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {currentSelectedCategoryName}
                </span>
              )}
            </div>

            {/* Slider Navigation Controls & Reset */}
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 underline transition-colors cursor-pointer mr-2"
                >
                  {t.viewAll}
                </button>
              )}
              <button 
                onClick={() => scroll('left')}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center border border-gray-200/80 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                title="Anterior"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center border border-gray-200/80 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                title="Siguiente"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Smooth 2-Row Carousel Track */}
          <div 
            ref={sliderRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-max gap-3 overflow-x-auto py-1 scroll-smooth no-scrollbar scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = cat.key === 'catAll' 
                ? selectedCategory === null 
                : selectedCategory === cat.key;

              return (
                <button
                  key={cat.key}
                  onClick={() => handleSelectCategory(cat.key)}
                  className={`flex items-center gap-3 px-4.5 py-2.5 rounded-2xl border transition-all cursor-pointer shrink-0 group ${
                    isSelected 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-md font-bold scale-[1.02]' 
                      : 'bg-gray-50/90 hover:bg-gray-100/90 border-gray-200/80 text-gray-800 font-semibold hover:border-gray-300'
                  }`}
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-white ${cat.color} shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon size={20} strokeWidth={2.2} />
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid Area */}
        <main className="w-full">
          <OmiiListingGrid selectedCategory={selectedCategory} viewMode="pro" lang={lang} onSelectListing={onSelectListing} />
        </main>
      </div>
    </div>
  );
}

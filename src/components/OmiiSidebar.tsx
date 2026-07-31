import React from 'react';
import { 
  Building2, 
  CarFront, 
  ShoppingBag, 
  Briefcase,
  Store,
  Wrench,
  GraduationCap,
  Coffee,
  ChevronRight
} from 'lucide-react';
import { TRANSLATIONS, Language } from '../translations';

interface OmiiSidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
  lang?: Language;
}

export default function OmiiSidebar({ selectedCategory, onSelectCategory, lang = 'ro' }: OmiiSidebarProps) {
  const t = TRANSLATIONS[lang];

  const categories = [
    { key: 'catBuySell', name: t.catBuySell, icon: ShoppingBag, color: 'bg-[#5a55d1]' },
    { key: 'catVehicles', name: t.catVehicles, icon: CarFront, color: 'bg-[#ef4444]' },
    { key: 'catRealEstate', name: t.catRealEstate, icon: Building2, color: 'bg-[#22c55e]' },
    { key: 'catJobs', name: t.catJobs, icon: Briefcase, color: 'bg-[#7c3aed]' },
    { key: 'catBusiness', name: t.catBusiness, icon: Store, color: 'bg-[#f97316]' },
    { key: 'catServices', name: t.catServices, icon: Wrench, color: 'bg-[#3b82f6]' },
    { key: 'catCourses', name: t.catCourses, icon: GraduationCap, color: 'bg-[#ec4899]' },
    { key: 'catLeisure', name: t.catLeisure, icon: Coffee, color: 'bg-[#eab308]' },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl border border-gray-200/80 p-4 flex-shrink-0 shadow-sm h-fit">
      <h2 className="font-bold text-lg text-gray-800 mb-4 px-2">Categorías</h2>
      <ul className="space-y-1.5">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.name || selectedCategory === category.key;
          
          return (
            <li key={category.key}>
              <button 
                onClick={() => onSelectCategory(category.key)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all group
                  ${isSelected 
                    ? 'bg-gray-100/90 font-semibold' 
                    : 'hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${category.color} shadow-xs`}>
                    <Icon size={16} strokeWidth={2.5} />
                  </div>
                  <span className={`text-[15px] ${isSelected ? 'font-bold text-gray-900' : 'font-medium text-gray-700 group-hover:text-gray-900'}`}>
                    {category.name}
                  </span>
                </div>
                <ChevronRight 
                  size={16} 
                  className={`transition-transform ${isSelected ? 'text-gray-900 rotate-90' : 'text-transparent group-hover:text-gray-400'}`} 
                />
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

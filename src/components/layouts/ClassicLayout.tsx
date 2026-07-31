import React, { useState } from 'react';
import OmiiSidebar from '../OmiiSidebar';
import OmiiListingGrid from '../OmiiListingGrid';
import { Language } from '../../translations';

interface ClassicLayoutProps {
  viewMode: 'grid' | 'list' | 'pro';
  lang?: Language;
}

export default function ClassicLayout({ viewMode, lang = 'ro' }: ClassicLayoutProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSelectCategory = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="flex-1 w-full bg-gray-50 overflow-y-auto">
      {/* Centered Page Wrapper with generous left and right padding */}
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 lg:px-16 py-8 flex flex-col md:flex-row gap-8">
        <OmiiSidebar 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleSelectCategory} 
          lang={lang}
        />

        <main className="flex-1 min-w-0">
          <OmiiListingGrid selectedCategory={selectedCategory} viewMode={viewMode} lang={lang} />
        </main>
      </div>
    </div>
  );
}

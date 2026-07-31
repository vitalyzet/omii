import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, FilterX } from 'lucide-react';
import OmiiListingCard from './OmiiListingCard';
import OmiiListingClassicCard from './OmiiListingClassicCard';
import OmiiListingListCard from './OmiiListingListCard';
import OmiiListingProCard from './OmiiListingProCard';
import { TRANSLATIONS, Language } from '../translations';
import { subscribeToRealListings, OmiiListingItem } from '../services/firebaseListings';


// Smart diacritics & accent stripper
const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

interface OmiiListingGridProps {
  selectedCategory: string | null;
  viewMode?: 'grid' | 'list' | 'pro';
  lang?: Language;
  onSelectListing?: (listing: any) => void;
}

export default function OmiiListingGrid({ selectedCategory, viewMode = 'grid', lang = 'ro', onSelectListing }: OmiiListingGridProps) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.ro;
  const [searchQuery, setSearchQuery] = useState('');
  const [realListings, setRealListings] = useState<OmiiListingItem[]>([]);
  const [internalListings, setInternalListings] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('omii_internal_published_ads') || '[]');
    } catch {
      return [];
    }
  });

  // Automatically fetch and listen to real published ads from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToRealListings((newListings) => {
      setRealListings(newListings);
    });
    return () => unsubscribe();
  }, []);

  // Listen to new internal ad publish events
  useEffect(() => {
    const handleInternalAd = (e: any) => {
      if (e.detail) {
        setInternalListings(prev => [e.detail, ...prev]);
      }
    };
    window.addEventListener('omii:internal_ad_published', handleInternalAd);
    return () => window.removeEventListener('omii:internal_ad_published', handleInternalAd);
  }, []);

  const allListings = useMemo(() => {
    return [...internalListings, ...realListings];
  }, [internalListings, realListings]);

  // Category translation resolver
  const categoryDisplayName = useMemo(() => {
    if (!selectedCategory) return t.allListings;
    if (t[selectedCategory as keyof typeof t]) return t[selectedCategory as keyof typeof t] as string;
    return selectedCategory;
  }, [selectedCategory, t]);

  // Intelligent multi-word search algorithm & Category Filtering
  const filteredListings = useMemo(() => {
    // First filter by category if selected with smart key & accent-insensitive matching
    let baseListings = selectedCategory
      ? allListings.filter(listing => 
          listing.category === selectedCategory ||
          listing.category === categoryDisplayName ||
          normalizeText(listing.category) === normalizeText(selectedCategory) ||
          normalizeText(listing.category) === normalizeText(categoryDisplayName)
        )
      : allListings;

    if (!searchQuery.trim()) return baseListings;

    // Normalize search query into tokenized words
    const queryTokens = normalizeText(searchQuery).split(/\s+/).filter(Boolean);

    return baseListings.filter(listing => {
      // Build a unified searchable index string for each listing
      const titleNorm = normalizeText(listing.title);
      const subtitleNorm = normalizeText(listing.subtitle);
      const locationNorm = normalizeText(listing.location);
      const categoryNorm = normalizeText(listing.category);
      const priceNorm = normalizeText(listing.price);
      const tagsNorm = listing.tags ? listing.tags.map(normalizeText).join(' ') : '';

      const searchableText = `${titleNorm} ${subtitleNorm} ${locationNorm} ${categoryNorm} ${priceNorm} ${tagsNorm}`;

      // Intelligent matching: ALL search words entered by user MUST match somewhere in the listing's searchable text
      return queryTokens.every(token => searchableText.includes(token));
    });
  }, [selectedCategory, searchQuery, categoryDisplayName]);

  let wrapperClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5";
  if (viewMode === 'pro') {
    wrapperClass = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";
  } else if (viewMode === 'grid') {
    wrapperClass = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";
  } else if (viewMode === 'list') {
    wrapperClass = "flex flex-col space-y-3 max-w-4xl mx-auto";
  }

  return (
    <div className="space-y-6">
      {/* Intelligent Category Header & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              {categoryDisplayName}
            </h2>
            <span className="bg-[#eef7f5] text-[#0e7063] text-xs font-bold px-2.5 py-1 rounded-full border border-[#bce0da]">
              {filteredListings.length} {filteredListings.length === 1 ? 'anunț' : 'anunțuri'}
            </span>
          </div>

          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-[#108474] hover:text-[#0a5248] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <FilterX size={13} /> {t.resetSearch}
            </button>
          )}
        </div>

        {/* Intelligent Search Bar Input */}
        <div className="relative w-full">
          <Search size={19} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#108474]/20 focus:border-[#108474] transition-all shadow-2xs"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1 cursor-pointer rounded-full hover:bg-gray-200/60"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Listings */}
      <div className={wrapperClass}>
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => {
            return (
              <div 
                key={listing.id} 
                onClick={() => {
                  if (onSelectListing) {
                    onSelectListing(listing);
                  } else {
                    window.dispatchEvent(new CustomEvent('omii:select_listing', { detail: listing }));
                  }
                }}
                className="cursor-pointer"
              >
                {viewMode === 'grid' ? (
                  <OmiiListingClassicCard {...listing} />
                ) : viewMode === 'list' ? (
                  <OmiiListingListCard {...listing} />
                ) : viewMode === 'pro' ? (
                  <OmiiListingProCard {...listing} />
                ) : (
                  <OmiiListingCard {...listing} />
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-gray-200/80 p-8 shadow-xs">
            <Search size={44} className="mx-auto text-gray-300 mb-3 stroke-[1.5]" />
            <h3 className="text-lg font-extrabold text-gray-800 mb-1">Nu s-a găsit niciun rezultat pentru „{searchQuery}”</h3>
            <p className="text-gray-500 text-sm mb-4">
              Încearcă să cauți fără diacritice, cu mai puține cuvinte sau resetează căutarea.
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="bg-[#108474] hover:bg-[#0e7063] text-white font-extrabold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Șterge căutarea
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

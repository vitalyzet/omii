import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, FilterX } from 'lucide-react';
import OmiiListingCard from './OmiiListingCard';
import OmiiListingClassicCard from './OmiiListingClassicCard';
import OmiiListingListCard from './OmiiListingListCard';
import OmiiListingProCard from './OmiiListingProCard';
import { TRANSLATIONS, Language } from '../translations';
import { subscribeToRealListings, OmiiListingItem } from '../services/firebaseListings';

const MOCK_LISTINGS = [
  // Auto & Moto (Vindu24 Auto Catalog)
  { category: 'Auto & Moto', id: 'vh-v1', title: 'BMW M3 Competition xDrive 2023', subtitle: '510 CP, pachet Carbon, garanție de fabrică', price: '79.900 €', location: 'București, Nord', imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400', tags: ['auto', 'bmw', 'm3', 'competition', 'xdrive', 'masina', '2023'] },
  { category: 'Auto & Moto', id: 'vh-v2', title: 'Audi RS6 Avant Carbon Black 2022', subtitle: '600 CP V8 BiTurbo, suspensie pneumatică', price: '115.000 €', location: 'Cluj-Napoca, Centru', imageUrl: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=400', tags: ['auto', 'audi', 'rs6', 'avant', 'v8', 'masina', '2022'] },
  { category: 'Auto & Moto', id: 'vh-v3', title: 'Porsche 911 Carrera S (992) 2021', subtitle: '450 CP, Sport Chrono, evacuare sport', price: '128.500 €', location: 'Timișoara, Iosefin', imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400', tags: ['auto', 'porsche', '911', 'carrera', 'sport', '2021'] },
  { category: 'Auto & Moto', id: 'vh-v4', title: 'Mercedes-AMG G 63 V8 Biturbo 2022', subtitle: 'Pachet Night, interior piele Nappa', price: '189.000 €', location: 'Brașov, Poiana Brașov', imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&q=80&w=400', tags: ['auto', 'mercedes', 'amg', 'g63', 'g-class', 'suv'] },
  { category: 'Auto & Moto', id: 'vh1', title: 'Toyota Yaris 1.5 Hybrid 2021', subtitle: 'Stare impecabilă, unic proprietar', price: '14.500 €', location: 'București, Sector 3', imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=400', tags: ['auto', 'car', 'coche', 'masina', 'toyota', 'yaris', 'hybrid', '2021'] },
  { category: 'Auto & Moto', id: 'vh2', title: 'Kia Sportage 1.6 T-GDI 2022', subtitle: 'Full option, plafon panoramic', price: '24.900 €', location: 'Cluj-Napoca, Gheorgheni', imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400', tags: ['auto', 'car', 'coche', 'masina', 'kia', 'sportage', 'suv', '2022'] },
  { category: 'Auto & Moto', id: 'vh3', title: 'Hyundai Tucson 2.0 CRDi 2020', subtitle: 'Revizii efectuate la reprezentanță', price: '19.800 €', location: 'Sibiu, Centru', imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400', tags: ['auto', 'car', 'coche', 'masina', 'hyundai', 'tucson', 'diesel', '2020'] },
  { category: 'Auto & Moto', id: 'vh4', title: 'Honda CBR 500R 2021', subtitle: 'Motocicletă sport, stare ca nouă', price: '6.200 €', location: 'Brașov, Tractorul', imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400', tags: ['moto', 'motocicleta', 'honda', 'cbr', '2021', 'bike'] },
  { category: 'Auto & Moto', id: 'vh5', title: 'Volkswagen Golf VIII GTI 2022', subtitle: 'Hatchback sport, 245 CP', price: '28.500 €', location: 'Timișoara, Iosefin', imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400', tags: ['auto', 'vw', 'volkswagen', 'golf', 'gti', '2022', 'masina'] },

  // Imobiliare (Vindu24 Real Estate Catalog)
  { category: 'Imobiliare', id: 'in-v1', title: 'Penthouse 4 Camere Duplex Herăstrău', subtitle: 'Terasă panoramică 140 mp, 3 locuri parcare', price: '420.000 €', location: 'București, Herăstrău', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400', tags: ['penthouse', 'duplex', 'apartament', 'lux', 'herastrau', 'bucuresti'] },
  { category: 'Imobiliare', id: 'in-v2', title: 'Vilă Individuală cu Piscină & Grădină', subtitle: 'Teren 750 mp, smart home complet', price: '310.000 €', location: 'Cluj-Napoca, Borhanci', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400', tags: ['vila', 'casa', 'piscina', 'gradina', 'cluj'] },
  { category: 'Imobiliare', id: 'in-v3', title: 'Apartament 2 Camere Lux Pipera Lake', subtitle: 'Vedere spre lac, complet mobilat ultramodern', price: '118.000 €', location: 'București, Pipera', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=400', tags: ['apartament', 'pipera', 'lac', '2 camere', 'bucuresti'] },
  { category: 'Imobiliare', id: 'in1', title: 'Apartament 3 Camere Decomandat', subtitle: 'Vedere spre parc, bloc nou 2023', price: '145.000 €', location: 'București, Herăstrău', imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400', tags: ['apartament', 'piso', 'casa', 'inmobiliar', 'bucuresti', '3 camere'] },
  { category: 'Imobiliare', id: 'in2', title: 'Casă Individuală cu Piscină', subtitle: 'Teren 600 mp, finisaje premium', price: '280.000 €', location: 'Cluj-Napoca, Borhanci', imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=400', tags: ['casa', 'vila', 'piscina', 'teren', 'cluj'] },
  { category: 'Imobiliare', id: 'in3', title: 'Birou Modern Clasa A', subtitle: 'Spațiu comercial mobilat 120 mp', price: '1.500 €/lună', location: 'Timișoara, Openville', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400', tags: ['birou', 'oficina', 'spatiu', 'comercial', 'timisoara'] },
  { category: 'Imobiliare', id: 'in4', title: 'Teren Intravilan Poiana Brașov', subtitle: 'Ideal construcție cabană/pensiune', price: '95.000 €', location: 'Poiana Brașov', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400', tags: ['teren', 'parcela', 'brasov', 'cabana', 'intravilan'] },

  // Locuri de muncă (Vindu24 Jobs Catalog)
  { category: 'Locuri de muncă', id: 'em-v1', title: 'Lead DevOps Engineer (Kubernetes & AWS)', subtitle: 'Full-Time Remote, buget salarial premium', price: '4.800 €/lună', location: 'București (Remote)', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400', tags: ['job', 'devops', 'aws', 'kubernetes', 'remote', 'it'] },
  { category: 'Locuri de muncă', id: 'em1', title: 'Senior Frontend Developer (React)', subtitle: 'Full-time Remote, pachet salarial atractiv', price: '3.500 €/lună', location: 'București (Remote)', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400', tags: ['job', 'empleo', 'munca', 'developer', 'react', 'frontend', 'remote'] },
  { category: 'Locuri de muncă', id: 'em2', title: 'Contabil Senior cu Experiență', subtitle: 'Program hibrid, birou modern', price: '1.600 €/lună', location: 'Cluj-Napoca, Centru', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400', tags: ['contabil', 'finante', 'job', 'cluj'] },

  // Bazar & Cumpărături
  { category: 'Bazar & Cumpărături', id: 'cv-v1', title: 'iPhone 15 Pro Max 256GB Natural Titanium', subtitle: 'Nou în cutie sigilată, garanție Apple 2 ani', price: '1.180 €', location: 'București, Sector 1', imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=400', tags: ['iphone', 'iphone15', 'apple', 'pro max', 'mobile'] },
  { category: 'Bazar & Cumpărături', id: 'cv1', title: 'iPhone 13 Pro Max 256GB', subtitle: 'Smartphone în stare excelentă, baterie 88%', price: '750 €', location: 'București, Sector 1', imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400', tags: ['apple', 'iphone', 'telefon', 'smartphone', 'mobile', 'celular'] },
  { category: 'Bazar & Cumpărături', id: 'cv2', title: 'MacBook Air M1 16GB RAM', subtitle: 'Laptop ultra ușor și rapid, garanție', price: '950 €', location: 'Cluj-Napoca, Centru', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400', tags: ['laptop', 'macbook', 'apple', 'computer', 'pc'] },
  { category: 'Bazar & Cumpărături', id: 'cv3', title: 'PlayStation 5 Disc Edition', subtitle: 'Consolă cu 2 controllere DualSense', price: '450 €', location: 'Timișoara, Kompleks', imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=400', tags: ['ps5', 'playstation', 'consola', 'jocuri', 'gaming'] },

  // Afaceri & Firme
  { category: 'Afaceri & Firme', id: 'ng1', title: 'Cazare Pensiune Turistică Gata de Funcționare', subtitle: '12 camere mobilate, restaurant', price: '320.000 €', location: 'Brașov, Bran', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400', tags: ['pensiune', 'hotel', 'turism', 'afacere', 'brasov'] },
  { category: 'Afaceri & Firme', id: 'ng2', title: 'Afacere Magazin Online E-Commerce', subtitle: 'Stoc produse inclus, cifră afaceri stabilă', price: '45.000 €', location: 'București, Sector 2', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400', tags: ['magazin', 'online', 'ecommerce', 'bucuresti'] },

  // Servicii
  { category: 'Servicii', id: 'sv1', title: 'Servicii Proiectare & Cadastru', subtitle: 'Autorizații de construire, intabulări', price: '150 €', location: 'București, Sector 4', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=400', tags: ['proiectare', 'cadastru', 'servicii', 'arhitect'] },
  { category: 'Servicii', id: 'sv2', title: 'Masaj Terapeutic & Kinetoterapie', subtitle: 'La cabinet sau la domiciliu', price: '30 €/oră', location: 'Cluj-Napoca, Mănăștur', imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=400', tags: ['masaj', 'kineto', 'sanatate', 'cluj'] },

  // Cursuri & Instruire
  { category: 'Cursuri & Instruire', id: 'fr1', title: 'Meditații Matematică Gimnaziu & Liceu', subtitle: 'Pregătire Evaluare Națională și Bacalaureat', price: '20 €/oră', location: 'București, Sector 5', imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=400', tags: ['meditatii', 'clase', 'curs', 'matematica'] },

  // Timp liber
  { category: 'Timp liber', id: 'oc1', title: 'Bilete VIP Concert Rock în Aer Liber', subtitle: 'Acces front stage + băutură inclusă', price: '120 €', location: 'București, Arena Națională', imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400', tags: ['bilete', 'concert', 'rock', 'ocio'] },
  { category: 'Timp liber', id: 'oc2', title: 'Închiriere Teren Fotbal Sintetic', subtitle: 'Nocturnă inclusă, vestiare moderne', price: '40 €/oră', location: 'Cluj-Napoca, Zorilor', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400', tags: ['fotbal', 'sport', 'teren', 'cluj'] },
];

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
    return [...internalListings, ...realListings, ...MOCK_LISTINGS];
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
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
              {filteredListings.length} {filteredListings.length === 1 ? 'anunț' : 'anunțuri'}
            </span>
          </div>

          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
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
            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
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

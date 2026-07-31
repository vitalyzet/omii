import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Euro, 
  MapPin, 
  Upload, 
  Check
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Language } from '../translations';

interface OmiiPublishAdPageProps {
  onBackToHome: () => void;
  lang?: Language;
}

const CATEGORIES = [
  { 
    id: 'Bazar & Cumpărături', 
    nameRo: 'Bazar & Cumpărături', 
    nameEs: 'Compraventa', 
    color: 'bg-[#7B3FF2]',
    subcategories: [
      { nameRo: 'Telefoane & Tablete', nameEs: 'Teléfonos y Tabletas' },
      { nameRo: 'Laptopuri & Calculatoare', nameEs: 'Portátiles y PC' },
      { nameRo: 'Jocuri & Console', nameEs: 'Juegos y Consolas' },
      { nameRo: 'Electrocasnice', nameEs: 'Electrodomésticos' },
      { nameRo: 'Modă & Accesorii', nameEs: 'Moda y Accesorios' }
    ]
  },
  { 
    id: 'Auto & Moto', 
    nameRo: 'Auto & Moto', 
    nameEs: 'Vehículos', 
    color: 'bg-[#E14937]', 
    collection: 'anuncios_auto',
    subcategories: [
      { nameRo: 'Autoturisme', nameEs: 'Autos' },
      { nameRo: 'Motociclete', nameEs: 'Motos' },
      { nameRo: 'Utilitare & Camioane', nameEs: 'Furgonetas y Camiones' },
      { nameRo: 'Piese Auto & Accesorii', nameEs: 'Recambios y Accesorios' }
    ]
  },
  { 
    id: 'Imobiliare', 
    nameRo: 'Imobiliare', 
    nameEs: 'Inmuebles', 
    color: 'bg-[#7CB342]', 
    collection: 'anuncios',
    subcategories: [
      { nameRo: 'Apartamente', nameEs: 'Pisos' },
      { nameRo: 'Case & Vile', nameEs: 'Casas y Chalets' },
      { nameRo: 'Terenuri', nameEs: 'Terrenos' },
      { nameRo: 'Birouri & Spații', nameEs: 'Oficinas y Locales' }
    ]
  },
  { 
    id: 'Locuri de muncă', 
    nameRo: 'Locuri de muncă', 
    nameEs: 'Empleo', 
    color: 'bg-[#5C4A6B]', 
    collection: 'anuncios',
    subcategories: [
      { nameRo: 'IT & Programare', nameEs: 'Informática y Tecnología' },
      { nameRo: 'Vânzări & Comercial', nameEs: 'Comercial y Ventas' },
      { nameRo: 'Finanțe & Contabilitate', nameEs: 'Finanzas y Contabilidad' },
      { nameRo: 'Transport & Logistică', nameEs: 'Transporte y Logística' }
    ]
  },
  { 
    id: 'Afaceri & Firme', 
    nameRo: 'Afaceri & Firme', 
    nameEs: 'Negocios', 
    color: 'bg-[#C36437]', 
    collection: 'anuncios',
    subcategories: [
      { nameRo: 'Preluare Afaceri', nameEs: 'Traspasos' },
      { nameRo: 'E-Commerce & Online', nameEs: 'Tiendas Online' },
      { nameRo: 'Horeca & Turism', nameEs: 'Hostelería' }
    ]
  },
  { 
    id: 'Servicii', 
    nameRo: 'Servicii', 
    nameEs: 'Servicios', 
    color: 'bg-[#00A3E0]', 
    collection: 'anuncios',
    subcategories: [
      { nameRo: 'Construcții & Amenajări', nameEs: 'Reformas y Obras' },
      { nameRo: 'Servicii Auto & Tractări', nameEs: 'Servicios de Mecánica' },
      { nameRo: 'Sănătate & Frumusețe', nameEs: 'Salud y Belleza' }
    ]
  },
  { 
    id: 'Cursuri & Instruire', 
    nameRo: 'Cursuri & Instruire', 
    nameEs: 'Formación', 
    color: 'bg-[#FF5376]', 
    collection: 'anuncios',
    subcategories: [
      { nameRo: 'Meditații & Lecții', nameEs: 'Clases Particulares' },
      { nameRo: 'Cursuri Limbi Străine', nameEs: 'Cursos de Idiomas' }
    ]
  },
  { 
    id: 'Timp liber', 
    nameRo: 'Timp liber', 
    nameEs: 'Ocio', 
    color: 'bg-[#E6B800]', 
    collection: 'anuncios',
    subcategories: [
      { nameRo: 'Bilete Evenimente', nameEs: 'Entradas y Eventos' },
      { nameRo: 'Sport & Agrement', nameEs: 'Deportes' }
    ]
  },
];

const ROMANIAN_CITIES = [
  'București', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov', 
  'Constanța', 'Craiova', 'Sibiu', 'Galați', 'Oradea', 'Ploiești', 'Arad'
];

export default function OmiiPublishAdPage({ onBackToHome, lang = 'ro' }: OmiiPublishAdPageProps) {
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [expandedCatId, setExpandedCatId] = useState<string | null>('Auto & Moto');
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  
  // Basic Form Fields
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('București');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Auto Specific Fields
  const [marca, setMarca] = useState('');
  const [model, setModel] = useState('');
  const [an, setAn] = useState(new Date().getFullYear().toString());
  const [combustibil, setCombustibil] = useState('Benzină');

  // Real Estate Specific Fields
  const [operation, setOperation] = useState('vanzare');
  const [propertyType, setPropertyType] = useState('apartament');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedCategoryObj = CATEGORIES.find(c => c.id === selectedCatId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error(lang === 'ro' ? 'Te rugăm să introduci un titlu.' : 'Ingresa un título.');
      }
      if (!price || isNaN(Number(price))) {
        throw new Error(lang === 'ro' ? 'Te rugăm să introduci un preț valid.' : 'Ingresa un precio válido.');
      }

      const targetCategory = selectedCatId || 'Bazar & Cumpărături';
      const targetCollection = selectedCategoryObj?.collection || 'anuncios';

      const finalImageUrl = imageUrl.trim() || 
        (targetCategory === 'Auto & Moto' 
          ? 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400'
          : targetCategory === 'Imobiliare'
          ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'
          : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400');

      const user = auth.currentUser;

      const adData: any = {
        title: title.trim(),
        price: Number(price),
        category: targetCategory,
        subcat: selectedSubcat,
        location,
        description: description.trim(),
        images: [finalImageUrl],
        imageUrl: finalImageUrl,
        status: 'active',
        createdAt: serverTimestamp(),
        userId: user ? user.uid : 'guest',
        userEmail: user ? user.email : 'guest@omii.ro',
        userName: user ? (user.displayName || user.email?.split('@')[0]) : 'Utilizator Omii'
      };

      if (targetCategory === 'Auto & Moto') {
        adData.marca = marca || title.split(' ')[0];
        adData.model = model || title.split(' ').slice(1).join(' ');
        adData.an = Number(an) || 2022;
        adData.combustibil = combustibil;
        adData.domain = 'auto';
      } else if (targetCategory === 'Imobiliare') {
        adData.type = propertyType;
        adData.operation = operation;
        adData.domain = 'realestate';
      }

      // Create Internal Local Ad Object
      const internalAd = {
        id: `int-${Date.now()}`,
        category: targetCategory,
        title: title.trim(),
        subtitle: description.trim() || `${targetCategory} - Publicat pe Omii`,
        price: `${new Intl.NumberFormat('ro-RO').format(Number(price))} €`,
        location,
        imageUrl: finalImageUrl,
        tags: [targetCategory.toLowerCase(), location.toLowerCase(), 'intern', 'anunt'],
        isInternal: true,
        createdAt: new Date().toISOString()
      };

      // 1. Save to Local Internal Storage
      const existingInternal = JSON.parse(localStorage.getItem('omii_internal_published_ads') || '[]');
      const updatedInternal = [internalAd, ...existingInternal];
      localStorage.setItem('omii_internal_published_ads', JSON.stringify(updatedInternal));

      // 2. Dispatch custom event
      window.dispatchEvent(new CustomEvent('omii:internal_ad_published', { detail: internalAd }));

      // 3. Save to Firestore
      try {
        await addDoc(collection(db, targetCollection), adData);
      } catch (firestoreErr) {
        console.warn("Firestore save warning (ad saved locally):", firestoreErr);
      }

      setSuccess(true);
      setTimeout(() => {
        onBackToHome();
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'A apărut o eroare la salvarea anunțului.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] font-sans pb-16">
      
      {/* Top Header Bar: 0 Créditos / 0 Karma */}
      <div className="bg-white border-b border-gray-100 py-2.5 px-4 flex items-center justify-center gap-8 text-xs font-medium text-[#5054B4]">
        <div className="flex items-center gap-2">
          <img src="/credits.png" alt="Créditos" className="w-5 h-5 object-contain" />
          <span className="font-semibold text-gray-700">0 {lang === 'ro' ? 'Credite' : 'Créditos'}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="/karma.png" alt="Karma" className="w-5 h-5 object-contain" />
          <span className="font-semibold text-gray-700">0 Karma</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 pt-8">
        
        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{lang === 'ro' ? 'Înapoi la pagina principală' : 'Volver a la página principal'}</span>
        </button>

        {/* Section Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#005944] tracking-tight mb-6">
          {lang === 'ro' ? 'Selectează categoria' : 'Selecciona categoría'}
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Categories List */}
          <div className="md:col-span-5 bg-white rounded-2xl p-2 sm:p-3 shadow-xs border border-gray-100 space-y-1">
            {CATEGORIES.map((cat) => {
              const isExpanded = expandedCatId === cat.id;
              const isSelected = selectedCatId === cat.id;
              const displayName = lang === 'es' ? cat.nameEs : cat.nameRo;

              return (
                <div key={cat.id} className="space-y-1">
                  {/* Category Main Row */}
                  <div
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedCatId(null);
                      } else {
                        setExpandedCatId(cat.id);
                      }
                      setSelectedCatId(cat.id);
                      setError(null);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group ${
                      isSelected || isExpanded
                        ? 'bg-indigo-50/70 shadow-2xs font-bold' 
                        : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full ${cat.color} text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                        {isExpanded ? (
                          <ChevronDown size={16} strokeWidth={2.5} />
                        ) : (
                          <ChevronRight size={16} strokeWidth={2.5} />
                        )}
                      </div>
                      <span className={`text-sm sm:text-base font-semibold ${isSelected || isExpanded ? 'text-[#3E42A5] font-bold' : 'text-[#5054B4] hover:text-[#3E42A5]'}`}>
                        {displayName}
                      </span>
                    </div>
                  </div>

                  {/* Subcategories Indented List */}
                  {isExpanded && cat.subcategories && (
                    <div className="pl-11 pr-3 py-1 space-y-2 animate-fade-in">
                      {cat.subcategories.map((subcat, idx) => {
                        const subcatName = lang === 'es' ? subcat.nameEs : subcat.nameRo;
                        const isSubSelected = selectedSubcat === subcatName && selectedCatId === cat.id;

                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedCatId(cat.id);
                              setSelectedSubcat(subcatName);
                              setError(null);
                            }}
                            className={`text-sm font-semibold transition-all cursor-pointer py-1 ${
                              isSubSelected 
                                ? 'text-[#3E42A5] font-extrabold underline' 
                                : 'text-[#5054B4] hover:text-[#3E42A5] hover:underline'
                            }`}
                          >
                            {subcatName}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Chameleon Illustration & Rules OR Selected Category Form */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100 min-h-[420px] flex flex-col justify-center">
            
            {!selectedCatId ? (
              /* State 1: Chameleon Illustration and Publish Rules Button */
              <div className="text-center py-6 space-y-5 flex flex-col items-center justify-center">
                <img 
                  src="/chameleon112.png" 
                  alt="Mascot Chameleon" 
                  className="w-48 sm:w-56 h-auto object-contain mx-auto drop-shadow-xs"
                />
                
                <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
                  {lang === 'ro' 
                    ? 'Dacă vrei să afli ce anunțuri nu sunt permise, poți verifică regulile noastre' 
                    : 'Si quieres conocer qué anuncios no están permitidos puedes'}
                </p>

                <button 
                  type="button"
                  onClick={() => alert(lang === 'ro' ? 'Reguli de publicare: Anunțurile trebuie să respecte legislația în vigoare.' : 'Reglas de publicación: Los anuncios deben cumplir con la ley vigente.')}
                  className="px-6 py-2.5 bg-[#5B6BBF] hover:bg-[#4C5CAE] active:scale-[0.99] text-white font-semibold text-sm rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  {lang === 'ro' ? 'Vezi regulile de publicare' : 'Ver las reglas de publicación'}
                </button>
              </div>
            ) : (
              /* State 2: Selected Category Form */
              <div>
                {success ? (
                  <div className="py-8 text-center space-y-4 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">
                      {lang === 'ro' ? 'Anunț Publicat cu Succes!' : '¡Anuncio Publicado con Éxito!'}
                    </h2>
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">
                      {lang === 'ro' 
                        ? 'Anunțul tău a fost salvat și este acum vizibil în prima poziție pe Omii.' 
                        : 'Tu anuncio ha sido guardado y ya es visible en la primera posición en Omii.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${selectedCategoryObj?.color} text-white flex items-center justify-center`}>
                          <ChevronRight size={14} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-lg font-extrabold text-[#005944]">
                          {lang === 'es' ? selectedCategoryObj?.nameEs : selectedCategoryObj?.nameRo}
                        </h2>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setSelectedCatId(null)}
                        className="text-xs font-bold text-[#5054B4] hover:underline cursor-pointer"
                      >
                        {lang === 'ro' ? 'Schimbă categoria' : 'Cambiar categoría'}
                      </button>
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-700 border border-red-200/80 p-3 rounded-xl text-xs font-bold flex items-center gap-2.5">
                        <AlertCircle size={16} className="shrink-0 text-red-500" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Title Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'ro' ? 'Titlul Anunțului *' : 'Título del Anuncio *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={
                          selectedCatId === 'Auto & Moto' 
                            ? 'ex. BMW 320d GT xDrive 2020 M-Sport' 
                            : selectedCatId === 'Imobiliare'
                            ? 'ex. Apartament 3 Camere Decomandat Herăstrău'
                            : 'ex. Titlu clar și reprezentativ'
                        }
                        className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>

                    {/* Auto Specific Fields */}
                    {selectedCatId === 'Auto & Moto' && (
                      <div className="grid grid-cols-2 gap-3 bg-red-50/40 p-3 rounded-xl border border-red-100">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700">Marcă</label>
                          <input 
                            type="text"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            placeholder="ex. BMW"
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700">Model</label>
                          <input 
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="ex. Seria 3"
                            className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                          />
                        </div>
                      </div>
                    )}

                    {/* Price and Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                          {lang === 'ro' ? 'Preț (€ Euro) *' : 'Precio (€ Euro) *'}
                        </label>
                        <div className="relative">
                          <Euro size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="ex. 14500"
                            className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">
                          {lang === 'ro' ? 'Oraș / Județ *' : 'Ciudad / Ubicación *'}
                        </label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                          >
                            {ROMANIAN_CITIES.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'ro' ? 'Link Imagine / Foto (URL)' : 'URL de la Imagen'}
                      </label>
                      <div className="relative">
                        <Upload size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'ro' ? 'Descriere Detaliată' : 'Descripción Detallada'}
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={lang === 'ro' ? 'Descrie starea produsului sau detalii de contact...' : 'Describe el estado o información de contacto...'}
                        className="w-full p-3 bg-gray-50/70 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[#5B6BBF] hover:bg-[#4C5CAE] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {loading ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <>
                            <Check size={18} />
                            <span>{lang === 'ro' ? 'Publică Anunțul Acum' : 'Publicar Anuncio Ahora'}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

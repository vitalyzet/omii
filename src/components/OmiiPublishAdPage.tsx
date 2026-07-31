import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CarFront, 
  Building2, 
  Briefcase, 
  ShoppingBag, 
  Store, 
  Wrench, 
  GraduationCap, 
  Coffee, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Euro, 
  MapPin, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
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
  { id: 'Auto & Moto', name: 'Auto & Moto', icon: CarFront, color: 'bg-red-500', collection: 'anuncios_auto' },
  { id: 'Imobiliare', name: 'Imobiliare', icon: Building2, color: 'bg-emerald-500', collection: 'anuncios' },
  { id: 'Locuri de muncă', name: 'Locuri de muncă', icon: Briefcase, color: 'bg-purple-500', collection: 'anuncios' },
  { id: 'Bazar & Cumpărături', name: 'Bazar & Cumpărături', icon: ShoppingBag, color: 'bg-indigo-500', collection: 'anuncios' },
  { id: 'Afaceri & Firme', name: 'Afaceri & Firme', icon: Store, color: 'bg-orange-500', collection: 'anuncios' },
  { id: 'Servicii', name: 'Servicii', icon: Wrench, color: 'bg-blue-500', collection: 'anuncios' },
  { id: 'Cursuri & Instruire', name: 'Cursuri & Instruire', icon: GraduationCap, color: 'bg-pink-500', collection: 'anuncios' },
  { id: 'Timp liber', name: 'Timp liber', icon: Coffee, color: 'bg-yellow-500', collection: 'anuncios' },
];

const ROMANIAN_CITIES = [
  'București', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov', 
  'Constanța', 'Craiova', 'Sibiu', 'Galați', 'Oradea', 'Ploiești', 'Arad'
];

export default function OmiiPublishAdPage({ onBackToHome, lang = 'ro' }: OmiiPublishAdPageProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [category, setCategory] = useState<string>('Auto & Moto');
  
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
  const [rooms, setRooms] = useState('2');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

      const selectedCatObj = CATEGORIES.find(c => c.id === category);
      const targetCollection = selectedCatObj ? selectedCatObj.collection : 'anuncios';

      const finalImageUrl = imageUrl.trim() || 
        (category === 'Auto & Moto' 
          ? 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400'
          : category === 'Imobiliare'
          ? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400'
          : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=400');

      const user = auth.currentUser;

      const adData: any = {
        title: title.trim(),
        price: Number(price),
        category,
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

      if (category === 'Auto & Moto') {
        adData.marca = marca || title.split(' ')[0];
        adData.model = model || title.split(' ').slice(1).join(' ');
        adData.an = Number(an) || 2022;
        adData.combustibil = combustibil;
        adData.domain = 'auto';
      } else if (category === 'Imobiliare') {
        adData.type = propertyType;
        adData.operation = operation;
        adData.rooms = rooms;
        adData.domain = 'realestate';
      }

      // Create Internal Local Ad Object
      const internalAd = {
        id: `int-${Date.now()}`,
        category,
        title: title.trim(),
        subtitle: description.trim() || `${category} - Publicat pe Omii`,
        price: `${new Intl.NumberFormat('ro-RO').format(Number(price))} €`,
        location,
        imageUrl: finalImageUrl,
        tags: [category.toLowerCase(), location.toLowerCase(), 'intern', 'anunt'],
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
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 max-w-4xl mx-auto font-sans">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full font-extrabold text-xs border border-gray-200/80 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>{lang === 'ro' ? 'Înapoi la pagina principală' : 'Volver al inicio'}</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-extrabold text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100/80">
          <Sparkles size={14} className="text-blue-600" />
          <span>Omii Ad Publisher</span>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden space-y-0">
        
        {/* Soft Elegant Header Banner */}
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/40 to-slate-50 border-b border-gray-100 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {lang === 'ro' ? 'Publică un Anunț Nou pe Omii' : 'Publicar un Nuevo Anuncio en Omii'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            {lang === 'ro' 
              ? 'Completează formularul și anunțul tău va fi vizibil instantaneu.' 
              : 'Completa el formulario y tu anuncio será visible al instante.'}
          </p>

          {/* Progress Step Pills */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                step === 1 
                  ? 'bg-blue-600 text-white shadow-2xs font-extrabold' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>{lang === 'ro' ? 'Pasul 1: Categorie' : 'Paso 1: Categoría'}</span>
            </button>

            <span className="text-gray-300">→</span>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                step === 2 
                  ? 'bg-blue-600 text-white shadow-2xs font-extrabold' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>{lang === 'ro' ? 'Pasul 2: Detalii Anunț' : 'Paso 2: Detalles'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
            {success ? (
              <div className="py-12 text-center space-y-4 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900">
                  {lang === 'ro' ? 'Anunț Publicat cu Succes!' : '¡Anuncio Publicado con Éxito!'}
                </h2>
                <p className="text-base text-gray-500 max-w-md mx-auto">
                  {lang === 'ro' 
                    ? 'Anunțul tău a fost salvat și este acum vizibil în prima poziție pe Omii.' 
                    : 'Tu anuncio ha sido guardado y ya es visible en la primera posición en Omii.'}
                </p>
              </div>
            ) : (
              <div>
                {error && (
                  <div className="mb-6 bg-red-50 text-red-700 border border-red-200/80 p-4 rounded-2xl text-xs font-bold flex items-center gap-3">
                    <AlertCircle size={18} className="shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* STEP 1: Select Category */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900">
                        {lang === 'ro' ? 'Alege categoria în care se încadrează anunțul:' : 'Elige la categoría de tu anuncio:'}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {lang === 'ro' ? 'Selectează una dintre categoriile de mai jos pentru a continua.' : 'Selecciona una categoría para continuar.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;

                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all cursor-pointer gap-3 text-center ${
                              isSelected
                                ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-md scale-[1.02]'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50/60 hover:bg-gray-100/70'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-2xl ${cat.color} text-white flex items-center justify-center shadow-sm`}>
                              <Icon size={24} />
                            </div>
                            <span className="text-xs font-black text-gray-900 leading-tight">
                              {cat.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
                      >
                        <span>{lang === 'ro' ? 'Mergi la Pasul 2' : 'Ir al Paso 2'}</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Fill Details Form */}
                {step === 2 && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Categorie Selectată:</span>
                        <h3 className="text-base font-black text-gray-900 flex items-center gap-2 mt-0.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                          <span>{category}</span>
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        {lang === 'ro' ? 'Schimbă Categoria' : 'Cambiar Categoría'}
                      </button>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'ro' ? 'Titlul Anunțului *' : 'Título del Anuncio *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={
                          category === 'Auto & Moto' 
                            ? 'ex. BMW 320d GT xDrive 2020 M-Sport' 
                            : category === 'Imobiliare'
                            ? 'ex. Apartament 3 Camere Decomandat Herăstrău Bloc Nou'
                            : 'ex. Titlu clar și atractiv pentru cumpărători'
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>

                    {/* Auto Specific Fields */}
                    {category === 'Auto & Moto' && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-red-50/40 p-4 rounded-2xl border border-red-100">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Marcă</label>
                          <input 
                            type="text"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            placeholder="ex. BMW"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Model</label>
                          <input 
                            type="text"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            placeholder="ex. Seria 3"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">An Fabricație</label>
                          <input 
                            type="number"
                            value={an}
                            onChange={(e) => setAn(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-700">Combustibil</label>
                          <select 
                            value={combustibil}
                            onChange={(e) => setCombustibil(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                          >
                            <option value="Benzină">Benzină</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Hibrid">Hibrid</option>
                            <option value="Electric">Electric</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Price and Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          {lang === 'ro' ? 'Preț (€ Euro) *' : 'Precio (€ Euro) *'}
                        </label>
                        <div className="relative">
                          <Euro size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="ex. 14500"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">
                          {lang === 'ro' ? 'Oraș / Județ *' : 'Ciudad / Ubicación *'}
                        </label>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                          >
                            {ROMANIAN_CITIES.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Image URL Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'ro' ? 'Link Imagine / Foto (URL)' : 'URL de la Imagen'}
                      </label>
                      <div className="relative">
                        <Upload size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'ro' ? 'Descriere Detaliată' : 'Descripción Detallada'}
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={lang === 'ro' ? 'Descrie starea produsului, opțiunile, motivele vânzării sau detalii de contact...' : 'Describe el estado, detalles o información de contacto...'}
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-5 py-3 text-xs font-extrabold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                      >
                        {lang === 'ro' ? 'Înapoi la Pasul 1' : 'Volver al Paso 1'}
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-lg flex items-center gap-2.5 disabled:opacity-70"
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
  );
}

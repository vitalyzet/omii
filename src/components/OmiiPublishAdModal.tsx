import React, { useState } from 'react';
import { 
  X, 
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
  FileText, 
  Tag,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Language } from '../translations';

interface OmiiPublishAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

const CATEGORIES = [
  { id: 'Auto & Moto', name: 'Auto & Moto', icon: CarFront, color: 'bg-red-500', collection: 'anuncios_auto' },
  { id: 'Imobiliare', name: 'Imobiliare', icon: Building2, color: 'bg-[#008060]', collection: 'anuncios' },
  { id: 'Locuri de muncă', name: 'Locuri de muncă', icon: Briefcase, color: 'bg-purple-500', collection: 'anuncios' },
  { id: 'Bazar & Cumpărături', name: 'Bazar & Cumpărături', icon: ShoppingBag, color: 'bg-[#108474]', collection: 'anuncios' },
  { id: 'Afaceri & Firme', name: 'Afaceri & Firme', icon: Store, color: 'bg-[#fff6ef]0', collection: 'anuncios' },
  { id: 'Servicii', name: 'Servicii', icon: Wrench, color: 'bg-[#eef7f5]0', collection: 'anuncios' },
  { id: 'Cursuri & Instruire', name: 'Cursuri & Instruire', icon: GraduationCap, color: 'bg-pink-500', collection: 'anuncios' },
  { id: 'Timp liber', name: 'Timp liber', icon: Coffee, color: 'bg-yellow-500', collection: 'anuncios' },
];

const ROMANIAN_CITIES = [
  'București', 'Cluj-Napoca', 'Timișoara', 'Iași', 'Brașov', 
  'Constanța', 'Craiova', 'Sibiu', 'Galați', 'Oradea', 'Ploiești', 'Arad'
];

export default function OmiiPublishAdModal({
  isOpen,
  onClose,
  lang = 'ro'
}: OmiiPublishAdModalProps) {
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

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setTitle('');
    setPrice('');
    setLocation('București');
    setDescription('');
    setImageUrl('');
    setMarca('');
    setModel('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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

      // Create Internal Ad Object
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

      // 2. Dispatch custom event so grid updates instantly
      window.dispatchEvent(new CustomEvent('omii:internal_ad_published', { detail: internalAd }));

      // 3. Save to Firestore in background
      try {
        await addDoc(collection(db, targetCollection), adData);
      } catch (firestoreErr) {
        console.warn("Firestore save warning (ad saved locally):", firestoreErr);
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1200);

    } catch (err: any) {
      setError(err.message || 'A apărut o eroare la salvarea anunțului.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-indigo-950 text-white p-5 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {lang === 'ro' ? 'Publică un Anunț Nou' : 'Publicar un Nuevo Anuncio'}
              </h2>
              <p className="text-xs text-[#bce0da]">
                {step === 1 
                  ? (lang === 'ro' ? 'Pasul 1: Alege categoria anunțului' : 'Paso 1: Elige la categoría')
                  : (lang === 'ro' ? 'Pasul 2: Completează detaliile anunțului' : 'Paso 2: Completa los detalles')}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Overlay */}
        {success ? (
          <div className="p-12 text-center space-y-4 flex flex-col items-center justify-center flex-1">
            <div className="w-16 h-16 rounded-full bg-[#b3d9cf] text-[#00664d] flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">
              {lang === 'ro' ? 'Anunț Publicat cu Succes!' : '¡Anuncio Publicado con Éxito!'}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              {lang === 'ro' 
                ? 'Anunțul tău a fost salvat și este acum vizibil în timp real pe Omii.' 
                : 'Tu anuncio ha sido guardado y ya es visible en tiempo real en Omii.'}
            </p>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex-1 space-y-5">

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200/80 p-3 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Select Category */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800">
                  {lang === 'ro' ? 'Selectează categoria potrivită:' : 'Selecciona la categoría:'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategory(cat.id);
                        }}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all cursor-pointer gap-2.5 text-center ${
                          isSelected
                            ? 'border-[#108474] bg-[#eef7f5]/70 ring-2 ring-[#eef7f5]0/20 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/60 hover:bg-gray-100/60'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-2xl ${cat.color} text-white flex items-center justify-center shadow-xs`}>
                          <Icon size={20} />
                        </div>
                        <span className="text-xs font-bold text-gray-900 leading-tight">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-[#108474] hover:bg-[#0e7063] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
                  >
                    <span>{lang === 'ro' ? 'Continuă' : 'Continuar'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Fill Details Form */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    {lang === 'ro' ? 'Titlu anunț *' : 'Título del anuncio *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      category === 'Auto & Moto' 
                        ? 'ex. BMW 320d GT xDrive 2020' 
                        : category === 'Imobiliare'
                        ? 'ex. Apartament 2 Camere Decomandat Herăstrău'
                        : 'ex. Titlu reprezentativ pentru anunț'
                    }
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20 focus:border-[#108474] transition-all"
                  />
                </div>

                {/* Auto Specific Form Fields */}
                {category === 'Auto & Moto' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-red-50/50 p-3.5 rounded-2xl border border-red-100">
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
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">An fabricație</label>
                      <input 
                        type="number"
                        value={an}
                        onChange={(e) => setAn(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">Combustibil</label>
                      <select 
                        value={combustibil}
                        onChange={(e) => setCombustibil(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      {lang === 'ro' ? 'Preț (€) *' : 'Precio (€) *'}
                    </label>
                    <div className="relative">
                      <Euro size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="ex. 12500"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20 focus:border-[#108474] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      {lang === 'ro' ? 'Oraș / Localitate *' : 'Ciudad *'}
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20 focus:border-[#108474] transition-all"
                      >
                        {ROMANIAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Image URL Input */}
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
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20 focus:border-[#108474] transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    {lang === 'ro' ? 'Descriere detaliată' : 'Descripción detallada'}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={lang === 'ro' ? 'Oferă detalii suplimentare despre starea produsului, dotări...' : 'Añade detalles sobre el estado, equipamiento...'}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20 focus:border-[#108474] transition-all"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-[#00664d] hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
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
  );
}

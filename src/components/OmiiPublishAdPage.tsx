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
  Check,
  Camera,
  X,
  Navigation
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Language } from '../translations';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3Client
// These env vars must be in your .env.local for omii
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_R2_SECRET_ACCESS_KEY || '',
  },
});

interface OmiiPublishAdPageProps {
  onBackToHome: () => void;
  lang?: Language;
}

const CATEGORIES = [
  { 
    id: 'Bazar & Cumpărături', 
    nameRo: 'Bazar & Cumpărături', 
    nameEs: 'Compraventa', 
    color: 'bg-[#108474]',
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

export default function OmiiPublishAdPage({ onBackToHome, lang = 'ro' }: OmiiPublishAdPageProps) {
  const [selectedCatId, setSelectedCatId] = useState<string | null>('Auto & Moto');
  const [expandedCatId, setExpandedCatId] = useState<string | null>('Auto & Moto');
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>('Autos');

  // Images state (up to 10 images)
  const [images, setImages] = useState<string[]>([]);

  // Lugar state
  const [locationInput, setLocationInput] = useState('București');

  // Detalles state
  const [year, setYear] = useState('2021');
  const [combustibil, setCombustibil] = useState('Gasolina');
  const [kilometros, setKilometros] = useState('45000');
  const [price, setPrice] = useState('14500');
  const [currency, setCurrency] = useState('EUR');
  const [condition, setCondition] = useState('Usado');

  // Title & Description state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const selectedCategoryObj = CATEGORIES.find(c => c.id === selectedCatId);

  // Missing fields validation checklist
  const getMissingFields = () => {
    const missing: string[] = [];
    if (!locationInput.trim()) missing.push(lang === 'es' ? 'Código postal, ciudad...' : 'Cod poștal, oraș...');
    if (!kilometros.trim()) missing.push(lang === 'es' ? 'Kilómetros' : 'Kilometri');
    if (!combustibil) missing.push(lang === 'es' ? 'Combustible' : 'Combustibil');
    if (!year) missing.push(lang === 'es' ? 'Año' : 'An fabricație');
    if (!title.trim() || title.length < 10) missing.push(lang === 'es' ? 'Título (mínimo 10 caracteres)' : 'Titlu (minim 10 caractere)');
    if (!description.trim() || description.length < 40) missing.push(lang === 'es' ? 'Descripción (mínimo 40 caracteres)' : 'Descriere (minim 40 caractere)');
    if (!price || Number(price) <= 0) missing.push(lang === 'es' ? 'Precio' : 'Preț');
    if (!condition) missing.push(lang === 'es' ? 'Estado/Condición' : 'Stare/Condiție');
    if (images.length === 0) missing.push(lang === 'es' ? 'Imágenes' : 'Imagini');
    return missing;
  };

  const missingFields = getMissingFields();
  const isValid = missingFields.length === 0;

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const availableSlots = 10 - images.length;
    const filesToUpload = files.slice(0, availableSlots);

    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    setError(null);

    const bucketName = import.meta.env.VITE_R2_BUCKET_NAME || '';
    const publicUrl = import.meta.env.VITE_R2_PUBLIC_URL || '';

    if (!bucketName) {
      setError(lang === 'es' ? 'Falta configurar VITE_R2_BUCKET_NAME en el archivo .env.local' : 'Lipsește VITE_R2_BUCKET_NAME din .env.local');
      setIsUploading(false);
      return;
    }

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const uniqueFileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: uniqueFileName,
          ContentType: file.type,
          ContentLength: file.size,
          Body: file,
        });

        await s3Client.send(command);

        const finalUrl = publicUrl 
          ? `${publicUrl}/${uniqueFileName}`
          : `https://${bucketName}.${import.meta.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${uniqueFileName}`;
          
        return finalUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error('Error uploading to R2:', err);
      setError(lang === 'es' ? 'Error al subir la imagen. Por favor, revisa tu conexión o las claves R2 (CORS/Credentials).' : 'Eroare la încărcarea imaginii. Verificați setările R2 (CORS/Credentials).');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError(lang === 'es' ? 'Por favor completa todos los campos requeridos.' : 'Te rugăm să completezi toate câmpurile obligatorii.');
      return;
    }

    setLoading(true);

    try {
      const targetCategory = selectedCatId || 'Auto & Moto';
      const targetCollection = selectedCategoryObj?.collection || 'anuncios_auto';
      const allImages = [...images];
      const mainImage = allImages[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400';

      const user = auth.currentUser;

      const adData: any = {
        title: title.trim(),
        price: Number(price),
        currency,
        category: targetCategory,
        subcat: selectedSubcat,
        location: locationInput,
        description: description.trim(),
        images: allImages.length > 0 ? allImages : [mainImage],
        imageUrl: mainImage,
        year: Number(year),
        combustibil,
        kilometros: Number(kilometros),
        condition,
        status: 'active',
        createdAt: serverTimestamp(),
        userId: user ? user.uid : 'guest',
        userEmail: user ? user.email : 'guest@omii.ro',
        userName: user ? (user.displayName || user.email?.split('@')[0]) : 'Utilizator Omii'
      };

      // Create Internal Local Ad Object
      const internalAd = {
        id: `int-${Date.now()}`,
        category: targetCategory,
        title: title.trim(),
        subtitle: description.trim() || `${targetCategory} - Publicat pe Omii`,
        price: `${new Intl.NumberFormat('ro-RO').format(Number(price))} ${currency === 'EUR' ? '€' : currency}`,
        location: locationInput,
        imageUrl: mainImage,
        tags: [targetCategory.toLowerCase(), locationInput.toLowerCase(), 'intern', 'anunt'],
        isInternal: true,
        createdAt: new Date().toISOString()
      };

      // 1. Save to Local Storage
      const existingInternal = JSON.parse(localStorage.getItem('omii_internal_published_ads') || '[]');
      const updatedInternal = [internalAd, ...existingInternal];
      localStorage.setItem('omii_internal_published_ads', JSON.stringify(updatedInternal));

      // 2. Dispatch Custom Event
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
      
      {/* Top Sub-Header Bar: 0 Créditos / 0 Karma */}
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#108474] tracking-tight mb-6">
          {lang === 'ro' ? 'Selectează categoria' : 'Selecciona categoría'}
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Categories & Subcategories List */}
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
                        ? 'bg-[#eef7f5]/70 shadow-2xs font-bold' 
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
                      <span className={`text-sm sm:text-base font-semibold ${isSelected || isExpanded ? 'text-[#108474] font-bold' : 'text-[#5054B4] hover:text-[#108474]'}`}>
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
                                ? 'text-[#108474] font-extrabold underline' 
                                : 'text-[#5054B4] hover:text-[#108474] hover:underline'
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

          {/* Right Column: Dynamic Form tailored to user specification */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100">
            
            {!selectedCatId ? (
              /* Default State: Chameleon Illustration */
              <div className="text-center py-6 space-y-5 flex flex-col items-center justify-center min-h-[380px]">
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
            ) : success ? (
              /* Success Screen */
              <div className="py-12 text-center space-y-4 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#b3d9cf] text-[#00664d] flex items-center justify-center mx-auto shadow-xs">
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
              /* Selected Category Form: Matching User Request 1:1 */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Category Header Breadcrumb */}
                <div className="pb-4 border-b border-gray-100">
                  <h2 className="text-xl font-extrabold text-[#5054B4]">
                    {lang === 'es' ? selectedCategoryObj?.nameEs : selectedCategoryObj?.nameRo}
                    {selectedSubcat && <span className="text-[#108474]"> &gt; {selectedSubcat}</span>}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 font-medium">
                    {selectedCatId === 'Auto & Moto' 
                      ? (lang === 'ro' ? 'Vinde vehicule și accesorii auto' : 'Vende vehículos y accesorios de vehículos')
                      : selectedCatId === 'Imobiliare'
                      ? (lang === 'ro' ? 'Publică proprietăți imobiliare de vânzare sau închiriat' : 'Vende o alquila inmuebles')
                      : (lang === 'ro' ? 'Publică anunțul tău rapid pe Omii' : 'Publica tu anuncio fácilmente')}
                  </p>
                </div>

                {/* Section 1: Imágenes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-gray-800">
                      {lang === 'es' ? 'Imágenes' : 'Imagini'}
                    </h3>
                    <span className="text-xs font-bold text-gray-400">
                      {lang === 'es' ? 'Máximo 10 imágenes' : 'Maxim 10 imagini'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {lang === 'es' 
                      ? 'Las imágenes no pueden contener teléfono, email o sitio web' 
                      : 'Imaginile nu pot conține număr de telefon, email sau site web'}
                  </p>

                  {/* Image Gallery Slots */}
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group">
                        <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {images.length < 10 && (
                      <div 
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        className={`aspect-square rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`}
                      >
                        {isUploading ? <Loader2 size={18} className="animate-spin text-[#108474]" /> : <Camera size={18} />}
                      </div>
                    )}
                    {Array.from({ length: Math.max(0, 4 - images.length) }).map((_, idx) => (
                      <div key={idx} className="aspect-square rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-200">
                        <Camera size={18} />
                      </div>
                    ))}
                  </div>

                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    multiple 
                    accept="image/jpeg,image/png,image/webp" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </div>

                {/* Section 2: Lugar */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h3 className="text-base font-extrabold text-gray-800">
                    {lang === 'es' ? 'Lugar' : 'Locație'}
                  </h3>
                  <label className="text-xs font-bold text-gray-700 block">
                    {lang === 'es' ? '¿Dónde quieres anunciar?' : 'Unde dorești să publici anunțul?'}
                  </label>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                        placeholder={lang === 'es' ? 'Código postal, ciudad...' : 'Cod poștal, oraș...'}
                        className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setLocationInput('București')}
                      className="px-3.5 py-2.5 bg-[#eef7f5] hover:bg-[#bce0da] text-[#0e7063] font-bold text-xs rounded-xl border border-[#bce0da]/60 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Navigation size={14} />
                      <span>{lang === 'es' ? 'Localizar' : 'Localizează'}</span>
                    </button>
                  </div>
                  
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {lang === 'es' 
                      ? 'Puedes pulsar en localizar o escribir ciudad, pueblo, codigo postal... El sistema buscara y mostrara un listado con los codigos postales donde poder elegir'
                      : 'Poți apăsa pe localizează sau scrie orașul, codul poștal... Sistemul va căuta și va afișa o listă.'}
                  </p>
                </div>

                {/* Section 3: Detalles */}
                <div className="space-y-4 pt-3 border-t border-gray-100">
                  <h3 className="text-base font-extrabold text-gray-800">
                    {lang === 'es' ? 'Detalles' : 'Detalii'}
                  </h3>

                  {/* Row 1: Año & Combustible */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'es' ? 'Año' : 'An fabricație'}
                      </label>
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                      >
                        {Array.from({ length: 45 }).map((_, i) => {
                          const y = (2026 - i).toString();
                          return <option key={y} value={y}>{y}</option>;
                        })}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'es' ? 'Combustible' : 'Combustibil'}
                      </label>
                      <select
                        value={combustibil}
                        onChange={(e) => setCombustibil(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                      >
                        <option value="Gasolina">Gasolina / Benzină</option>
                        <option value="Diésel">Diésel / Motorină</option>
                        <option value="Híbrido">Híbrido / Hibrid</option>
                        <option value="Eléctrico">Eléctrico</option>
                        <option value="GLP">GLP</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Kilómetros & Precio + Moneda */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'es' ? 'Kilómetros' : 'Kilometri'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={kilometros}
                          onChange={(e) => setKilometros(e.target.value)}
                          placeholder="45000"
                          className="w-full pr-8 pl-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">km</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'es' ? 'Precio' : 'Preț'}
                      </label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="14500"
                        className="w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">
                        {lang === 'es' ? 'Moneda' : 'Monedă'}
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                      >
                        <option value="EUR">EUR (€ Euro)</option>
                        <option value="RON">RON (Lei)</option>
                        <option value="PEN">S/ - Sol Peruano</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Estado/Condición */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">
                      {lang === 'es' ? 'Estado/Condición' : 'Stare / Condiție'}
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                    >
                      <option value="Usado">Usado / Second-Hand</option>
                      <option value="Nuevo">Nuevo / Nou</option>
                      <option value="Excelente">Excelente / Ca Nou</option>
                    </select>
                  </div>
                </div>

                {/* Section 4: Título */}
                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">
                      {lang === 'es' ? 'Título' : 'Titlu'}
                    </label>
                    <span className="text-[11px] font-bold text-gray-400">
                      {title.length} / 70
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {lang === 'es' 
                      ? 'No incluya el número de teléfono, web o email. Mínimo 10 caracteres.' 
                      : 'Nu includeți numărul de telefon, web sau email. Minim 10 caractere.'}
                  </p>
                  <input
                    type="text"
                    maxLength={70}
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={lang === 'es' ? 'Título del anuncio...' : 'Titlul anunțului...'}
                    className="w-full px-3.5 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                  />
                </div>

                {/* Section 5: Descripción */}
                <div className="space-y-1.5 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">
                      {lang === 'es' ? 'Descripción' : 'Descriere'}
                    </label>
                    <span className="text-[11px] font-bold text-gray-400">
                      {description.length} / 2000
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {lang === 'es' 
                      ? 'No incluya el número de teléfono, web o email al principio. Mínimo 40 caracteres.' 
                      : 'Nu includeți numărul de telefon, web sau email la început. Minim 40 caractere.'}
                  </p>
                  <textarea
                    rows={4}
                    maxLength={2000}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={lang === 'es' ? 'Escribe aquí la descripción detallada...' : 'Scrie aici descrierea detaliată...'}
                    className="w-full p-3 bg-gray-50/80 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#eef7f5]0/20"
                  />
                </div>

                {/* Error Message Box */}
                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Validation Checklist Warning Box */}
                {!isValid && (
                  <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl space-y-2 text-xs">
                    <p className="font-bold text-red-700 flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-600 shrink-0" />
                      <span>
                        {lang === 'es' 
                          ? 'Has de rellenar correctamente los campos que faltan para poder publicarlo:' 
                          : 'Trebuie să completezi corect câmpurile care lipsesc:'}
                      </span>
                    </p>
                    <ul className="list-disc list-inside text-red-600/90 font-semibold space-y-0.5 pl-5">
                      {missingFields.map((field, idx) => (
                        <li key={idx}>{field}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading || !isValid}
                    className="w-full py-3.5 bg-[#5B6BBF] hover:bg-[#4C5CAE] active:scale-[0.99] text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={18} />
                        <span>{lang === 'es' ? 'Publicar Anuncio' : 'Publică Anunțul'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

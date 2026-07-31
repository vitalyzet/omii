import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface OmiiListingItem {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  price: string;
  location: string;
  imageUrl: string;
  tags?: string[];
  createdAt?: any;
  isRealFirestoreAd?: boolean;
  [key: string]: any;
}

// Map Firestore ad document to Omii listing format
const mapFirestoreDocToOmii = (doc: any, collectionName: string): OmiiListingItem => {
  const d = doc.data();
  const id = doc.id;

  // Category determination
  let category = 'Bazar & Cumpărături';
  if (collectionName === 'anuncios_auto' || d.domain === 'auto' || d.category === 'auto' || d.marca) {
    category = 'Auto & Moto';
  } else if (d.domain === 'realestate' || d.category === 'imobiliare' || d.type === 'apartament' || d.type === 'casa' || d.type === 'teren') {
    category = 'Imobiliare';
  } else if (d.domain === 'jobs' || d.category === 'jobs' || d.category === 'munca') {
    category = 'Locuri de muncă';
  } else if (d.category === 'afaceri' || d.category === 'business') {
    category = 'Afaceri & Firme';
  } else if (d.category) {
    category = d.category;
  }

  // Title determination
  let title = d.title || '';
  if (!title && d.marca) {
    title = `${d.marca} ${d.model || ''} ${d.an || d.year || ''}`.trim();
  }
  if (!title) {
    title = 'Anunț Vindu24';
  }

  // Subtitle / Description
  let subtitle = d.subtitle || d.description || d.caroserie || d.details || '';
  if (subtitle.length > 80) {
    subtitle = subtitle.slice(0, 77) + '...';
  }

  // Price formatting
  let priceStr = 'Negociabil';
  if (d.price !== undefined && d.price !== null && d.price !== '') {
    const numPrice = Number(d.price);
    if (!isNaN(numPrice) && numPrice > 0) {
      priceStr = `${new Intl.NumberFormat('ro-RO').format(numPrice)} €`;
      if (d.period === 'luna' || d.period === 'month') {
        priceStr += '/lună';
      }
    } else {
      priceStr = String(d.price);
    }
  }

  // Location
  const location = d.localitate || d.city || d.location || 'România';

  // Image URL
  let imageUrl = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400';
  if (Array.isArray(d.images) && d.images.length > 0 && d.images[0]) {
    imageUrl = d.images[0];
  } else if (Array.isArray(d.photos) && d.photos.length > 0 && d.photos[0]) {
    imageUrl = d.photos[0];
  } else if (d.imageUrl) {
    imageUrl = d.imageUrl;
  } else if (d.photo) {
    imageUrl = d.photo;
  }

  // Tags for smart searching
  const tags = [
    category.toLowerCase(),
    (d.marca || '').toLowerCase(),
    (d.model || '').toLowerCase(),
    (d.city || d.localitate || '').toLowerCase(),
    (d.type || '').toLowerCase(),
    (d.operation || '').toLowerCase(),
    'vindu24',
    'real'
  ].filter(Boolean);

  return {
    ...d,
    id,
    category,
    title,
    subtitle,
    price: priceStr,
    location,
    imageUrl,
    images: Array.isArray(d.images) && d.images.length > 0 ? d.images : (Array.isArray(d.photos) ? d.photos : []),
    tags,
    createdAt: d.createdAt,
    isRealFirestoreAd: true
  };
};

/**
 * Script / Service to fetch real published ads from Firestore (collections: 'anuncios' and 'anuncios_auto')
 */
export const fetchRealFirestoreListings = async (): Promise<OmiiListingItem[]> => {
  const realListings: OmiiListingItem[] = [];

  try {
    // 1. Fetch real ads from 'anuncios' collection
    const qAnuncios = query(
      collection(db, 'anuncios'),
      where('status', '==', 'active')
    );
    const snapAnuncios = await getDocs(qAnuncios);
    snapAnuncios.forEach((doc) => {
      realListings.push(mapFirestoreDocToOmii(doc, 'anuncios'));
    });
  } catch (err) {
    console.warn("Could not fetch 'anuncios' collection from Firestore", err);
  }

  try {
    // 2. Fetch real auto ads from 'anuncios_auto' collection
    const qAuto = query(
      collection(db, 'anuncios_auto'),
      where('status', '==', 'active')
    );
    const snapAuto = await getDocs(qAuto);
    snapAuto.forEach((doc) => {
      realListings.push(mapFirestoreDocToOmii(doc, 'anuncios_auto'));
    });
  } catch (err) {
    console.warn("Could not fetch 'anuncios_auto' collection from Firestore", err);
  }

  return realListings;
};

/**
 * Subscribe to real-time updates for published ads in Firestore
 */
export const subscribeToRealListings = (onUpdate: (listings: OmiiListingItem[]) => void) => {
  let anunciosItems: OmiiListingItem[] = [];
  let autoItems: OmiiListingItem[] = [];

  const emitAll = () => {
    onUpdate([...anunciosItems, ...autoItems]);
  };

  try {
    const q1 = query(collection(db, 'anuncios'), where('status', '==', 'active'));
    const unsub1 = onSnapshot(q1, (snap) => {
      anunciosItems = snap.docs.map(doc => mapFirestoreDocToOmii(doc, 'anuncios'));
      emitAll();
    }, (err) => console.warn("Snapshot error anuncios", err));

    const q2 = query(collection(db, 'anuncios_auto'), where('status', '==', 'active'));
    const unsub2 = onSnapshot(q2, (snap) => {
      autoItems = snap.docs.map(doc => mapFirestoreDocToOmii(doc, 'anuncios_auto'));
      emitAll();
    }, (err) => console.warn("Snapshot error anuncios_auto", err));

    return () => {
      unsub1();
      unsub2();
    };
  } catch (err) {
    console.warn("Realtime subscription error", err);
    return () => {};
  }
};

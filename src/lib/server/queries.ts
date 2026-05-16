import { adminDb, FieldValue } from './firebase-admin';
import type { Beat, Drumkit, Service } from '$types/content';
import type { Query } from 'firebase-admin/firestore';

// ── Beat filters ────────────────────────────────────────────────
export interface BeatFilters {
  genre?: string;
  bpmMin?: number;
  bpmMax?: number;
  mood?: string;
  key?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: 'recent' | 'popular' | 'price_asc' | 'price_desc';
  search?: string;
}

export async function getBeats(filters: BeatFilters = {}): Promise<Beat[]> {
  const db = adminDb();
  let query: Query = db.collection('beats').where('isPublished', '==', true);

  // Apply Firestore-compatible filters (equality + range on single field)
  if (filters.genre) {
    query = query.where('genre', 'array-contains', filters.genre);
  }

  if (filters.mood) {
    query = query.where('mood', 'array-contains', filters.mood);
  }

  // Sorting
  switch (filters.sort) {
    case 'popular':
      query = query.orderBy('plays', 'desc');
      break;
    case 'price_asc':
      query = query.orderBy('priceBasic', 'asc');
      break;
    case 'price_desc':
      query = query.orderBy('priceBasic', 'desc');
      break;
    case 'recent':
    default:
      query = query.orderBy('createdAt', 'desc');
      break;
  }

  const snap = await query.get();
  let beats = snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
  })) as Beat[];

  // Post-query filters (BPM range, price range, key, search)
  if (filters.bpmMin !== undefined) {
    beats = beats.filter(b => b.bpm >= filters.bpmMin!);
  }
  if (filters.bpmMax !== undefined) {
    beats = beats.filter(b => b.bpm <= filters.bpmMax!);
  }
  if (filters.priceMin !== undefined) {
    beats = beats.filter(b => b.priceBasic >= filters.priceMin!);
  }
  if (filters.priceMax !== undefined) {
    beats = beats.filter(b => b.priceBasic <= filters.priceMax!);
  }
  if (filters.key) {
    beats = beats.filter(b => b.key === filters.key);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    beats = beats.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.tags?.some(t => t.toLowerCase().includes(q)) ||
      b.genre?.some(g => g.toLowerCase().includes(q)) ||
      b.memberName?.toLowerCase().includes(q)
    );
  }

  // Filter out sold exclusive beats
  beats = beats.filter(b => !b.isSold);

  return beats;
}

export async function getBeatBySlug(slug: string): Promise<Beat | null> {
  const db = adminDb();
  const snap = await db.collection('beats')
    .where('slug', '==', slug)
    .where('isPublished', '==', true)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Beat;
}

export async function getFeaturedBeats(limit = 4): Promise<Beat[]> {
  const db = adminDb();
  const snap = await db.collection('beats')
    .where('isPublished', '==', true)
    .where('isFeatured', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Beat[];
}

// ── Drumkits ────────────────────────────────────────────────────
export async function getDrumkits(): Promise<Drumkit[]> {
  const db = adminDb();
  const snap = await db.collection('drumkits')
    .where('isPublished', '==', true)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Drumkit[];
}

export async function getDrumkitBySlug(slug: string): Promise<Drumkit | null> {
  const db = adminDb();
  const snap = await db.collection('drumkits')
    .where('slug', '==', slug)
    .where('isPublished', '==', true)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Drumkit;
}

// ── Services ────────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  const db = adminDb();
  const snap = await db.collection('services')
    .where('isActive', '==', true)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const db = adminDb();
  const snap = await db.collection('services')
    .where('slug', '==', slug)
    .where('isActive', '==', true)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Service;
}

// ── Client helpers ──────────────────────────────────────────────
export async function getClient(uid: string) {
  const db = adminDb();
  const doc = await db.doc(`clients/${uid}`).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Record<string, unknown>;
}

export async function getClientOrders(uid: string) {
  const db = adminDb();
  const snap = await db.collection('orders')
    .where('clientId', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Record<string, unknown>[];
}

// ── Exclusivity ─────────────────────────────────────────────────
export async function reserveBeat(beatId: string, uid: string): Promise<boolean> {
  const db = adminDb();
  const beatRef = db.doc(`beats/${beatId}`);

  try {
    await db.runTransaction(async (tx) => {
      const beatDoc = await tx.get(beatRef);
      if (!beatDoc.exists) throw new Error('Beat not found');

      const data = beatDoc.data()!;

      // Check if already sold
      if (data.isSold) throw new Error('Beat already sold');

      // Check if reserved by someone else and reservation hasn't expired
      if (data.reservedBy && data.reservedBy !== uid) {
        const reservedUntil = data.reservedUntil?.toDate?.();
        if (reservedUntil && reservedUntil > new Date()) {
          throw new Error('Beat reserved by another buyer');
        }
      }

      // Reserve for 5 minutes
      const reservedUntil = new Date(Date.now() + 5 * 60 * 1000);
      tx.update(beatRef, {
        reservedBy: uid,
        reservedUntil,
      });
    });
    return true;
  } catch {
    return false;
  }
}

export async function releaseBeat(beatId: string, uid: string): Promise<void> {
  const db = adminDb();
  const beatRef = db.doc(`beats/${beatId}`);

  await db.runTransaction(async (tx) => {
    const beatDoc = await tx.get(beatRef);
    if (!beatDoc.exists) return;

    const data = beatDoc.data()!;
    if (data.reservedBy === uid) {
      tx.update(beatRef, {
        reservedBy: FieldValue.delete(),
        reservedUntil: FieldValue.delete(),
      });
    }
  });
}

export async function markBeatSold(beatId: string, buyerUid: string, orderId: string): Promise<boolean> {
  const db = adminDb();
  const beatRef = db.doc(`beats/${beatId}`);

  try {
    await db.runTransaction(async (tx) => {
      const beatDoc = await tx.get(beatRef);
      if (!beatDoc.exists) throw new Error('Beat not found');

      const data = beatDoc.data()!;
      if (data.isSold) throw new Error('Beat already sold');

      tx.update(beatRef, {
        isSold: true,
        soldTo: buyerUid,
        soldAt: FieldValue.serverTimestamp(),
        soldOrderId: orderId,
        reservedBy: FieldValue.delete(),
        reservedUntil: FieldValue.delete(),
      });
    });
    return true;
  } catch {
    return false;
  }
}

export async function cleanupExpiredReservations(): Promise<void> {
  const db = adminDb();
  const snap = await db.collection('beats')
    .where('reservedUntil', '<=', new Date())
    .get();

  const batch = db.batch();
  for (const doc of snap.docs) {
    batch.update(doc.ref, {
      reservedBy: FieldValue.delete(),
      reservedUntil: FieldValue.delete(),
    });
  }
  await batch.commit();
}

// ── Drops ───────────────────────────────────────────────────────
export interface Drop {
  id: string;
  slug: string;
  title: string;
  memberId: string;
  memberName: string;
  coverUrl?: string;
  price: number;
  maxBuyers?: number;
  buyersCount: number;
  isPublished: boolean;
  isSoldOut: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt: Date;
}

export async function getDrops(): Promise<Drop[]> {
  const db = adminDb();
  const snap = await db.collection('drops')
    .where('isPublished', '==', true)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Drop[];
}

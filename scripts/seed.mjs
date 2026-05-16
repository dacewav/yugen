/**
 * Seed script for YUGEN.STORE — creates test data in Firestore.
 *
 * Usage:
 *   node scripts/seed.mjs
 *
 * Requires: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in env
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// ── Init Firebase Admin ─────────────────────────────────────────
const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
  console.error('❌ Missing Firebase Admin credentials in env.');
  console.error('   Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  process.exit(1);
}

const app = getApps().length === 0
  ? initializeApp({
      credential: cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
  : getApps()[0];

const db = getFirestore(app);

// ── Seed data ───────────────────────────────────────────────────
const MEMBER_ID = 'seed-producer-001';

const beats = [
  {
    slug: 'midnight-drift',
    title: 'Midnight Drift',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['trap'],
    bpm: 140,
    key: 'Am',
    mood: ['dark', 'atmospheric'],
    tags: ['808', 'melodic', 'night'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 29.99,
    pricePremium: 49.99,
    priceExclusive: 199.99,
    plays: 1247,
    isPublished: true,
    isFeatured: true,
    isExclusive: false,
    isSold: false,
    createdAt: new Date('2026-04-10'),
    updatedAt: new Date('2026-04-10'),
  },
  {
    slug: 'neon-pulse',
    title: 'Neon Pulse',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['drill'],
    bpm: 145,
    key: 'Gm',
    mood: ['aggressive', 'energetic'],
    tags: ['sliding 808', 'dark synth', 'uk drill'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 34.99,
    pricePremium: 59.99,
    priceExclusive: 249.99,
    plays: 892,
    isPublished: true,
    isFeatured: true,
    isExclusive: false,
    isSold: false,
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-15'),
  },
  {
    slug: 'velvet-haze',
    title: 'Velvet Haze',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['r&b'],
    bpm: 85,
    key: 'Db',
    mood: ['smooth', 'chill'],
    tags: ['lo-fi', 'vinyl', 'soulful'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 24.99,
    pricePremium: 44.99,
    priceExclusive: 179.99,
    plays: 2103,
    isPublished: true,
    isFeatured: true,
    isExclusive: false,
    isSold: false,
    createdAt: new Date('2026-03-20'),
    updatedAt: new Date('2026-03-20'),
  },
  {
    slug: 'shadow-realm',
    title: 'Shadow Realm',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['trap', 'boom bap'],
    bpm: 130,
    key: 'Em',
    mood: ['dark', 'gritty'],
    tags: ['orchestral', 'cinematic', 'hard'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 39.99,
    pricePremium: 69.99,
    priceExclusive: 349.99,
    plays: 567,
    isPublished: true,
    isFeatured: false,
    isExclusive: true,
    isSold: false,
    createdAt: new Date('2026-04-22'),
    updatedAt: new Date('2026-04-22'),
  },
  {
    slug: 'solar-flare',
    title: 'Solar Flare',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['trap'],
    bpm: 155,
    key: 'C',
    mood: ['energetic', 'uplifting'],
    tags: ['festival', 'synth lead', 'bouncy'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 29.99,
    pricePremium: 54.99,
    priceExclusive: 229.99,
    plays: 3456,
    isPublished: true,
    isFeatured: true,
    isExclusive: false,
    isSold: false,
    createdAt: new Date('2026-05-01'),
    updatedAt: new Date('2026-05-01'),
  },
  {
    slug: 'ghost-frequencies',
    title: 'Ghost Frequencies',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['drill'],
    bpm: 142,
    key: 'Fm',
    mood: ['dark', 'atmospheric'],
    tags: ['haunting', 'reverb', 'minimal'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 34.99,
    pricePremium: 59.99,
    priceExclusive: 279.99,
    plays: 789,
    isPublished: true,
    isFeatured: false,
    isExclusive: false,
    isSold: false,
    createdAt: new Date('2026-05-05'),
    updatedAt: new Date('2026-05-05'),
  },
  {
    slug: 'crystal-waves',
    title: 'Crystal Waves',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['r&b', 'lo-fi'],
    bpm: 75,
    key: 'Bb',
    mood: ['chill', 'dreamy'],
    tags: ['ambient', 'pad', 'gentle'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 24.99,
    pricePremium: 44.99,
    priceExclusive: 169.99,
    plays: 4521,
    isPublished: true,
    isFeatured: false,
    isExclusive: false,
    isSold: false,
    createdAt: new Date('2026-03-10'),
    updatedAt: new Date('2026-03-10'),
  },
  {
    slug: 'voltage',
    title: 'Voltage',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['trap'],
    bpm: 160,
    key: 'Dm',
    mood: ['aggressive', 'dark'],
    tags: ['rage', 'distorted', 'heavy 808'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 39.99,
    pricePremium: 64.99,
    priceExclusive: 299.99,
    plays: 1890,
    isPublished: true,
    isFeatured: false,
    isExclusive: false,
    isSold: false,
    createdAt: new Date('2026-05-10'),
    updatedAt: new Date('2026-05-10'),
  },
  {
    slug: 'silk-road',
    title: 'Silk Road',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['boom bap'],
    bpm: 90,
    key: 'G',
    mood: ['smooth', 'nostalgic'],
    tags: ['jazz sample', 'vinyl crackle', 'classic'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 29.99,
    pricePremium: 49.99,
    priceExclusive: 199.99,
    plays: 678,
    isPublished: true,
    isFeatured: false,
    isExclusive: false,
    isSold: false,
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-04-01'),
  },
  {
    slug: 'phantom-bounce',
    title: 'Phantom Bounce',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    genre: ['trap', 'drill'],
    bpm: 148,
    key: 'Am',
    mood: ['dark', 'energetic'],
    tags: ['bounce', 'hi-hats', 'bass heavy'],
    coverUrl: '',
    previewUrl: '',
    priceBasic: 34.99,
    pricePremium: 59.99,
    priceExclusive: 259.99,
    plays: 1023,
    isPublished: true,
    isFeatured: false,
    isExclusive: true,
    isSold: false,
    createdAt: new Date('2026-05-12'),
    updatedAt: new Date('2026-05-12'),
  },
];

const drumkits = [
  {
    slug: 'midnight-percussion-vol1',
    title: 'Midnight Percussion Vol. 1',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    description: 'Dark, atmospheric percussion collection. 808s, hi-hats, snares, and fx designed for trap and drill production.',
    coverUrl: '',
    price: 19.99,
    tags: ['808', 'drums', 'trap', 'dark'],
    sampleCount: 45,
    isPublished: true,
    createdAt: new Date('2026-04-01'),
  },
  {
    slug: 'neon-textures',
    title: 'Neon Textures',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    description: 'Ambient textures, risers, and fx for adding depth and atmosphere to your beats.',
    coverUrl: '',
    price: 14.99,
    tags: ['fx', 'ambient', 'textures', 'risers'],
    sampleCount: 32,
    isPublished: true,
    createdAt: new Date('2026-04-20'),
  },
  {
    slug: 'analog-kicks',
    title: 'Analog Kicks Collection',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    description: 'Punchy analog-synthesized kick drums. Layered, processed, and ready to drop into your DAW.',
    coverUrl: '',
    price: 9.99,
    tags: ['kicks', 'analog', 'punchy'],
    sampleCount: 60,
    isPublished: true,
    createdAt: new Date('2026-05-05'),
  },
];

const services = [
  {
    slug: 'mixing',
    title: 'Mixing',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    description: 'Professional mixing for your tracks. Get that polished, radio-ready sound.',
    longDescription: 'Every mix includes EQ, compression, spatial processing, and detailed automation. I work with you until it sounds exactly right.',
    category: 'mixing',
    tiers: [
      {
        name: 'basic',
        label: 'Basic',
        price: 49.99,
        priceMXN: 899,
        description: 'Stereo mix, 2 revisions',
        features: ['Stereo mix', '2 revisions', '5-day delivery', 'MP3 + WAV'],
        deliveryDays: 5,
        revisions: 2,
      },
      {
        name: 'premium',
        label: 'Premium',
        price: 99.99,
        priceMXN: 1799,
        description: 'Stem mixing, 4 revisions',
        features: ['Stem mixing', '4 revisions', '3-day delivery', 'MP3 + WAV + Stems', 'Free mix revision'],
        deliveryDays: 3,
        revisions: 4,
      },
      {
        name: 'exclusive',
        label: 'VIP',
        price: 199.99,
        priceMXN: 3599,
        description: 'Unlimited revisions, priority',
        features: ['Unlimited revisions', '1-day delivery', 'Full stems + session', 'Direct phone support', 'Mastering included'],
        deliveryDays: 1,
        revisions: -1,
      },
    ],
    isActive: true,
    createdAt: new Date('2026-03-01'),
  },
  {
    slug: 'mastering',
    title: 'Mastering',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    description: 'Final polish for your mix. Loudness, clarity, and punch for streaming platforms.',
    category: 'mastering',
    tiers: [
      {
        name: 'basic',
        label: 'Standard',
        price: 29.99,
        priceMXN: 539,
        description: 'Stereo master, 1 revision',
        features: ['Stereo master', '1 revision', '3-day delivery', 'LUFS optimized for streaming'],
        deliveryDays: 3,
        revisions: 1,
      },
      {
        name: 'premium',
        label: 'Deluxe',
        price: 59.99,
        priceMXN: 1079,
        description: 'Master + instrumental master',
        features: ['Vocal + instrumental masters', '2 revisions', '2-day delivery', 'All formats'],
        deliveryDays: 2,
        revisions: 2,
      },
    ],
    isActive: true,
    createdAt: new Date('2026-03-15'),
  },
  {
    slug: 'production-package',
    title: 'Production Package',
    memberId: MEMBER_ID,
    memberName: 'Kaze',
    description: 'Full beat production from scratch. Tell me the vibe, I\'ll create it.',
    category: 'production',
    tiers: [
      {
        name: 'basic',
        label: 'Beat',
        price: 79.99,
        priceMXN: 1439,
        description: 'Custom beat, 2 revisions',
        features: ['Custom beat', '2 revisions', '7-day delivery', 'MP3 + WAV lease'],
        deliveryDays: 7,
        revisions: 2,
      },
      {
        name: 'premium',
        label: 'Full Production',
        price: 249.99,
        priceMXN: 4499,
        description: 'Full song production, stems',
        features: ['Full song production', '4 revisions', '10-day delivery', 'Stems + session file', 'Mix included'],
        deliveryDays: 10,
        revisions: 4,
      },
    ],
    isActive: true,
    createdAt: new Date('2026-04-01'),
  },
];

// ── Seed function ───────────────────────────────────────────────
async function seed() {
  console.log('🌱 Seeding YUGEN.STORE...\n');

  // Beats
  console.log('📀 Creating beats...');
  for (const beat of beats) {
    const ref = db.collection('beats').doc();
    await ref.set({
      ...beat,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    console.log(`   ✓ ${beat.title} (${beat.slug})`);
  }

  // Drumkits
  console.log('\n🥁 Creating drumkits...');
  for (const kit of drumkits) {
    const ref = db.collection('drumkits').doc();
    await ref.set({
      ...kit,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`   ✓ ${kit.title} (${kit.slug})`);
  }

  // Services
  console.log('\n🎛️  Creating services...');
  for (const service of services) {
    const ref = db.collection('services').doc();
    await ref.set({
      ...service,
      createdAt: FieldValue.serverTimestamp(),
    });
    console.log(`   ✓ ${service.title} (${service.slug})`);
  }

  // Seed client
  console.log('\n👤 Creating sample client...');
  await db.doc('clients/seed-client-001').set({
    uid: 'seed-client-001',
    email: 'test@yugen.store',
    displayName: 'Test Buyer',
    purchaseHistory: [],
    favorites: ['midnight-drift', 'velvet-haze'],
    createdAt: FieldValue.serverTimestamp(),
    lastLoginAt: FieldValue.serverTimestamp(),
  });
  console.log('   ✓ test@yugen.store');

  console.log('\n✅ Seed complete!');
  console.log(`   ${beats.length} beats, ${drumkits.length} drumkits, ${services.length} services, 1 client`);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

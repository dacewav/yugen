export interface Beat {
  id: string;
  slug: string;
  title: string;
  memberId: string;
  memberName: string;
  memberAvatar?: string;
  genre: string[];
  bpm: number;
  key?: string;
  mood?: string[];
  tags: string[];
  coverUrl: string;
  previewUrl: string;
  waveformUrl?: string;
  priceBasic: number;
  pricePremium: number;
  priceExclusive: number;
  licenseBasic?: string;
  licensePremium?: string;
  licenseExclusive?: string;
  plays: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Drumkit {
  id: string;
  slug: string;
  title: string;
  memberId: string;
  memberName: string;
  description: string;
  coverUrl: string;
  previewUrls?: string[];
  downloadUrl?: string;
  price: number;
  tags: string[];
  sampleCount: number;
  isPublished: boolean;
  createdAt: Date;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  memberId: string;
  memberName: string;
  description: string;
  longDescription?: string;
  coverUrl?: string;
  category: 'mixing' | 'mastering' | 'recording' | 'production' | 'other';
  tiers: ServiceTier[];
  isActive: boolean;
  createdAt: Date;
}

export interface ServiceTier {
  name: string;
  label: string;
  price: number;
  priceMXN?: number;
  description: string;
  features: string[];
  deliveryDays: number;
  revisions: number;
}

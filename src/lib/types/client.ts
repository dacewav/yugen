export interface Client {
  id: string;
  uid: string;           // Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  country?: string;
  purchaseHistory: string[];  // order IDs
  favorites: string[];        // beat IDs
  portalToken?: string;       // for guest portal access
  createdAt: Date;
  lastLoginAt: Date;
}

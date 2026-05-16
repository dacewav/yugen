import type { Role } from '../../app';

export type { Role };

export interface Member {
  id: string;
  uid: string;
  email: string;
  slug: string;
  crewName: string;
  realName?: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  role: Role;
  accentColor?: string;
  socials?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    soundcloud?: string;
    spotify?: string;
  };
  isActive: boolean;
  joinedAt: Date;
  claimsVersion: number;
}

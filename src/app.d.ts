declare global {
  namespace App {
    interface Locals {
      user: {
        uid: string;
        email: string;
        role: Role;
        memberId: string | null;
        crewName: string | null;
        claimsVersion: number;
      } | null;
    }
    interface PageData {
      user: App.Locals['user'];
    }
    interface Error {
      message: string;
      code?: string;
    }
  }
}

export {};

export type Role = 'owner' | 'admin' | 'editor' | 'member' | 'viewer';

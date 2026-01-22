// Market and module purchase related types

export type ModuleDuration = '1day' | '1week' | '1month' | '6months' | '1year';

export interface ModulePackage {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string; // Ionicons name
  color: string;
  prices: {
    '1day': number;
    '1week': number;
    '1month': number;
    '6months': number;
    '1year': number;
  };
}

export interface UserModule {
  moduleId: string;
  expiresAt: Date;
  isActive: boolean;
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number; // TL
  bonus: number; // Extra credits
  popular?: boolean;
}

export interface AdReward {
  credits: number;
  watchedToday: number;
  maxPerDay: number;
  lastWatchDate: Date | null;
}

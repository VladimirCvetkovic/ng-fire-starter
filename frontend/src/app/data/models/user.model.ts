import { PaletteKey } from '@core/services/core-palette.service';

export type Role = 'user' | 'admin';
export type ThemeMode = 'dark' | 'light' | 'system';

export type { PaletteKey };

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  logoUrl?: string;
  theme?: ThemeMode;
  palette?: PaletteKey;
  lang?: string;
}
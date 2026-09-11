export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'INR' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // relative to USD base
  format: (amount: number) => string;
}

export type LocationDetectionMethod = 'ip' | 'timezone' | 'locale' | 'geolocation' | 'fallback';

export interface DetectedLocation {
  countryCode: string;
  countryName: string;
  city?: string;
  currency: CurrencyCode;
  flag: string;
  method: LocationDetectionMethod;
  timestamp: number;
}

import { CurrencyCode, DetectedLocation, LocationDetectionMethod } from '@/types/currency';
import { CURRENCIES } from './mock-data';

/**
 * Converts a 2-letter ISO country code to its flag emoji.
 */
export function getCountryFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const code = countryCode.toUpperCase();
  // Regional Indicator Symbol Letter A is 0x1F1E6 (127462), 'A' is 65.
  // 127462 - 65 = 127397
  return String.fromCodePoint(...code.split('').map((char) => 127397 + char.charCodeAt(0)));
}

/**
 * Country code to Currency mapping
 */
export const COUNTRY_CURRENCY_MAP: Record<string, { currency: CurrencyCode; name: string }> = {
  // India & South Asia
  IN: { currency: 'INR', name: 'India' },
  NP: { currency: 'INR', name: 'Nepal' },
  BT: { currency: 'INR', name: 'Bhutan' },

  // United Kingdom & Crown Dependencies
  GB: { currency: 'GBP', name: 'United Kingdom' },
  UK: { currency: 'GBP', name: 'United Kingdom' },
  IM: { currency: 'GBP', name: 'Isle of Man' },
  JE: { currency: 'GBP', name: 'Jersey' },
  GG: { currency: 'GBP', name: 'Guernsey' },

  // Japan
  JP: { currency: 'JPY', name: 'Japan' },

  // Canada
  CA: { currency: 'CAD', name: 'Canada' },

  // Australia & New Zealand
  AU: { currency: 'AUD', name: 'Australia' },
  NZ: { currency: 'AUD', name: 'New Zealand' },

  // Eurozone & European Nations
  DE: { currency: 'EUR', name: 'Germany' },
  FR: { currency: 'EUR', name: 'France' },
  IT: { currency: 'EUR', name: 'Italy' },
  ES: { currency: 'EUR', name: 'Spain' },
  NL: { currency: 'EUR', name: 'Netherlands' },
  BE: { currency: 'EUR', name: 'Belgium' },
  AT: { currency: 'EUR', name: 'Austria' },
  IE: { currency: 'EUR', name: 'Ireland' },
  FI: { currency: 'EUR', name: 'Finland' },
  PT: { currency: 'EUR', name: 'Portugal' },
  GR: { currency: 'EUR', name: 'Greece' },
  CY: { currency: 'EUR', name: 'Cyprus' },
  EE: { currency: 'EUR', name: 'Estonia' },
  LV: { currency: 'EUR', name: 'Latvia' },
  LT: { currency: 'EUR', name: 'Lithuania' },
  LU: { currency: 'EUR', name: 'Luxembourg' },
  MT: { currency: 'EUR', name: 'Malta' },
  SK: { currency: 'EUR', name: 'Slovakia' },
  SI: { currency: 'EUR', name: 'Slovenia' },
  HR: { currency: 'EUR', name: 'Croatia' },
  MC: { currency: 'EUR', name: 'Monaco' },
  AD: { currency: 'EUR', name: 'Andorra' },
  SM: { currency: 'EUR', name: 'San Marino' },
  VA: { currency: 'EUR', name: 'Vatican City' },
  SE: { currency: 'EUR', name: 'Sweden' },
  NO: { currency: 'EUR', name: 'Norway' },
  DK: { currency: 'EUR', name: 'Denmark' },
  CH: { currency: 'EUR', name: 'Switzerland' },
  PL: { currency: 'EUR', name: 'Poland' },
  CZ: { currency: 'EUR', name: 'Czech Republic' },
  HU: { currency: 'EUR', name: 'Hungary' },
  RO: { currency: 'EUR', name: 'Romania' },
  BG: { currency: 'EUR', name: 'Bulgaria' },

  // United States & Territories
  US: { currency: 'USD', name: 'United States' },
  PR: { currency: 'USD', name: 'Puerto Rico' },
  GU: { currency: 'USD', name: 'Guam' },
  VI: { currency: 'USD', name: 'U.S. Virgin Islands' },
  AS: { currency: 'USD', name: 'American Samoa' },
  MP: { currency: 'USD', name: 'Northern Mariana Islands' },

  // Default USD for others in the Americas / Global
  EC: { currency: 'USD', name: 'Ecuador' },
  SV: { currency: 'USD', name: 'El Salvador' },
  PA: { currency: 'USD', name: 'Panama' },
  SG: { currency: 'USD', name: 'Singapore' },
  AE: { currency: 'USD', name: 'United Arab Emirates' },
  SA: { currency: 'USD', name: 'Saudi Arabia' },
  BR: { currency: 'USD', name: 'Brazil' },
  MX: { currency: 'USD', name: 'Mexico' },
};

/**
 * Look up currency and country details by ISO 2-letter code
 */
export function getCountryDetails(countryCode: string): { currency: CurrencyCode; name: string; flag: string } {
  const code = countryCode ? countryCode.toUpperCase() : 'US';
  const match = COUNTRY_CURRENCY_MAP[code];
  if (match) {
    return {
      currency: match.currency,
      name: match.name,
      flag: getCountryFlagEmoji(code),
    };
  }

  // Fallback to USD with proper flag
  return {
    currency: 'USD',
    name: code,
    flag: getCountryFlagEmoji(code),
  };
}

/**
 * Detect location and currency instantly from browser Timezone.
 * Zero network latency, never blocked by privacy extensions.
 */
export function detectFromTimezone(): DetectedLocation | null {
  if (typeof Intl === 'undefined' || !Intl.DateTimeFormat) return null;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (!tz) return null;

    // India
    if (tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata') {
      return {
        countryCode: 'IN',
        countryName: 'India',
        currency: 'INR',
        flag: '🇮🇳',
        method: 'timezone',
        timestamp: Date.now(),
      };
    }

    // Nepal / Bhutan
    if (tz === 'Asia/Kathmandu') {
      return { countryCode: 'NP', countryName: 'Nepal', currency: 'INR', flag: '🇳🇵', method: 'timezone', timestamp: Date.now() };
    }
    if (tz === 'Asia/Thimphu') {
      return { countryCode: 'BT', countryName: 'Bhutan', currency: 'INR', flag: '🇧🇹', method: 'timezone', timestamp: Date.now() };
    }

    // United Kingdom
    if (tz === 'Europe/London' || tz === 'Europe/Belfast') {
      return {
        countryCode: 'GB',
        countryName: 'United Kingdom',
        currency: 'GBP',
        flag: '🇬🇧',
        method: 'timezone',
        timestamp: Date.now(),
      };
    }

    // Japan
    if (tz === 'Asia/Tokyo') {
      return {
        countryCode: 'JP',
        countryName: 'Japan',
        currency: 'JPY',
        flag: '🇯🇵',
        method: 'timezone',
        timestamp: Date.now(),
      };
    }

    // Canada
    if (
      tz.startsWith('America/') &&
      [
        'Toronto', 'Vancouver', 'Edmonton', 'Winnipeg', 'Halifax',
        'St_Johns', 'Montreal', 'Regina', 'Yellowknife', 'Whitehorse', 'Iqaluit', 'Moncton'
      ].some((city) => tz.includes(city))
    ) {
      return {
        countryCode: 'CA',
        countryName: 'Canada',
        currency: 'CAD',
        flag: '🇨🇦',
        method: 'timezone',
        timestamp: Date.now(),
      };
    }

    // Australia & NZ
    if (tz.startsWith('Australia/') || tz.startsWith('Pacific/Auckland')) {
      const isNZ = tz.startsWith('Pacific/Auckland');
      return {
        countryCode: isNZ ? 'NZ' : 'AU',
        countryName: isNZ ? 'New Zealand' : 'Australia',
        currency: 'AUD',
        flag: isNZ ? '🇳🇿' : '🇦🇺',
        method: 'timezone',
        timestamp: Date.now(),
      };
    }

    // Western / Central Europe
    if (
      tz.startsWith('Europe/') &&
      [
        'Berlin', 'Paris', 'Rome', 'Madrid', 'Amsterdam', 'Brussels', 'Vienna',
        'Dublin', 'Helsinki', 'Lisbon', 'Athens', 'Stockholm', 'Oslo', 'Copenhagen',
        'Zurich', 'Warsaw', 'Prague', 'Budapest', 'Bucharest', 'Sofia', 'Luxembourg'
      ].some((city) => tz.includes(city))
    ) {
      const isUK = tz.includes('London') || tz.includes('Belfast');
      if (!isUK) {
        return {
          countryCode: 'EU',
          countryName: 'Europe',
          currency: 'EUR',
          flag: '🇪🇺',
          method: 'timezone',
          timestamp: Date.now(),
        };
      }
    }

    // United States
    if (
      tz.startsWith('America/') &&
      [
        'New_York', 'Chicago', 'Denver', 'Los_Angeles', 'Phoenix',
        'Anchorage', 'Honolulu', 'Detroit', 'Indiana', 'Boise', 'Menominee', 'Kentucky'
      ].some((city) => tz.includes(city))
    ) {
      return {
        countryCode: 'US',
        countryName: 'United States',
        currency: 'USD',
        flag: '🇺🇸',
        method: 'timezone',
        timestamp: Date.now(),
      };
    }
  } catch {
    // Timezone detection unavailable
  }
  return null;
}

/**
 * Detect location from navigator.languages / navigator.language
 */
export function detectFromLocale(): DetectedLocation | null {
  if (typeof navigator === 'undefined') return null;
  try {
    const languages = navigator.languages || [navigator.language];
    for (const lang of languages) {
      if (!lang) continue;
      const parts = lang.split('-');
      if (parts.length >= 2) {
        const countryCode = parts[1].toUpperCase();
        if (COUNTRY_CURRENCY_MAP[countryCode]) {
          const details = COUNTRY_CURRENCY_MAP[countryCode];
          return {
            countryCode,
            countryName: details.name,
            currency: details.currency,
            flag: getCountryFlagEmoji(countryCode),
            method: 'locale',
            timestamp: Date.now(),
          };
        }
      } else {
        // Single language tags
        const l = parts[0].toLowerCase();
        if (['hi', 'ta', 'te', 'mr', 'bn', 'gu', 'kn', 'ml', 'pa'].includes(l)) {
          return {
            countryCode: 'IN',
            countryName: 'India',
            currency: 'INR',
            flag: '🇮🇳',
            method: 'locale',
            timestamp: Date.now(),
          };
        }
        if (l === 'ja') {
          return {
            countryCode: 'JP',
            countryName: 'Japan',
            currency: 'JPY',
            flag: '🇯🇵',
            method: 'locale',
            timestamp: Date.now(),
          };
        }
      }
    }
  } catch {
    // Locale detection failed
  }
  return null;
}

/**
 * Detect location using IP Geolocation with multi-provider fallback.
 */
export async function detectFromIp(): Promise<DetectedLocation | null> {
  // 1. First attempt: Internal Next.js API route
  try {
    const res = await fetch('/api/detect-location', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.countryCode) {
        const details = getCountryDetails(data.countryCode);
        return {
          countryCode: data.countryCode,
          countryName: data.countryName || details.name,
          city: data.city,
          currency: details.currency,
          flag: details.flag,
          method: 'ip',
          timestamp: Date.now(),
        };
      }
    }
  } catch {
    // Internal API failed or running offline, continue to public fallback
  }

  // 2. Second attempt: High-speed public Geo-IP service (freeipapi.com)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://freeipapi.com/api/json', {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.countryCode) {
        const details = getCountryDetails(data.countryCode);
        return {
          countryCode: data.countryCode,
          countryName: data.countryName || details.name,
          city: data.cityName,
          currency: details.currency,
          flag: details.flag,
          method: 'ip',
          timestamp: Date.now(),
        };
      }
    }
  } catch {
    // FreeIPAPI timed out or blocked
  }

  // 3. Third attempt: country.is
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch('https://api.country.is/', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.country) {
        const details = getCountryDetails(data.country);
        return {
          countryCode: data.country,
          countryName: details.name,
          currency: details.currency,
          flag: details.flag,
          method: 'ip',
          timestamp: Date.now(),
        };
      }
    }
  } catch {
    // Country.is failed
  }

  return null;
}

/**
 * Complete tiered detection:
 * 1. Instant client-side timezone (zero network latency)
 * 2. Instant client-side locale
 * 3. Asynchronous IP refinement (fills city and exact country)
 */
export async function detectUserLocation(onFastResult?: (loc: DetectedLocation) => void): Promise<DetectedLocation> {
  // Step 1: Fast synchronous checks
  const tzResult = detectFromTimezone();
  if (tzResult) {
    if (onFastResult) onFastResult(tzResult);
  } else {
    const localeResult = detectFromLocale();
    if (localeResult && onFastResult) {
      onFastResult(localeResult);
    }
  }

  // Step 2: High precision IP lookup
  try {
    const ipResult = await detectFromIp();
    if (ipResult) {
      return ipResult;
    }
  } catch {
    // IP detection failed
  }

  // Fallback to fast result or default
  if (tzResult) return tzResult;

  const localeResult = detectFromLocale();
  if (localeResult) return localeResult;

  // Global default: US / USD
  return {
    countryCode: 'US',
    countryName: 'United States',
    currency: 'USD',
    flag: '🇺🇸',
    method: 'fallback',
    timestamp: Date.now(),
  };
}

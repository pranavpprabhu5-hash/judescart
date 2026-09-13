import { UserProfile } from '@/types/user';
import { INITIAL_USER } from '@/lib/mock-data';

export const AUTH_STORAGE_KEYS = {
  ACCOUNTS: 'judescart_customer_accounts',
  ACTIVE_EMAIL: 'judescart_active_customer_email',
  IS_LOGGED_IN: 'judescart_is_logged_in',
};

export const GUEST_USER: UserProfile = {
  name: 'Guest Shopper',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  savedAddresses: [],
  orders: [],
  judesCoins: 0,
  role: 'customer',
};

export const DEFAULT_DEMO_USER: UserProfile = {
  ...INITIAL_USER,
  phone: '+1 (555) 234-8910',
  password: 'judes123',
  joinedDate: 'Jan 2025',
  role: 'vip',
};

export function getStoredAccounts(): UserProfile[] {
  if (typeof window === 'undefined') {
    return [DEFAULT_DEMO_USER];
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      const defaultAccounts = [DEFAULT_DEMO_USER];
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCOUNTS, JSON.stringify(defaultAccounts));
      return defaultAccounts;
    }
    const accounts = JSON.parse(raw);
    if (!Array.isArray(accounts) || accounts.length === 0) {
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCOUNTS, JSON.stringify([DEFAULT_DEMO_USER]));
      return [DEFAULT_DEMO_USER];
    }
    return accounts;
  } catch (err) {
    console.error('Failed to read accounts from localStorage', err);
    return [DEFAULT_DEMO_USER];
  }
}

export function saveAccount(account: UserProfile): void {
  if (typeof window === 'undefined') return;

  try {
    const accounts = getStoredAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.email.toLowerCase() === account.email.toLowerCase()
    );

    if (existingIndex >= 0) {
      accounts[existingIndex] = { ...accounts[existingIndex], ...account };
    } else {
      accounts.push(account);
    }

    localStorage.setItem(AUTH_STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save account to localStorage', err);
  }
}

export function findAccountByEmail(email: string): UserProfile | undefined {
  const accounts = getStoredAccounts();
  return accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
}

export function getActiveCustomer(): { user: UserProfile; isLoggedIn: boolean } {
  if (typeof window === 'undefined') {
    return { user: DEFAULT_DEMO_USER, isLoggedIn: true };
  }

  try {
    const isLoggedInStr = localStorage.getItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN);
    const activeEmail = localStorage.getItem(AUTH_STORAGE_KEYS.ACTIVE_EMAIL);

    if (isLoggedInStr === 'false') {
      return { user: GUEST_USER, isLoggedIn: false };
    }

    if (activeEmail) {
      const matched = findAccountByEmail(activeEmail);
      if (matched) {
        return { user: matched, isLoggedIn: true };
      }
    }

    // Default to Eleanor if no explicit preference set yet
    if (isLoggedInStr === null) {
      localStorage.setItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(AUTH_STORAGE_KEYS.ACTIVE_EMAIL, DEFAULT_DEMO_USER.email);
      return { user: DEFAULT_DEMO_USER, isLoggedIn: true };
    }

    return { user: GUEST_USER, isLoggedIn: false };
  } catch {
    return { user: DEFAULT_DEMO_USER, isLoggedIn: true };
  }
}

export function setActiveCustomerSession(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;

  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN, 'true');
      localStorage.setItem(AUTH_STORAGE_KEYS.ACTIVE_EMAIL, user.email);
    } else {
      localStorage.setItem(AUTH_STORAGE_KEYS.IS_LOGGED_IN, 'false');
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACTIVE_EMAIL);
    }
  } catch (err) {
    console.error('Failed to set active customer session', err);
  }
}

export function generateInitialsAvatar(name: string): string {
  const safeName = encodeURIComponent(name.trim() || 'Judes Shopper');
  return `https://ui-avatars.com/api/?name=${safeName}&background=0066FF&color=fff&bold=true&size=128`;
}

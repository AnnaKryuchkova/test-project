import type { AuthTokens } from '../../entities/auth/model/types';

const STORAGE_KEY = 'auth_tokens';

type StorageKind = 'session' | 'local';

function getStorage(kind: StorageKind): Storage {
  return kind === 'session' ? window.sessionStorage : window.localStorage;
}

export function saveTokens(tokens: AuthTokens, persistent: boolean): void {
  const kind: StorageKind = persistent ? 'local' : 'session';
  const storage = getStorage(kind);
  storage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  const otherStorage = getStorage(persistent ? 'session' : 'local');
  otherStorage.removeItem(STORAGE_KEY);
}

export function loadTokens(): { tokens: AuthTokens | null; persistent: boolean } {
  try {
    const sessionValue = window.sessionStorage.getItem(STORAGE_KEY);
    if (sessionValue) {
      return { tokens: JSON.parse(sessionValue) as AuthTokens, persistent: false };
    }

    const localValue = window.localStorage.getItem(STORAGE_KEY);
    if (localValue) {
      return { tokens: JSON.parse(localValue) as AuthTokens, persistent: true };
    }

    return { tokens: null, persistent: false };
  } catch {
    return { tokens: null, persistent: false };
  }
}

export function clearTokens(): void {
  window.sessionStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(STORAGE_KEY);
}


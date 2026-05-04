import { useCallback, useState } from 'react';

const isQuotaError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  return (
    error.name === 'QuotaExceededError' ||
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
    /quota/i.test(error.message)
  );
};

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((currentValue) => {
      const valueToStore = value instanceof Function ? value(currentValue) : value;
      // Persist to localStorage outside of state-derivation; never throw from updater.
      try {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        if (isQuotaError(error)) {
          // Best-effort: drop this cache entry so future writes don't keep failing.
          try {
            window.localStorage.removeItem(key);
          } catch {
            // ignore
          }
          console.warn(`localStorage quota exceeded for key "${key}"; cache disabled for this session.`);
        } else {
          console.error(`Error setting localStorage key "${key}":`, error);
        }
      }
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue];
}

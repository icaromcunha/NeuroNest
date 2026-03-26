/**
 * Storage helper functions for local persistence
 */

export const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage: ${key}`, error);
  }
};

export const loadFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading from storage: ${key}`, error);
    return null;
  }
};

export const STORAGE_KEYS = {
  PHRASES: 'neurocalm_phrases',
  TASKS: 'neurocalm_tasks',
  LAST_PAUSE_STATE: 'neurocalm_last_pause',
};

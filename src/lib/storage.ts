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
  PHRASES: 'tea_toolkit_phrases',
  TASKS: 'tea_toolkit_tasks',
  LAST_PAUSE_STATE: 'tea_toolkit_last_pause',
};

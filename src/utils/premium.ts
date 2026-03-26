import { saveToStorage, loadFromStorage } from './storage';

const PREMIUM_KEY = 'neurocalm_premium_status';

export const isUserPremium = (): boolean => {
  return loadFromStorage(PREMIUM_KEY) === true;
};

export const unlockPremium = (): void => {
  saveToStorage(PREMIUM_KEY, true);
};

export const resetPremium = (): void => {
  saveToStorage(PREMIUM_KEY, false);
};

import { REMEMBER_ME_STORAGE_KEY } from '#/constants/storage';

export const readRememberedUsername = (): string =>
  window.localStorage.getItem(REMEMBER_ME_STORAGE_KEY) ?? '';

/**
 * Stores `username` under REMEMBER_ME_STORAGE_KEY for the next login, or
 * removes the stored one when `username` is empty.
 */
export const writeRememberedUsername = (username?: string): void => {
  if (username) {
    window.localStorage.setItem(REMEMBER_ME_STORAGE_KEY, username);
    return;
  }

  window.localStorage.removeItem(REMEMBER_ME_STORAGE_KEY);
};

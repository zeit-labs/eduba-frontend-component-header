import { useState, useCallback } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────

const COOKIE_NAME = 'openedx-language-preference';
const LANGUAGES = { AR: 'ar', EN: 'en' };
const DEFAULT_LANG = LANGUAGES.AR;
const COOKIE_EXPIRES_DAYS = 365;

const RTL_LANGUAGES = new Set(['ar']);

// ─── Document direction ───────────────────────────────────────────────────────

/**
 * Applies the correct `dir` and `lang` attributes to <html> for the given locale.
 * Called eagerly on initial load (before first render) to prevent a flash of
 * wrong directionality, and again before every page reload for consistency.
 */
function applyDocumentDirection(lang) {
  const root = document.documentElement;
  root.dir = RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr';
  root.lang = lang;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

/**
 * Returns the parent domain with a leading dot so the cookie is shared across
 * all subdomains — matching how the OpenEdX platform sets this cookie.
 * e.g. apps.local.openedx.io → .local.openedx.io
 */
function getParentDomain() {
  const parts = window.location.hostname.split('.');
  return parts.length > 2 ? `.${parts.slice(1).join('.')}` : window.location.hostname;
}

function readCookie(name) {
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function writeCookie(name, value) {
  const parentDomain = getParentDomain();
  const past = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';

  // Expire every known variant (different domain/path combos the platform may have set)
  [parentDomain, window.location.hostname].forEach((domain) => {
    ['/', '/ar', '/en'].forEach((path) => {
      document.cookie = `${name}=;${past};path=${path};domain=${domain}`;
    });
  });

  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_EXPIRES_DAYS);

  // Write a single canonical cookie on the parent domain — same as the platform
  document.cookie = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    `domain=${parentDomain}`,
    'SameSite=Lax',
  ].join(';');
}

/**
 * Pure helper — safe to call outside React (e.g. during provider setup).
 * Returns the validated language stored in the cookie, or the default.
 */
export function getLanguageFromCookie() {
  const saved = readCookie(COOKIE_NAME);
  return Object.values(LANGUAGES).includes(saved) ? saved : DEFAULT_LANG;
}

function resolveInitialLanguage() {
  const saved = readCookie(COOKIE_NAME);

  // Cookie doesn't exist → create it with the default language
  if (!saved) {
    writeCookie(COOKIE_NAME, DEFAULT_LANG);
    applyDocumentDirection(DEFAULT_LANG);
    return DEFAULT_LANG;
  }

  // Cookie exists but has an unexpected value → reset it
  if (!Object.values(LANGUAGES).includes(saved)) {
    writeCookie(COOKIE_NAME, DEFAULT_LANG);
    applyDocumentDirection(DEFAULT_LANG);
    return DEFAULT_LANG;
  }

  applyDocumentDirection(saved);
  return saved;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * Manages the UI language via the `openedx-language-preference` cookie.
 *
 * - On first load: creates the cookie with `ar` if it doesn't exist.
 * - `switchLanguage(lang)`: switches to a specific language.
 * - `toggleLanguage()`: flips between `ar` ↔ `en`.
 * - After every switch the page reloads so the platform picks up the new locale.
 */
function useLanguageSwitcher() {
  const [language, setLanguage] = useState(resolveInitialLanguage);

  const switchLanguage = useCallback((lang) => {
    if (!Object.values(LANGUAGES).includes(lang) || lang === language) {
      return;
    }
    writeCookie(COOKIE_NAME, lang);
    applyDocumentDirection(lang);
    setLanguage(lang);
    window.location.reload();
  }, [language]);

  const toggleLanguage = useCallback(() => {
    switchLanguage(language === LANGUAGES.AR ? LANGUAGES.EN : LANGUAGES.AR);
  }, [language, switchLanguage]);

  return {
    language,
    switchLanguage,
    toggleLanguage,
    isArabic: language === LANGUAGES.AR,
    isEnglish: language === LANGUAGES.EN,
  };
}

export default useLanguageSwitcher;

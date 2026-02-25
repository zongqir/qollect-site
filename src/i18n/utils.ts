import { zhCN } from './zh-CN';
import { enUS } from './en-US';

const translations = {
  'zh-CN': zhCN,
  'en': enUS,
} as const;

type Locale = keyof typeof translations;

const BASE = import.meta.env.BASE_URL;

export function getLangFromUrl(url: URL): Locale {
  const path = url.pathname;
  if (path.startsWith(`${BASE}en`)) return 'en';
  return 'zh-CN';
}

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T & string]: T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K }[keyof T & string]
  : never;

type TranslationKey = NestedKeyOf<typeof zhCN>;

function getNestedValue(obj: Record<string, any>, path: string): string {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) as string ?? path;
}

export function useTranslations(url: URL) {
  const lang = getLangFromUrl(url);
  const dict = translations[lang];
  return function t(key: TranslationKey): string {
    return getNestedValue(dict as Record<string, any>, key);
  };
}

export function getAlternateUrl(url: URL): string {
  const lang = getLangFromUrl(url);
  if (lang === 'zh-CN') return `${BASE}en`;
  return BASE;
}

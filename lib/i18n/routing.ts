// Simple placeholder for i18n routing
export type Locale = 'en';

export const routing = {
  locales: ['en'] as Locale[]
};

export function getPathname({ href, locale }: { href: string; locale: Locale }): string {
  return href;
}

import type { ScoreRequest } from './types';

export function normalizeWebsite(value: string) {
  const raw = value.trim();
  const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.')) throw new Error('Enter a valid company website.');
  url.hash = ''; url.search = ''; url.pathname = '/';
  return { url: url.toString(), domain: url.hostname.toLowerCase().replace(/^www\./, '') };
}

export function validateScoreRequest(input: unknown): ScoreRequest & { normalizedDomain: string } {
  const value = (input || {}) as Record<string, unknown>;
  const companyName = String(value.companyName || '').trim().replace(/\s+/g, ' ');
  if (companyName.length < 2 || companyName.length > 100) throw new Error('Enter a company or brand name.');
  const website = normalizeWebsite(String(value.website || ''));
  const clean = (field: string, max: number) => String(value[field] || '').trim().replace(/\s+/g, ' ').slice(0, max) || undefined;
  return { companyName, website: website.url, normalizedDomain: website.domain, competitor: clean('competitor', 100), industry: clean('industry', 100), turnstileToken: clean('turnstileToken', 2048), attribution: typeof value.attribution === 'object' && value.attribution ? value.attribution as Record<string, string> : undefined };
}

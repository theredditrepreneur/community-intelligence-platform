import { createHmac } from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { freeScoreServerConfig } from './config';

const localEvents = new Map<string, number[]>();
function hmac(value: string) { const secret = process.env.RATE_LIMIT_HMAC_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-rate-limit-secret'); if (!secret) throw new Error('Rate-limit protection is unavailable.'); return createHmac('sha256', secret).update(value).digest('hex'); }
export function requestIp(request: Request) { return (request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown').trim(); }
export async function enforceFreeScoreRateLimit(request: Request, domain: string) {
  const ipHmac = hmac(requestIp(request)); const domainHmac = hmac(domain); const since = new Date(Date.now() - 7 * 86400000).toISOString();
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    const admin = createSupabaseAdminClient(); const { count } = await admin.from('free_score_abuse_events').select('*', { count: 'exact', head: true }).eq('ip_hmac', ipHmac).gte('created_at', since);
    if ((count || 0) >= freeScoreServerConfig.anonymousLimit) throw new Error('This score request cannot be completed right now. Please try again later.');
    await admin.from('free_score_abuse_events').insert({ ip_hmac: ipHmac, domain_hmac: domainHmac, event_code: 'score_requested', expires_at: new Date(Date.now() + 7 * 86400000).toISOString() }); return;
  }
  const now = Date.now(); const recent = (localEvents.get(ipHmac) || []).filter((time) => now - time < 86400000);
  if (recent.length >= freeScoreServerConfig.anonymousLimit) throw new Error('This score request cannot be completed right now. Please try again later.'); localEvents.set(ipHmac, [...recent, now]);
}

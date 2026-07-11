import { freeScorePublicConfig } from './config';
export async function verifyTurnstile(token: string | undefined, remoteIp?: string) {
  if (!freeScorePublicConfig.turnstileEnabled) return;
  if (!token || !process.env.TURNSTILE_SECRET_KEY) throw new Error('This score request could not be verified. Please try again.');
  const body = new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }); if (remoteIp && remoteIp !== 'unknown') body.set('remoteip', remoteIp);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body, signal: AbortSignal.timeout(8000) });
  const result = await response.json() as { success?: boolean }; if (!result.success) throw new Error('This score request could not be verified. Please try again.');
}

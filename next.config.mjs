/** @type {import('next').NextConfig} */
const allowedFrames = (process.env.FREE_SCORE_ALLOWED_FRAME_ORIGINS || 'https://theredditrepreneur.com https://www.theredditrepreneur.com').trim();
const nextConfig = { async headers() { return [{ source: '/free-score/embed', headers: [
  { key: 'Content-Security-Policy', value: `frame-ancestors ${allowedFrames}; base-uri 'self'; form-action 'self'` },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }, { key: 'X-Content-Type-Options', value: 'nosniff' },
] }]; } };

export default nextConfig;

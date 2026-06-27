import Stripe from 'stripe';

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set.');
  }

  return new Stripe(secretKey);
}

export function getAppUrl(requestUrl?: string) {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL;
  const fallback = requestUrl ? new URL(requestUrl).origin : 'http://localhost:3000';
  return (fromEnv || fallback).replace(/\/$/, '');
}

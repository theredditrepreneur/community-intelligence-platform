'use client';

import { useEffect, useState } from 'react';

type ResumeCheckoutProps = {
  plan: 'analyse' | 'discover';
};

export function ResumeCheckout({ plan }: ResumeCheckoutProps) {
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function startCheckout() {
      try {
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ plan }),
        });

        const data = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || !data.url) {
          throw new Error(data.error || 'Unable to resume checkout.');
        }

        if (!cancelled) {
          window.location.assign(data.url);
        }
      } catch (checkoutError) {
        if (!cancelled) {
          setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to resume checkout.');
        }
      }
    }

    startCheckout();

    return () => {
      cancelled = true;
    };
  }, [plan]);

  return (
    <main className="public-main checkout-page">
      <section className="panel checkout-panel">
        <div className="eyebrow">Checkout</div>
        <h1>Opening secure checkout...</h1>
        <p>{error || 'Preparing your Stripe checkout session.'}</p>
      </section>
    </main>
  );
}

'use client';

import { useState } from 'react';

type CheckoutButtonProps = {
  plan: 'analyse' | 'discover';
  children: string;
};

export function CheckoutButton({ plan, children }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function startCheckout() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Unable to start checkout.');
      }

      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Unable to start checkout.');
      setIsLoading(false);
    }
  }

  return (
    <div className="checkout-button-wrap">
      <button className="btn btn-primary btn-orange" type="button" onClick={startCheckout} disabled={isLoading}>
        {isLoading ? 'Opening Stripe...' : children}
      </button>
      {error ? <p className="checkout-error">{error}</p> : null}
    </div>
  );
}

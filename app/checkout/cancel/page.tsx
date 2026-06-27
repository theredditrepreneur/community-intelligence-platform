import { Button } from '@/components/ui/Button';

export default function CheckoutCancelPage() {
  return (
    <main className="public-main checkout-page">
      <section className="panel checkout-panel">
        <div className="eyebrow">Checkout Cancelled</div>
        <h1>No payment was taken.</h1>
        <p>You can return to pricing whenever you are ready to activate Analyse or Discover.</p>
        <div className="account-actions">
          <Button href="/pricing">Back to pricing</Button>
        </div>
      </section>
    </main>
  );
}

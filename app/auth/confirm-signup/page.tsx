import { Button } from '@/components/ui/Button';
import { platform } from '@/lib/config/platform';

export default function ConfirmSignupPage() {
  return (
    <main className="confirm-signup-page">
      <section className="confirm-signup-card">
        <div className="confirm-accent" />
        <div className="eyebrow">Account confirmation</div>
        <h1>Confirm your email address</h1>
        <p className="confirm-subhead">
          We&apos;ve sent a confirmation link to your email. Please click the link to activate your account and access The Redditrepreneur Community Intelligence Platform.
        </p>
        <p>
          Once confirmed, you&apos;ll be able to log in and start using your subscription.
        </p>
        <p className="confirm-note">
          If you don&apos;t see the email, check your spam or promotions folder.
        </p>
        <div className="confirm-actions">
          <Button href="/login" variant="secondary">Back to Login</Button>
          <Button href="/pricing" variant="orange">Go to Pricing</Button>
        </div>
        <small>{platform.tagline}</small>
      </section>
    </main>
  );
}

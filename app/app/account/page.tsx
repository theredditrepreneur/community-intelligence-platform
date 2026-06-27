import { currentUser } from '@clerk/nextjs/server';
import { Button } from '@/components/ui/Button';

export default async function AccountPage() {
  const user = await currentUser();
  const name = user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Your account';
  const email = user?.primaryEmailAddress?.emailAddress || 'No primary email added yet';

  return (
    <>
      <section className="hero account-hero">
        <div className="eyebrow">Account</div>
        <h1>{name}</h1>
        <p>Manage your Redditrepreneur account, profile details and billing access from one calm place.</p>
      </section>

      <section className="panel account-panel">
        <div className="account-summary">
          <span className="account-avatar large">{name.charAt(0).toUpperCase()}</span>
          <div>
            <h2>Account overview</h2>
            <p>{email}</p>
          </div>
        </div>
        <div className="account-actions">
          <Button href="/app/profile" variant="secondary">Edit profile</Button>
          <Button href="/app/billing" variant="secondary">Billing</Button>
        </div>
      </section>
    </>
  );
}

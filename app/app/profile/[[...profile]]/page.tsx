import { UserProfile } from '@clerk/nextjs';

export default function ProfilePage() {
  return (
    <>
      <section className="hero account-hero">
        <div className="eyebrow">Profile</div>
        <h1>User Profile</h1>
        <p>Update your personal details, security settings and connected sign in methods.</p>
      </section>

      <section className="profile-shell">
        <UserProfile routing="path" path="/app/profile" />
      </section>
    </>
  );
}

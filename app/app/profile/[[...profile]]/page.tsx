import { updateProfile } from '@/lib/auth-actions';
import { getCurrentUser } from '@/lib/supabase/server';

export default async function ProfilePage({ searchParams }: { searchParams: { error?: string } }) {
  const user = await getCurrentUser();
  const fullName = typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : '';

  return (
    <>
      <section className="hero account-hero">
        <div className="eyebrow">Profile</div>
        <h1>User profile</h1>
        <p>Update your personal details, security settings and connected sign in methods.</p>
      </section>

      <section className="profile-shell">
        <form className="panel profile-form" action={updateProfile}>
          {searchParams.error ? <p className="checkout-error">{searchParams.error}</p> : null}
          <label>
            Name
            <input name="fullName" type="text" autoComplete="name" defaultValue={fullName} required />
          </label>
          <label>
            Email
            <input type="email" value={user?.email || ''} disabled />
          </label>
          <button className="btn btn-primary" type="submit">Save profile</button>
        </form>
      </section>
    </>
  );
}

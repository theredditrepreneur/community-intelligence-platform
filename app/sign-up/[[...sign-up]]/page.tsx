import { signUp } from '@/lib/auth-actions';

export default function SignUpPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="auth-page">
      <form className="auth-card" action={signUp}>
        <div>
          <div className="eyebrow">Start analysing</div>
          <h1>Create account</h1>
          <p>Set up your Redditrepreneur workspace.</p>
        </div>
        {searchParams.error ? <p className="checkout-error">{searchParams.error}</p> : null}
        <label>
          Name
          <input name="fullName" type="text" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <button className="btn btn-primary" type="submit">Create account</button>
        <a className="auth-link-text" href="/sign-in">Sign in instead</a>
      </form>
    </main>
  );
}

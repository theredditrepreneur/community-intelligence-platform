import { signIn } from '@/lib/auth-actions';

export default function SignInPage({ searchParams }: { searchParams: { confirmed?: string; error?: string; message?: string } }) {
  return (
    <main className="auth-page">
      <form className="auth-card" action={signIn}>
        <div>
          <div className="eyebrow">Welcome back</div>
          <h1>Sign in</h1>
          <p>Open your Community Intelligence workspace.</p>
        </div>
        {searchParams.confirmed ? <p className="auth-success">Email confirmed. You can sign in now.</p> : null}
        {searchParams.message ? <p className="auth-success">{searchParams.message}</p> : null}
        {searchParams.error ? <p className="checkout-error">{searchParams.error}</p> : null}
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button className="btn btn-primary" type="submit">Sign in</button>
        <a className="auth-link-text" href="/sign-up">Create an account</a>
      </form>
    </main>
  );
}

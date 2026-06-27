import { SignIn } from '@clerk/nextjs';

export default function SignInPage({ searchParams }: { searchParams: { redirect_url?: string } }) {
  const redirectUrl = searchParams.redirect_url || '/app/analyse';
  const encodedRedirect = encodeURIComponent(redirectUrl);

  return (
    <main className="auth-page">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl={'/sign-up?redirect_url=' + encodedRedirect}
        fallbackRedirectUrl={redirectUrl}
        forceRedirectUrl={redirectUrl}
      />
    </main>
  );
}

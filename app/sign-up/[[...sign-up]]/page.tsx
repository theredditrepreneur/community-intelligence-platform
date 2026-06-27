import { SignUp } from '@clerk/nextjs';

export default function SignUpPage({ searchParams }: { searchParams: { redirect_url?: string } }) {
  const redirectUrl = searchParams.redirect_url || '/app/analyse';
  const encodedRedirect = encodeURIComponent(redirectUrl);

  return (
    <main className="auth-page">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl={'/sign-in?redirect_url=' + encodedRedirect}
        fallbackRedirectUrl={redirectUrl}
        forceRedirectUrl={redirectUrl}
      />
    </main>
  );
}

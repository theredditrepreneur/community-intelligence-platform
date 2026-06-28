import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ResumeCheckout } from '@/components/checkout/ResumeCheckout';
import { isPaidPlan, pendingCheckoutCookie } from '@/lib/subscription';

export default function CheckoutResumePage() {
  const plan = cookies().get(pendingCheckoutCookie)?.value;

  if (!isPaidPlan(plan)) {
    redirect('/pricing');
  }

  return <ResumeCheckout plan={plan} />;
}

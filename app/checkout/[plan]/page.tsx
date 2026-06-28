import { redirect } from 'next/navigation';
import { ResumeCheckout } from '@/components/checkout/ResumeCheckout';
import type { PaidPlan } from '@/lib/config/subscriptions';

function isPaidPlan(value: string): value is PaidPlan {
  return value === 'analyse' || value === 'discover';
}

export default function CheckoutPlanPage({ params }: { params: { plan: string } }) {
  if (!isPaidPlan(params.plan)) {
    redirect('/pricing');
  }

  return <ResumeCheckout plan={params.plan} />;
}

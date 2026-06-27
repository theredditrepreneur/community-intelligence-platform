import { redirect } from 'next/navigation';
import type { PaidPlan } from '@/lib/config/subscriptions';

function isPaidPlan(value: string): value is PaidPlan {
  return value === 'analyse' || value === 'discover';
}

export default function CheckoutPlanPage({ params }: { params: { plan: string } }) {
  if (!isPaidPlan(params.plan)) {
    redirect('/pricing');
  }

  redirect('/api/stripe/checkout?plan=' + params.plan);
}

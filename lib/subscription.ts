import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { clerkBillingPlans, type ClerkBillingPlan, type SubscriptionLabel } from '@/lib/config/clerk-billing';

async function getPlanChecker() {
  const { has } = await auth();
  return has;
}

export async function hasClerkPlan(plan: ClerkBillingPlan) {
  const has = await getPlanChecker();
  const clerkPlan = clerkBillingPlans[plan];

  return has({ plan: clerkPlan.id }) || has({ plan: clerkPlan.slug });
}

export async function hasPlanAccess(requiredPlan: ClerkBillingPlan) {
  const hasAnalyse = await hasClerkPlan('analyse');
  const hasDiscover = await hasClerkPlan('discover');

  if (requiredPlan === 'analyse') {
    return hasAnalyse || hasDiscover;
  }

  return hasDiscover;
}

export async function getSubscriptionLabel(): Promise<SubscriptionLabel> {
  if (await hasClerkPlan('discover')) return 'Discover';
  if (await hasClerkPlan('analyse')) return 'Analyse';
  return 'Free';
}

export async function requirePlan(requiredPlan: ClerkBillingPlan) {
  if (!(await hasPlanAccess(requiredPlan))) {
    redirect('/pricing?upgrade=' + requiredPlan);
  }
}

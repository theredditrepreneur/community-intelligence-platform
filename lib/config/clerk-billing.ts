export const clerkBillingPlans = {
  analyse: {
    id: 'cplan_3Fk4IrOj7iuX7UmUb7xq4G4Y4hd',
    slug: 'analyse',
    label: 'Analyse',
  },
  discover: {
    id: 'cplan_3Fk4cNt8B4mcoYPxl0BiWMY08Al',
    slug: 'discover',
    label: 'Discover',
  },
} as const;

export type ClerkBillingPlan = keyof typeof clerkBillingPlans;
export type SubscriptionLabel = 'Free' | 'Analyse' | 'Discover';

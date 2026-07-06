export type WorkspaceId = 'dashboard' | 'analyse' | 'discover' | 'briefs' | 'alerts' | 'billing' | 'settings';

export const navigation = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: '', href: '/app/dashboard', description: 'Your workspace.', accent: 'blue' },
  { id: 'briefs' as const, label: 'Briefs', icon: '', href: '/app/briefs', description: 'Create action-ready docs.', accent: 'blue' },
  { id: 'analyse' as const, label: 'Analyse', icon: '', href: '/app/analyse', description: 'Understand conversations.', accent: 'blue' },
  { id: 'discover' as const, label: 'Discover', icon: '', href: '/app/discover', description: 'Find opportunities.', accent: 'orange' },
  { id: 'alerts' as const, label: 'Alerts', icon: '', href: '/app/alerts', description: 'Stay ahead.', accent: 'green' },
  { id: 'billing' as const, label: 'Billing', icon: '', href: '/app/billing', description: 'Manage subscription.', accent: 'orange' },
  { id: 'settings' as const, label: 'Settings', icon: '', href: '/app/settings', description: 'Account preferences.', accent: 'green' },
];

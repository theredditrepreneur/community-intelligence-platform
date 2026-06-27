export type WorkspaceId = 'analyse' | 'discover' | 'alerts';

export const navigation = [
  { id: 'analyse' as const, label: 'Analyse', icon: '🔍', href: '/app/analyse', description: 'Understand conversations.', accent: 'blue' },
  { id: 'discover' as const, label: 'Discover', icon: '🧭', href: '/app/discover', description: 'Find opportunities.', accent: 'orange' },
  { id: 'alerts' as const, label: 'Alerts', icon: '🚨', href: '/app/alerts', description: 'Stay ahead.', accent: 'green' },
];

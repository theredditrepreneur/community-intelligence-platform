import type { User } from '@supabase/supabase-js';

export type UserRole = 'customer' | 'admin';

const founderAdminEmail = 'theredditrepreneur@gmail.com';

export function isAdminUser(user?: Pick<User, 'email'> | null, role?: string | null) {
  const email = user?.email?.trim().toLowerCase();

  return email === founderAdminEmail && (role === 'admin' || role === 'customer' || !role);
}

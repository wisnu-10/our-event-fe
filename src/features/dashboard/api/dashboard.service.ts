import { api } from '@/lib/api-client';
import type { DashboardStats } from '@/features/dashboard/types';

export async function getStats(): Promise<DashboardStats> {
  return api.get<DashboardStats>('/dashboard/stats');
}

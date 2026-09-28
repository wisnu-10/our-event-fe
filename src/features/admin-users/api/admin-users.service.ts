import { api } from '@/lib/api-client';
import type { UserRole } from '@/features/auth/types';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface ListResponse {
  users: ManagedUser[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export async function listManagedUsers(params?: {
  role?: 'ADMIN' | 'CUSTOMER';
  search?: string;
}): Promise<ListResponse> {
  const search = new URLSearchParams();
  if (params?.role) search.set('role', params.role);
  if (params?.search) search.set('search', params.search);
  const qs = search.toString();
  return api.get<ListResponse>(`/admin/users${qs ? `?${qs}` : ''}`);
}

export async function createManagedUser(input: {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CUSTOMER';
}): Promise<{ user: ManagedUser }> {
  return api.post<{ user: ManagedUser }>('/admin/users', input);
}

export async function updateManagedUserRole(
  id: string,
  role: 'ADMIN' | 'CUSTOMER',
): Promise<{ user: ManagedUser }> {
  return api.patch<{ user: ManagedUser }>(`/admin/users/${id}/role`, { role });
}

export async function deleteManagedUser(id: string): Promise<{ ok: boolean }> {
  return api.delete<{ ok: boolean }>(`/admin/users/${id}`);
}

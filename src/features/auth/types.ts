export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'CUSTOMER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

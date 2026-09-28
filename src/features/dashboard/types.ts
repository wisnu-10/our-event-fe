export interface DashboardStats {
  totalEvents: number;
  ordersByStatus: Record<string, number>;
  revenue: string;
}

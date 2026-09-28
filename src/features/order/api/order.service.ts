import { api } from '@/lib/api-client';
import type { OrderItem, OrderListResponse } from '@/features/order/types';

export async function createOrder(eventId: string, quantity: number): Promise<OrderItem> {
  return api.post<OrderItem>('/orders', { eventId, quantity });
}

export async function getMyOrders(status?: string): Promise<OrderListResponse> {
  const q = status ? `?status=${status}` : '';
  return api.get<OrderListResponse>(`/orders/my${q}`);
}

export async function getOrderDetail(orderCode: string): Promise<OrderItem> {
  return api.get<OrderItem>(`/orders/${orderCode}`);
}

export async function uploadProof(orderCode: string, file: File): Promise<OrderItem> {
  const form = new FormData();
  form.append('proof', file);
  return api.postForm<OrderItem>(`/orders/${orderCode}/proof`, form);
}

export async function cancelOrder(orderCode: string): Promise<OrderItem> {
  return api.patch<OrderItem>(`/orders/${orderCode}/cancel`);
}

export async function getAllOrders(filter: { status?: string; eventId?: string } = {}): Promise<OrderListResponse> {
  const p = new URLSearchParams();
  if (filter.status) p.set('status', filter.status);
  if (filter.eventId) p.set('eventId', filter.eventId);
  const q = p.toString();
  return api.get<OrderListResponse>(`/orders${q ? `?${q}` : ''}`);
}

export async function approveOrder(orderCode: string): Promise<OrderItem> {
  return api.patch<OrderItem>(`/orders/${orderCode}/approve`);
}

export async function rejectOrder(orderCode: string, rejectionNote: string): Promise<OrderItem> {
  return api.patch<OrderItem>(`/orders/${orderCode}/reject`, { rejectionNote });
}

import type { EventItem } from '@/features/event/types';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'WAITING_CONFIRMATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface TicketItem {
  id: string;
  ticketCode: string;
  orderId: string;
  qrCodeUrl: string | null;
  isUsed: boolean;
}

export interface OrderItem {
  id: string;
  orderCode: string;
  quantity: number;
  totalPrice: string;
  status: OrderStatus;
  proofImageUrl: string | null;
  rejectionNote: string | null;
  expiresAt: string;
  createdAt: string;
  event: EventItem;
  user?: { id: string; name: string; email: string };
  tickets?: TicketItem[];
}

export interface OrderListResponse {
  items: OrderItem[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

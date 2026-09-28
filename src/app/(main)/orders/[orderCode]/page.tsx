'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { getOrderDetail } from '@/features/order/api/order.service';
import type { OrderItem } from '@/features/order/types';
import { TicketCard } from '@/features/ticket/components/TicketCard';
import { formatRupiah } from '@/utils/format';
import { ApiError } from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';
import { Steps } from '@/components/ui/Steps';
import { Card } from '@/components/ui/Card';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';

const ALUR = ['Pilih tiket', 'Bayar', 'Terima tiket'];

export default function OrderDetailPage({ params }: { params: Promise<{ orderCode: string }> }) {
  const { orderCode } = use(params);
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrderDetail(orderCode)
      .then(setOrder)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Order tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [orderCode]);

  if (loading) return <LoadingState label="Memuat order" />;
  if (error || !order)
    return (
      <EmptyState ikon="🧾" judul="Order tidak ditemukan" deskripsi={error || ''} />
    );

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <Steps langkah={ALUR} aktif={order.status === 'APPROVED' ? 2 : 1} />
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-xl font-bold">{order.orderCode}</h1>
        <Badge status={order.status} />
      </div>
      <Card>
        <p className="font-display text-lg font-bold">{order.event.title}</p>
        <p className="text-sm text-tinta-soft">{order.event.location}</p>
        <div className="perforasi-x my-3 opacity-70" aria-hidden />
        <p className="text-sm">
          {order.quantity} tiket • Total{' '}
          <span className="font-display text-lg font-bold text-panggung-deep">
            {formatRupiah(order.totalPrice)}
          </span>
        </p>
      </Card>
      {order.status === 'REJECTED' && order.rejectionNote && (
        <Card className="!border-bara/30 !bg-bara-soft text-sm">
          <p className="font-bold text-bara">Ditolak: {order.rejectionNote}</p>
        </Card>
      )}
      {order.status === 'APPROVED' && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display font-bold">Tiketmu ({order.tickets?.length ?? 0})</h2>
          {order.tickets?.map((t) => <TicketCard key={t.id} ticket={t} />)}
        </div>
      )}
      {(order.status === 'PENDING_PAYMENT' || order.status === 'REJECTED') && (
        <Link
          href={`/orders/${order.orderCode}/payment`}
          className="w-fit rounded-xl bg-panggung px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-panggung-deep"
        >
          Lanjut bayar →
        </Link>
      )}
    </div>
  );
}

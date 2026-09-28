'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyOrders } from '@/features/order/api/order.service';
import type { OrderListResponse, OrderStatus } from '@/features/order/types';
import { formatRupiah } from '@/utils/format';
import { ApiError } from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';
import { DateBlock } from '@/components/ui/DateBlock';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';

const STATUSES: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'Semua' },
  { value: 'PENDING_PAYMENT', label: 'Belum bayar' },
  { value: 'WAITING_CONFIRMATION', label: 'Diverifikasi' },
  { value: 'APPROVED', label: 'Disetujui' },
  { value: 'REJECTED', label: 'Ditolak' },
  { value: 'EXPIRED', label: 'Kedaluwarsa' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

export default function MyOrdersPage() {
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [data, setData] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getMyOrders(status || undefined)
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Gagal memuat order'))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-3xl font-bold tracking-tight">Tiket saya</h1>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Saring berdasar status">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            aria-pressed={status === s.value}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              status === s.value
                ? 'bg-tinta text-white'
                : 'border border-garis bg-kartu text-tinta-soft hover:border-panggung hover:text-panggung-deep'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {loading && (
        <div className="grid gap-3">
          <LoadingState label="Memuat order" />
        </div>
      )}
      {error && <p className="font-medium text-bara">{error}</p>}
      {data && data.items.length === 0 && (
        <EmptyState
          ikon="🎟️"
          judul={status ? 'Tidak ada order berstatus ini' : 'Belum ada order'}
          deskripsi="Yuk cari event seru dan amankan tiketmu sebelum kehabisan."
          aksi={
            <Link href="/" className="font-semibold text-panggung hover:underline">
              Jelajahi event →
            </Link>
          }
        />
      )}
      <div className="grid gap-3">
        {data?.items.map((o) => (
          <Link
            key={o.id}
            href={`/orders/${o.orderCode}`}
            className="flex items-center gap-4 rounded-2xl border border-garis bg-kartu p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-16px_rgba(91,61,245,0.4)]"
          >
            <DateBlock value={o.event.startDate} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-semibold text-tinta-faint">{o.orderCode}</p>
              <p className="truncate font-bold">
                {o.event.title} • {o.quantity} tiket • {formatRupiah(o.totalPrice)}
              </p>
            </div>
            <Badge status={o.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

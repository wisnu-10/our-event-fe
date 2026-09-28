'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllOrders } from '@/features/order/api/order.service';
import type { OrderListResponse } from '@/features/order/types';
import { ApiError } from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';
import { DateBlock } from '@/components/ui/DateBlock';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';
import { formatRupiah } from '@/utils/format';

export default function AdminOrdersPage() {
  const [status, setStatus] = useState('WAITING_CONFIRMATION');
  const [data, setData] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllOrders({ status: status || undefined })
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Gagal memuat pesanan'))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-panggung uppercase">Kasir</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Pesanan masuk</h1>
      </div>
      <select
        className="field w-fit cursor-pointer"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label="Saring berdasar status"
      >
        <option value="">Semua status</option>
        <option value="WAITING_CONFIRMATION">Menunggu verifikasi</option>
        <option value="PENDING_PAYMENT">Belum bayar</option>
        <option value="APPROVED">Disetujui</option>
        <option value="REJECTED">Ditolak</option>
        <option value="EXPIRED">Kedaluwarsa</option>
        <option value="CANCELLED">Dibatalkan</option>
      </select>
      {error && <p className="font-medium text-bara">{error}</p>}
      {loading && <LoadingState label="Memuat pesanan" />}
      {!loading && data && data.items.length === 0 && (
        <EmptyState
          ikon="🧾"
          judul="Tidak ada pesanan di sini"
          deskripsi="Coba pilih status lain, atau tunggu pembeli berdatangan."
        />
      )}
      <div className="grid gap-3">
        {data?.items.map((o) => (
          <Link
            key={o.id}
            href={`/dashboard/orders/${o.orderCode}`}
            className="flex items-center gap-4 rounded-2xl border border-garis bg-kartu p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-16px_rgba(91,61,245,0.4)]"
          >
            <DateBlock value={o.createdAt} />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-mono text-xs font-semibold text-tinta-faint">{o.orderCode}</p>
              <p className="truncate font-bold">
                {o.event.title} • {o.user ? `${o.user.name}` : ''} • {o.quantity} tiket •{' '}
                {formatRupiah(o.totalPrice)}
              </p>
            </div>
            <Badge status={o.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}

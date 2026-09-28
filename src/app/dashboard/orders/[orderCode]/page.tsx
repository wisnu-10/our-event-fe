'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveOrder, getOrderDetail, rejectOrder } from '@/features/order/api/order.service';
import type { OrderItem } from '@/features/order/types';
import { formatRupiah } from '@/utils/format';
import { ApiError } from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';

export default function VerifyOrderPage({ params }: { params: Promise<{ orderCode: string }> }) {
  const { orderCode } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [showReject, setShowReject] = useState(false);

  useEffect(() => {
    getOrderDetail(orderCode)
      .then(setOrder)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Order tidak ditemukan'));
  }, [orderCode]);

  const mutate = async (fn: () => Promise<OrderItem>) => {
    setBusy(true);
    setError('');
    try {
      const next = await fn();
      setOrder((prev) => ({ ...prev, ...next }));
      setShowReject(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Aksi gagal');
    } finally {
      setBusy(false);
    }
  };

  if (error && !order) return <EmptyState ikon="🧾" judul="Order tidak ditemukan" deskripsi={error} />;
  if (!order) return <LoadingState label="Memuat order" />;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <button
        className="w-fit cursor-pointer text-sm font-semibold text-tinta-soft hover:text-panggung-deep"
        onClick={() => router.push('/dashboard/orders')}
      >
        ← Semua pesanan
      </button>
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-xl font-bold">{order.orderCode}</h1>
        <Badge status={order.status} />
      </div>
      <div className="rounded-2xl border border-garis bg-kartu p-5 text-sm">
        <p className="font-display text-lg font-bold">{order.event.title}</p>
        <p className="mt-1 text-tinta-soft">
          {order.user?.name} ({order.user?.email}) • {order.quantity} tiket •{' '}
          <span className="font-bold text-panggung-deep">{formatRupiah(order.totalPrice)}</span>
        </p>
      </div>
      <div className="rounded-2xl border border-garis bg-kartu p-5">
        <p className="mb-2 text-sm font-semibold">Bukti pembayaran</p>
        {order.proofImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={order.proofImageUrl} alt="Bukti bayar" className="max-h-96 rounded-xl border border-garis" />
        ) : (
          <p className="text-sm text-tinta-soft">Belum ada bukti.</p>
        )}
      </div>
      {order.status === 'WAITING_CONFIRMATION' && (
        <div className="flex gap-3">
          <Button onClick={() => mutate(() => approveOrder(orderCode))} disabled={busy}>
            {busy ? 'Memproses...' : '✓ Setujui pembayaran'}
          </Button>
          <Button
            varian="bahaya"
            onClick={() => setShowReject((v) => !v)}
            disabled={busy}
          >
            Tolak
          </Button>
        </div>
      )}
      {showReject && (
        <div className="flex flex-col gap-3 rounded-2xl border border-bara/30 bg-bara-soft p-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-semibold">Alasan penolakan (wajib, min 5 huruf)</span>
            <textarea
              className="field"
              rows={3}
              placeholder="Contoh: nominal tidak sesuai..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          <Button
            varian="bahaya"
            disabled={busy || note.trim().length < 5}
            onClick={() => mutate(() => rejectOrder(orderCode, note.trim()))}
          >
            {busy ? 'Memproses...' : 'Kirim penolakan'}
          </Button>
        </div>
      )}
      {error && <p className="text-sm font-medium text-bara">{error}</p>}
    </div>
  );
}

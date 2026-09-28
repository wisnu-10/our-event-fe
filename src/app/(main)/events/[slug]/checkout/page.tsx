'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useEventDetail } from '@/features/event/hooks/useEvents';
import { createOrder } from '@/features/order/api/order.service';
import { formatRupiah } from '@/utils/format';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Steps } from '@/components/ui/Steps';
import { Card } from '@/components/ui/Card';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';
import { useAuth } from '@/providers/AuthProvider';

const ALUR = ['Pilih tiket', 'Bayar', 'Terima tiket'];

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { event, loading, error } = useEventDetail(slug);
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (loading) return <LoadingState label="Memuat event" />;
  if (error || !event)
    return <EmptyState ikon="🗺️" judul="Event tidak ditemukan" deskripsi={error || ''} />;

  const maxQty = Math.min(5, event.remainingQuota);
  const total = Number(event.price) * quantity;

  const submit = async () => {
    if (!user) {
      router.push(`/auth/login?next=/events/${slug}/checkout`);
      return;
    }
    setSubmitting(true);
    setServerError('');
    try {
      const order = await createOrder(event.id, quantity);
      router.push(`/orders/${order.orderCode}/payment`);
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : 'Gagal membuat order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <Steps langkah={ALUR} aktif={0} />
      <h1 className="font-display text-3xl font-bold tracking-tight">Pilih tiketmu</h1>
      <Card className="!p-0 overflow-hidden">
        <div className="bg-beludru px-5 py-4 text-white">
          <p className="font-display text-lg leading-snug font-bold">{event.title}</p>
          <p className="mt-0.5 text-xs text-white/60">{event.location}</p>
        </div>
        <div className="perforasi-x opacity-70" aria-hidden />
        <div className="flex items-center justify-between p-5 text-sm">
          <span className="text-tinta-soft">
            {formatRupiah(event.price)} / tiket • sisa {event.remainingQuota}
          </span>
        </div>
      </Card>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">Jumlah tiket</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-garis bg-kartu text-lg font-bold transition hover:border-panggung hover:text-panggung-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <span className="w-8 text-center font-mono text-lg font-bold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Tambah jumlah"
            disabled={quantity >= maxQty}
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-garis bg-kartu text-lg font-bold transition hover:border-panggung hover:text-panggung-deep disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
        <span className="ml-auto text-xs text-tinta-faint">maks {maxQty}</span>
      </div>
      <Card className="flex items-center justify-between !bg-beludru !border-beludru text-white">
        <span className="text-sm text-white/70">Total bayar</span>
        <span className="font-display text-2xl font-bold text-lampion">{formatRupiah(total)}</span>
      </Card>
      {serverError && <p className="text-sm font-medium text-bara">{serverError}</p>}
      <Button onClick={submit} disabled={submitting} className="!py-3.5 !text-base">
        {submitting ? 'Memproses...' : user ? 'Lanjut ke pembayaran →' : 'Masuk untuk lanjut →'}
      </Button>
    </div>
  );
}

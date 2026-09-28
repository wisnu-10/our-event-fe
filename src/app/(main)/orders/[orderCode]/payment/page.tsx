'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useEffect } from 'react';
import { cancelOrder, getOrderDetail, uploadProof } from '@/features/order/api/order.service';
import type { OrderItem } from '@/features/order/types';
import { formatRupiah } from '@/utils/format';
import { ApiError } from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Steps } from '@/components/ui/Steps';
import { Card } from '@/components/ui/Card';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';

const ALUR = ['Pilih tiket', 'Bayar', 'Terima tiket'];

const STATUS_KE_LANGKAH: Record<string, number> = {
  PENDING_PAYMENT: 1,
  REJECTED: 1,
  WAITING_CONFIRMATION: 1,
  APPROVED: 2,
  EXPIRED: 1,
  CANCELLED: 1,
};

export default function PaymentPage({ params }: { params: Promise<{ orderCode: string }> }) {
  const { orderCode } = use(params);
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    setLoading(true);
    getOrderDetail(orderCode)
      .then(setOrder)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Order tidak ditemukan'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [orderCode]);

  const doUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const updated = await uploadProof(orderCode, file);
      setOrder(updated);
      setFile(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const doCancel = async () => {
    if (!confirm('Batalkan order ini? Tiket yang dipesan akan hangus.')) return;
    setCancelling(true);
    try {
      setOrder(await cancelOrder(orderCode));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Batal gagal');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingState label="Memuat order" />;
  if (error && !order) return <EmptyState ikon="🧾" judul="Order tidak ditemukan" deskripsi={error} />;
  if (!order) return null;

  const canUpload = order.status === 'PENDING_PAYMENT' || order.status === 'REJECTED';

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <Steps langkah={ALUR} aktif={STATUS_KE_LANGKAH[order.status] ?? 1} />
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold tracking-tight">Bayar pesananmu</h1>
        <Badge status={order.status} />
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between bg-beludru px-5 py-3">
          <p className="font-mono text-sm font-semibold text-lampion">{order.orderCode}</p>
          <p className="text-xs text-white/60">
            {order.quantity} tiket × {formatRupiah(Number(order.event.price))}
          </p>
        </div>
        <div className="perforasi-x opacity-70" aria-hidden />
        <div className="flex items-center justify-between p-5">
          <div>
            <p className="font-bold">{order.event.title}</p>
            <p className="text-xs text-tinta-soft">Total yang harus dibayar</p>
          </div>
          <p className="font-display text-xl font-bold text-panggung-deep">
            {formatRupiah(order.totalPrice)}
          </p>
        </div>
      </Card>

      {order.status === 'APPROVED' && (
        <Card className="!border-daun/30 !bg-daun-soft text-sm">
          <p className="font-bold text-daun">Pembayaran disetujui 🎉</p>
          <p className="mt-1 text-tinta-soft">
            Tiketmu sudah terbit.{' '}
            <Link href={`/orders/${order.orderCode}`} className="font-semibold text-panggung-deep hover:underline">
              Lihat tiketmu
            </Link>
          </p>
        </Card>
      )}
      {order.status === 'WAITING_CONFIRMATION' && (
        <Card className="!border-lampion/40 !bg-lampion-soft text-sm">
          <p className="font-bold">Bukti diterima, tinggal tunggu</p>
          <p className="mt-1 text-tinta-soft">
            Admin sedang memeriksa pembayaranmu. Tiket terbit otomatis setelah disetujui.
          </p>
        </Card>
      )}
      {order.status === 'PENDING_PAYMENT' && (
        <Card className="!border-panggung/25 !bg-panggung-tint text-sm">
          <p className="font-bold text-panggung-deep">Cara bayar</p>
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-tinta-soft">
            <li>Transfer tepat {formatRupiah(order.totalPrice)} ke rekening yang diinfokan admin.</li>
            <li>Foto/screenshot bukti transfer (JPG/PNG/WEBP, maks 5MB).</li>
            <li>Upload di bawah ini, lalu tunggu verifikasi.</li>
          </ol>
        </Card>
      )}
      {order.status === 'REJECTED' && (
        <Card className="!border-bara/30 !bg-bara-soft text-sm">
          <p className="font-bold text-bara">Bukti ditolak: {order.rejectionNote}</p>
          <p className="mt-1 text-tinta-soft">Kamu masih punya 1x kesempatan upload ulang yang valid.</p>
        </Card>
      )}

      {canUpload && (
        <Card className="flex flex-col gap-3">
          <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-garis px-4 py-6 text-center transition hover:border-panggung">
            <span className="text-2xl" aria-hidden>
              🧾
            </span>
            <span className="text-sm font-semibold">
              {file ? file.name : 'Ketuk untuk pilih bukti transfer'}
            </span>
            <span className="text-xs text-tinta-faint">JPG / PNG / WEBP • maks 5MB</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <Button onClick={doUpload} disabled={!file || uploading}>
            {uploading ? 'Mengunggah...' : 'Kirim bukti pembayaran'}
          </Button>
        </Card>
      )}
      {order.status === 'PENDING_PAYMENT' && (
        <Button varian="tenang" onClick={doCancel} disabled={cancelling}>
          {cancelling ? 'Membatalkan...' : 'Batalkan order ini'}
        </Button>
      )}
      {error && <p className="text-sm font-medium text-bara">{error}</p>}
      <Link href="/orders/my" className="text-sm font-semibold text-panggung-deep hover:underline">
        ← Lihat semua tiket saya
      </Link>
    </div>
  );
}

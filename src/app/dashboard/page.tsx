'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStats } from '@/features/dashboard/api/dashboard.service';
import type { DashboardStats } from '@/features/dashboard/types';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';
import { ApiError } from '@/lib/api-client';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Gagal memuat statistik'));
  }, []);

  if (error) return <EmptyState ikon="📡" judul="Gagal memuat ringkasan" deskripsi={error} />;
  if (!stats)
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Ringkasan</h1>
        <div className="grid gap-4 sm:grid-cols-3">
          <LoadingState label="Memuat statistik" />
          <LoadingState label="Memuat statistik" />
          <LoadingState label="Memuat statistik" />
        </div>
      </div>
    );

  const menunggu = stats.ordersByStatus.WAITING_CONFIRMATION ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-panggung uppercase">Pusat kendali</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Ringkasan</h1>
        </div>
        {menunggu > 0 && (
          <Link
            href="/dashboard/orders"
            className="rounded-xl bg-lampion px-4 py-2 text-sm font-bold text-tinta transition hover:brightness-95"
          >
            {menunggu} menunggu verifikasi →
          </Link>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total event" value={String(stats.totalEvents)} />
        <StatCard label="Menunggu verifikasi" value={String(menunggu)} />
        <StatCard label="Pendapatan disetujui" value={String(stats.revenue)} uang />
      </div>
      <Card>
        <h2 className="font-display mb-4 font-bold">Pesanan per status</h2>
        {Object.keys(stats.ordersByStatus).length === 0 ? (
          <p className="text-sm text-tinta-soft">Belum ada pesanan masuk.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <li
                key={status}
                className="flex items-center justify-between rounded-xl bg-kertas px-4 py-2.5 text-sm"
              >
                <Badge status={status} />
                <span className="font-mono font-bold">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

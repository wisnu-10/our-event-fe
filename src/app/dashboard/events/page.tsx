'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { deleteEvent, getMineEvents, publishEvent } from '@/features/event/api/event.service';
import type { EventListResponse } from '@/features/event/types';
import { ApiError } from '@/lib/api-client';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';
import { formatRupiah } from '@/utils/format';

export default function AdminEventsPage() {
  const [status, setStatus] = useState('');
  const [data, setData] = useState<EventListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getMineEvents(status || undefined)
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Gagal memuat event'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status]);

  const togglePublish = async (id: string, current: string) => {
    const next = current === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await publishEvent(id, next as 'DRAFT' | 'PUBLISHED');
      load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal mengubah status');
    }
  };

  const remove = async (id: string, title: string) => {
    if (!confirm(`Hapus event "${title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await deleteEvent(id);
      load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal menghapus');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-panggung uppercase">Katalogmu</p>
          <h1 className="font-display text-3xl font-bold tracking-tight">Event saya</h1>
        </div>
        <Link
          href="/dashboard/events/new"
          className="rounded-xl bg-panggung px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_var(--color-panggung)] transition hover:bg-panggung-deep"
        >
          + Buat event
        </Link>
      </div>
      <select
        className="field w-fit cursor-pointer"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        aria-label="Saring berdasar status"
      >
        <option value="">Semua status</option>
        <option value="DRAFT">Draf</option>
        <option value="PUBLISHED">Tayang</option>
        <option value="CLOSED">Ditutup</option>
      </select>
      {error && <p className="font-medium text-bara">{error}</p>}
      {loading && <LoadingState label="Memuat event" />}
      {!loading && data && data.items.length === 0 && (
        <EmptyState
          ikon="🎪"
          judul="Belum ada event"
          deskripsi="Buat event pertamamu — isi detail, simpan sebagai draf, lalu tayangkan."
          aksi={
            <Link href="/dashboard/events/new" className="font-semibold text-panggung-deep hover:underline">
              Buat event sekarang →
            </Link>
          }
        />
      )}
      <div className="grid gap-3">
        {data?.items.map((e) => (
          <div
            key={e.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-garis bg-kartu p-4"
          >
            <div className="min-w-0">
              <p className="truncate font-bold">{e.title}</p>
              <p className="font-mono text-xs text-tinta-faint">
                /{e.slug} • {e.regency} • {formatRupiah(e.price)} • kuota {e.quota}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge status={e.status} />
              <Link
                href={`/dashboard/events/${e.slug}/edit`}
                className="rounded-lg border border-garis px-2.5 py-1 font-medium transition hover:border-panggung hover:text-panggung-deep"
              >
                Edit
              </Link>
              <button
                className="cursor-pointer rounded-lg border border-garis px-2.5 py-1 font-medium transition hover:border-panggung hover:text-panggung-deep"
                onClick={() => togglePublish(e.id, e.status)}
              >
                {e.status === 'PUBLISHED' ? 'Tutup tayang' : 'Tayangkan'}
              </button>
              <button
                className="cursor-pointer rounded-lg border border-bara/30 px-2.5 py-1 font-medium text-bara transition hover:bg-bara-soft"
                onClick={() => remove(e.id, e.title)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

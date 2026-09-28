'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { EventForm } from '@/features/event/components/EventForm';
import { getEventBySlug } from '@/features/event/api/event.service';
import type { EventItem } from '@/features/event/types';
import { ApiError } from '@/lib/api-client';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';

export default function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getEventBySlug(slug)
      .then(setEvent)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Event tidak ditemukan'));
  }, [slug]);

  if (error)
    return (
      <EmptyState
        ikon="🗺️"
        judul="Event tidak ditemukan"
        deskripsi={error}
        aksi={
          <Link href="/dashboard/events" className="font-semibold text-panggung-deep hover:underline">
            Kembali ke daftar event
          </Link>
        }
      />
    );
  if (!event) return <LoadingState label="Memuat event" />;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-panggung uppercase">Ubah detail</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Edit event</h1>
      </div>
      <EventForm initial={event} />
    </div>
  );
}

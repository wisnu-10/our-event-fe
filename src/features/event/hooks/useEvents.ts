'use client';

import { useCallback, useEffect, useState } from 'react';
import { getEventBySlug, getEvents } from '@/features/event/api/event.service';
import type { EventFilter, EventItem, EventListResponse } from '@/features/event/types';
import { ApiError } from '@/lib/api-client';

export function useEvents(initialFilter: EventFilter = {}) {
  const [filter, setFilter] = useState<EventFilter>(initialFilter);
  const [data, setData] = useState<EventListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getEvents(filter)
      .then(setData)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Gagal memuat event'))
      .finally(() => setLoading(false));
  }, [filter]);

  const setPage = useCallback((page: number) => {
    setFilter((f) => ({ ...f, page }));
  }, []);

  return { data, loading, error, filter, setFilter, setPage };
}

export function useEventDetail(slug: string) {
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEventBySlug(slug)
      .then(setEvent)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Event tidak ditemukan'))
      .finally(() => setLoading(false));
  }, [slug]);

  return { event, loading, error };
}

import { api } from '@/lib/api-client';
import type { EventFilter, EventItem, EventListResponse } from '@/features/event/types';

function toQuery(filter: EventFilter): string {
  const p = new URLSearchParams();
  if (filter.search) p.set('search', filter.search);
  if (filter.category) p.set('category', filter.category);
  if (filter.provinceCode) p.set('provinceCode', filter.provinceCode);
  if (filter.regencyCode) p.set('regencyCode', filter.regencyCode);
  if (filter.page) p.set('page', String(filter.page));
  return p.toString();
}

export async function getEvents(filter: EventFilter = {}): Promise<EventListResponse> {
  const q = toQuery(filter);
  return api.get<EventListResponse>(`/events${q ? `?${q}` : ''}`);
}

export async function getEventBySlug(slug: string): Promise<EventItem> {
  return api.get<EventItem>(`/events/${slug}`);
}

export interface EventFormPayload {
  title: string;
  description: string;
  provinceCode: string;
  province: string;
  regencyCode: string;
  regency: string;
  regencyType: string;
  addressDetail: string;
  category: string;
  startDate: string;
  endDate: string;
  price: number;
  quota: number;
  bannerUrl?: string;
}

export async function getMineEvents(status?: string): Promise<EventListResponse> {
  const q = status ? `?status=${status}` : '';
  return api.get<EventListResponse>(`/events/mine${q}`);
}

export async function createEvent(payload: EventFormPayload): Promise<EventItem> {
  return api.post<EventItem>('/events', payload);
}

export async function updateEvent(id: string, payload: EventFormPayload): Promise<EventItem> {
  return api.put<EventItem>(`/events/${id}`, payload);
}

export async function deleteEvent(id: string): Promise<{ ok: boolean }> {
  return api.delete<{ ok: boolean }>(`/events/${id}`);
}

export async function publishEvent(id: string, status: 'DRAFT' | 'PUBLISHED' | 'CLOSED'): Promise<EventItem> {
  return api.patch<EventItem>(`/events/${id}/publish`, { status });
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { eventFormSchema, type EventFormInput } from '@/features/event/schemas/event.schema';
import { createEvent, updateEvent } from '@/features/event/api/event.service';
import { RegionSelect, type RegionValue } from '@/features/region/components/RegionSelect';
import type { EventItem } from '@/features/event/types';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function EventForm({ initial }: { initial?: EventItem }) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [region, setRegion] = useState<RegionValue>({
    provinceCode: initial?.provinceCode ?? '',
    province: initial?.province ?? '',
    regencyCode: initial?.regencyCode ?? '',
    regency: initial?.regency ?? '',
    regencyType: initial?.regencyType ?? '',
  });
  const [regionError, setRegionError] = useState('');

  const form = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description,
          category: initial.category,
          addressDetail: initial.addressDetail,
          startDate: toLocalInput(initial.startDate),
          endDate: toLocalInput(initial.endDate),
          price: Number(initial.price),
          quota: initial.quota,
          bannerUrl: initial.bannerUrl ?? '',
        }
      : undefined,
  });
  const { register, handleSubmit, formState } = form;

  const onSubmit = handleSubmit(async (v) => {
    setServerError('');
    setRegionError('');
    if (!region.provinceCode || !region.regencyCode) {
      setRegionError('Provinsi dan kota/kabupaten wajib dipilih');
      return;
    }
    const payload = {
      title: v.title,
      description: v.description,
      category: v.category,
      addressDetail: v.addressDetail,
      startDate: new Date(v.startDate).toISOString(),
      endDate: new Date(v.endDate).toISOString(),
      price: Number(v.price),
      quota: Number(v.quota),
      bannerUrl: v.bannerUrl || undefined,
      provinceCode: region.provinceCode,
      province: region.province,
      regencyCode: region.regencyCode,
      regency: region.regency,
      regencyType: region.regencyType || 'Kota',
    };
    try {
      if (initial) await updateEvent(initial.id, payload);
      else await createEvent(payload);
      router.push('/dashboard/events');
    } catch (e) {
      setServerError(e instanceof ApiError ? e.message : 'Simpan gagal');
    }
  });

  const err = (name: keyof EventFormInput) => formState.errors[name]?.message as string | undefined;

  return (
    <form onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-4">
      <Input label="Judul" {...register('title')} error={err('title')} />
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-tinta">Deskripsi</span>
        <textarea
          rows={4}
          placeholder="Ceritakan keseruan event ini..."
          className="field"
          {...register('description')}
        />
        {err('description') && <span className="text-xs font-medium text-bara">{err('description')}</span>}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Kategori" placeholder="music / workshop / food" {...register('category')} error={err('category')} />
        <Input label="URL Banner (opsional)" placeholder="https://..." {...register('bannerUrl')} error={err('bannerUrl')} />
      </div>
      <RegionSelect value={region} onChange={setRegion} error={regionError} />
      <Input label="Detail alamat / venue" placeholder="Gedung, jalan, nomor" {...register('addressDetail')} error={err('addressDetail')} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Tanggal mulai" type="datetime-local" {...register('startDate')} error={err('startDate')} />
        <Input label="Tanggal selesai" type="datetime-local" {...register('endDate')} error={err('endDate')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Harga (Rp)" type="number" min={0} {...register('price')} error={err('price')} />
        <Input label="Kuota" type="number" min={1} {...register('quota')} error={err('quota')} />
      </div>
      {serverError && <p className="text-sm font-medium text-bara">{serverError}</p>}
      <Button type="submit" disabled={formState.isSubmitting} className="w-fit">
        {formState.isSubmitting ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Simpan sebagai Draft'}
      </Button>
    </form>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { RegionSelect, type RegionValue } from '@/features/region/components/RegionSelect';
import type { EventFilter } from '@/features/event/types';

interface EventFilterProps {
  onChange: (f: EventFilter) => void;
}

const EMPTY_REGION: RegionValue = {
  provinceCode: '',
  province: '',
  regencyCode: '',
  regency: '',
  regencyType: '',
};

export function EventFilter({ onChange }: EventFilterProps) {
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState<RegionValue>(EMPTY_REGION);
  const debouncedSearch = useDebounce(searchInput);

  useEffect(() => {
    onChange({
      search: debouncedSearch || undefined,
      category: category || undefined,
      provinceCode: region.provinceCode || undefined,
      regencyCode: region.regencyCode || undefined,
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category, region]);

  const adaFilter = searchInput !== '' || category !== '' || region.provinceCode !== '';

  const reset = () => {
    setSearchInput('');
    setCategory('');
    setRegion(EMPTY_REGION);
  };

  return (
    <div className="rounded-2xl border border-garis bg-kartu p-4 shadow-[0_8px_24px_-16px_rgba(37,34,76,0.25)]">
      <div className="grid gap-3 sm:grid-cols-[1fr_200px_auto]">
        <label className="flex items-center gap-2">
          <span className="sr-only">Cari event</span>
          <span aria-hidden>🔍</span>
          <input
            className="field !border-0 !bg-transparent !p-1 !shadow-none"
            placeholder="Cari konser, workshop, kota..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </label>
        <label className="flex items-center gap-2 border-t border-garis pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
          <span className="sr-only">Kategori</span>
          <select
            className="w-full cursor-pointer bg-transparent text-sm font-semibold text-tinta outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Semua kategori</option>
            <option value="music">Musik</option>
            <option value="workshop">Workshop</option>
            <option value="food">Kuliner</option>
            <option value="sports">Olahraga</option>
            <option value="general">Lainnya</option>
          </select>
        </label>
        <div className="flex items-center border-t border-garis pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
          {adaFilter ? (
            <button
              type="button"
              onClick={reset}
              className="cursor-pointer text-sm font-semibold text-bara hover:underline"
            >
              Hapus filter ✕
            </button>
          ) : (
            <span className="font-mono text-[11px] text-tinta-faint">saring sesukamu ↓</span>
          )}
        </div>
      </div>
      <div className="mt-3 border-t border-dashed border-garis pt-3">
        <RegionSelect value={region} onChange={setRegion} compact />
      </div>
    </div>
  );
}

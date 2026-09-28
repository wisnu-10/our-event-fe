'use client';

import { useEffect } from 'react';
import { useRegions } from '@/features/region/hooks/useRegions';

export interface RegionValue {
  provinceCode: string;
  province: string;
  regencyCode: string;
  regency: string;
  regencyType: string;
}

interface RegionSelectProps {
  value: RegionValue;
  onChange: (v: RegionValue) => void;
  error?: string;
  compact?: boolean;
}

export function RegionSelect({ value, onChange, error, compact = false }: RegionSelectProps) {
  const { provinces, regencies, loadingProvinces, loadingRegencies, error: loadError, loadRegencies } =
    useRegions();

  useEffect(() => {
    if (value.provinceCode) void loadRegencies(value.provinceCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProvince = (code: string) => {
    const found = provinces.find((p) => p.code === code);
    onChange({
      provinceCode: code,
      province: found?.province ?? '',
      regencyCode: '',
      regency: '',
      regencyType: '',
    });
    void loadRegencies(code);
  };

  const handleRegency = (code: string) => {
    const found = regencies.find((r) => r.code === code);
    onChange({
      ...value,
      regencyCode: code,
      regency: found?.regency ?? '',
      regencyType: found?.type ?? '',
    });
  };

  return (
    <div className={`grid gap-3 ${compact ? 'sm:grid-cols-2' : 'gap-4 sm:grid-cols-2'}`}>
      <label className="flex flex-col gap-1.5 text-sm">
        {!compact && <span className="font-semibold text-tinta">Provinsi</span>}
        <select
          className="field cursor-pointer"
          aria-label="Provinsi"
          value={value.provinceCode}
          disabled={loadingProvinces}
          onChange={(e) => handleProvince(e.target.value)}
        >
          <option value="">{loadingProvinces ? 'Memuat...' : '📍 Semua provinsi'}</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.province}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        {!compact && <span className="font-semibold text-tinta">Kota / Kabupaten</span>}
        <select
          className="field cursor-pointer"
          aria-label="Kota atau kabupaten"
          value={value.regencyCode}
          disabled={!value.provinceCode || loadingRegencies}
          onChange={(e) => handleRegency(e.target.value)}
        >
          <option value="">
            {!value.provinceCode
              ? 'Pilih provinsi dulu'
              : loadingRegencies
                ? 'Memuat...'
                : 'Semua kota/kabupaten'}
          </option>
          {regencies.map((r) => (
            <option key={r.code} value={r.code}>
              {r.type} {r.regency}
            </option>
          ))}
        </select>
      </label>
      {(error || loadError) && (
        <p className="text-xs font-medium text-bara sm:col-span-2">
          {error || loadError} —{' '}
          <button
            type="button"
            className="cursor-pointer underline"
            onClick={() => value.provinceCode && loadRegencies(value.provinceCode)}
          >
            coba lagi
          </button>
        </p>
      )}
    </div>
  );
}

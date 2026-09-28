'use client';

import { useEffect, useState } from 'react';
import { getProvinces, getRegencies } from '@/features/region/api/region.service';
import type { RegionProvince, RegionRegency } from '@/features/region/types';
import { ApiError } from '@/lib/api-client';

export function useRegions() {
  const [provinces, setProvinces] = useState<RegionProvince[]>([]);
  const [regencies, setRegencies] = useState<RegionRegency[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProvinces()
      .then(setProvinces)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Gagal memuat provinsi'))
      .finally(() => setLoadingProvinces(false));
  }, []);

  const loadRegencies = async (provinceCode: string) => {
    if (!provinceCode) {
      setRegencies([]);
      return;
    }
    setLoadingRegencies(true);
    setError('');
    try {
      setRegencies(await getRegencies(provinceCode));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Gagal memuat kota/kabupaten');
      setRegencies([]);
    } finally {
      setLoadingRegencies(false);
    }
  };

  return { provinces, regencies, loadingProvinces, loadingRegencies, error, loadRegencies };
}

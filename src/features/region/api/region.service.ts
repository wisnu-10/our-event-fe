import { api } from '@/lib/api-client';
import type { RegionProvince, RegionRegency } from '@/features/region/types';

export async function getProvinces(): Promise<RegionProvince[]> {
  return api.get<RegionProvince[]>('/regions/provinces');
}

export async function getRegencies(provinceCode: string): Promise<RegionRegency[]> {
  return api.get<RegionRegency[]>(`/regions/regencies?provinceCode=${encodeURIComponent(provinceCode)}`);
}

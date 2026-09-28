export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  provinceCode: string;
  province: string;
  regencyCode: string;
  regency: string;
  regencyType: string;
  addressDetail: string;
  category: string;
  startDate: string;
  endDate: string;
  bannerUrl: string | null;
  price: string;
  quota: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  remainingQuota: number;
  createdAt: string;
}

export interface EventListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventListResponse {
  items: EventItem[];
  meta: EventListMeta;
}

export interface EventFilter {
  search?: string;
  category?: string;
  provinceCode?: string;
  regencyCode?: string;
  page?: number;
}

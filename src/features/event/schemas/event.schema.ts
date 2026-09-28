import { z } from 'zod';

export const eventFormSchema = z
  .object({
    title: z.string().min(5, 'Judul minimal 5 karakter'),
    description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
    category: z.string().min(1, 'Kategori wajib diisi'),
    addressDetail: z.string().min(5, 'Detail alamat minimal 5 karakter'),
    startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
    endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
    price: z.coerce.number().min(0, 'Harga minimal 0'),
    quota: z.coerce.number().int().min(1, 'Kuota minimal 1'),
    bannerUrl: z.string().optional(),
  })
  .refine((v) => new Date(v.endDate) > new Date(v.startDate), {
    message: 'Tanggal selesai harus setelah tanggal mulai',
    path: ['endDate'],
  });

export type EventFormInput = z.input<typeof eventFormSchema>;
export type EventFormValues = z.output<typeof eventFormSchema>;

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import {
  createManagedUser,
  deleteManagedUser,
  listManagedUsers,
  updateManagedUserRole,
  type ManagedUser,
} from '@/features/admin-users/api/admin-users.service';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState, LoadingState } from '@/components/ui/EmptyState';

export default function ManageAdminsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [pageError, setPageError] = useState('');
  const [filter, setFilter] = useState<'ADMIN' | 'CUSTOMER' | ''>('');
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setPageError('');
    try {
      const res = await listManagedUsers({
        role: filter || undefined,
        search: search || undefined,
      });
      setUsers(res.users);
    } catch (e) {
      setPageError(e instanceof ApiError ? e.message : 'Gagal memuat daftar admin');
    }
  }, [filter, search]);

  useEffect(() => {
    if (!loading && user && user.role !== 'SUPERADMIN') router.replace('/dashboard');
  }, [loading, user, router]);

  useEffect(() => {
    if (user?.role === 'SUPERADMIN') load();
  }, [user, load]);

  if (loading) return <LoadingState label="Memuat data admin" />;
  if (!user || user.role !== 'SUPERADMIN') return null;

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await createManagedUser({ name, email, password, role: 'ADMIN' });
      setName('');
      setEmail('');
      setPassword('');
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Gagal membuat admin');
    } finally {
      setSubmitting(false);
    }
  };

  const onToggleRole = async (u: ManagedUser) => {
    const next = u.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    if (!confirm(`Ubah ${u.email} menjadi ${next}?`)) return;
    try {
      await updateManagedUserRole(u.id, next);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Gagal mengubah role');
    }
  };

  const onDelete = async (u: ManagedUser) => {
    if (!confirm(`Hapus ${u.email}?`)) return;
    try {
      await deleteManagedUser(u.id);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Gagal menghapus user');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-panggung uppercase">Akses kru</p>
        <h1 className="font-display text-3xl font-bold tracking-tight">Kelola admin</h1>
      </div>
      <p className="-mt-3 text-sm text-tinta-soft">
        Hanya superadmin yang bisa melihat halaman ini. Akun baru dibuat dengan role ADMIN dan
        bisa login lewat Portal Admin.
      </p>

      <Card>
        <h2 className="font-display mb-4 font-bold">Tambah admin</h2>
        <form onSubmit={onCreate} className="grid gap-4 sm:grid-cols-2">
          <Input label="Nama" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password (min 8 karakter)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Buat Admin'}
            </Button>
          </div>
        </form>
        {formError && <p className="mt-3 text-sm font-medium text-bara">{formError}</p>}
      </Card>

      <Card>
        <div className="mb-4 flex flex-wrap gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="field w-auto cursor-pointer"
            aria-label="Saring berdasar role"
          >
            <option value="">Semua role</option>
            <option value="ADMIN">Admin</option>
            <option value="CUSTOMER">Customer</option>
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama / email..."
            className="field sm:max-w-xs"
          />
          <Button type="button" onClick={load}>
            Cari
          </Button>
        </div>
        {pageError && <p className="mb-3 text-sm font-medium text-bara">{pageError}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-garis font-mono text-[11px] tracking-wider text-tinta-faint uppercase">
                <th className="py-2 pr-4 font-medium">Nama</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 pr-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-garis last:border-0">
                  <td className="py-2.5 pr-4 font-semibold">{u.name}</td>
                  <td className="py-2.5 pr-4 text-tinta-soft">{u.email}</td>
                  <td className="py-2.5 pr-4">
                    <Badge status={u.role} />
                  </td>
                  <td className="flex gap-3 py-2.5 pr-4">
                    <button
                      onClick={() => onToggleRole(u)}
                      className="cursor-pointer text-xs font-semibold text-panggung-deep hover:underline"
                    >
                      Jadikan {u.role === 'ADMIN' ? 'customer' : 'admin'}
                    </button>
                    <button
                      onClick={() => onDelete(u)}
                      className="cursor-pointer text-xs font-semibold text-bara hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-sm text-tinta-soft">
                    Belum ada data yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

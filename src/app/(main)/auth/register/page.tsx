import Link from 'next/link';
import { RegisterForm } from '@/features/auth/hooks/useAuthForm';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-panggung uppercase">Gratis, seminit jadi</p>
        <h1 className="font-display mt-1 text-3xl font-bold tracking-tight">Buat akunmu</h1>
        <p className="mt-1 text-sm text-tinta-soft">Satu akun untuk semua event favoritmu.</p>
      </div>
      <Card>
        <RegisterForm />
        <div className="perforasi-x my-5 opacity-70" aria-hidden />
        <p className="text-center text-sm text-tinta-soft">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="font-semibold text-panggung-deep hover:underline">
            Masuk
          </Link>
        </p>
      </Card>
    </div>
  );
}

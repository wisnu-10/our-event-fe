'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { loginSchema, registerSchema } from '@/features/auth/schemas/auth.schema';
import type { LoginInput, RegisterInput } from '@/features/auth/schemas/auth.schema';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function errorMessage(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

export function useLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError('');
    try {
      const user = await login(values.email, values.password);
      const next = params.get('next');
      if (next) router.push(next);
      else router.push(user.role !== 'CUSTOMER' ? '/dashboard' : '/');
    } catch (e) {
      setServerError(errorMessage(e, 'Login gagal'));
    }
  });

  return { form, onSubmit, serverError };
}

export function LoginForm() {
  const { form, onSubmit, serverError } = useLoginForm();
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="Email" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
      <Input label="Password" type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
      {serverError && <p className="text-sm font-medium text-bara">{serverError}</p>}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Masuk...' : 'Masuk'}
      </Button>
    </form>
  );
}

export function useRegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [serverError, setServerError] = useState('');
  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError('');
    try {
      const user = await register(values.name, values.email, values.password);
      router.push(user.role !== 'CUSTOMER' ? '/dashboard' : '/');
    } catch (e) {
      setServerError(errorMessage(e, 'Registrasi gagal'));
    }
  });

  return { form, onSubmit, serverError };
}

export function RegisterForm() {
  const { form, onSubmit, serverError } = useRegisterForm();
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label="Nama" {...form.register('name')} error={form.formState.errors.name?.message} />
      <Input label="Email" type="email" {...form.register('email')} error={form.formState.errors.email?.message} />
      <Input label="Password" type="password" {...form.register('password')} error={form.formState.errors.password?.message} />
      {serverError && <p className="text-sm font-medium text-bara">{serverError}</p>}
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Mendaftar...' : 'Daftar'}
      </Button>
    </form>
  );
}

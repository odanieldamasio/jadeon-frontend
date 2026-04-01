'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/lib/hooks/use-auth';
import { getErrorMessage } from '@/lib/utils/error';
import { useAuthStore } from '@/store/auth.store';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(1, 'Senha obrigatória')
});

export default function LoginPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const loginMutation = useLogin();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<Record<'email' | 'password', string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      router.replace('/dashboard');
    }
  }, [accessToken, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0]
      });
      return;
    }

    try {
      await loginMutation.mutateAsync(parsed.data);
      router.replace('/dashboard');
    } catch (error) {
      setFormError(getErrorMessage(error, 'Não foi possível entrar com estas credenciais.'));
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-neon">Jadeon</p>
        <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Entrar na plataforma</h1>
        <p className="text-sm text-muted-foreground">Acompanhe seu financeiro com clareza em minutos.</p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => {
              setValues((current) => ({ ...current, email: event.target.value }));
              setErrors((current) => ({ ...current, email: undefined }));
            }}
          />
          {errors.email ? <p className="text-xs text-danger">{errors.email}</p> : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            value={values.password}
            onChange={(event) => {
              setValues((current) => ({ ...current, password: event.target.value }));
              setErrors((current) => ({ ...current, password: undefined }));
            }}
          />
          {errors.password ? <p className="text-xs text-danger">{errors.password}</p> : null}
        </div>

        {formError ? (
          <p className="rounded-xl border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</p>
        ) : null}

        <Button className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link className="font-semibold text-primary-neon hover:underline" href="/register">
          Criar cadastro
        </Link>
      </p>
    </section>
  );
}

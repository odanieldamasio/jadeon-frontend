'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/lib/hooks/use-auth';
import { getErrorMessage } from '@/lib/utils/error';
import { maskBrPhoneInput, normalizePhoneToE164 } from '@/lib/utils/phone';
import { useAuthStore } from '@/store/auth.store';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome'),
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(8, 'A senha precisa ter ao menos 8 caracteres'),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || '')
    .refine((value) => value === '' || normalizePhoneToE164(value) !== null, 'Telefone inválido')
    .transform((value) => (value === '' ? undefined : normalizePhoneToE164(value) || undefined))
});

export default function RegisterPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const registerMutation = useRegister();

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'password' | 'phone', string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      router.replace('/dashboard');
    }
  }, [accessToken, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        phone: fieldErrors.phone?.[0]
      });
      return;
    }

    try {
      await registerMutation.mutateAsync(parsed.data);
      router.replace('/dashboard');
    } catch (error) {
      setFormError(getErrorMessage(error, 'Não foi possível criar sua conta agora.'));
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2 text-center">
        <div className="mx-auto mb-6 w-fit rounded-2xl px-2.5 py-2">
          <Image src="/jadeon-logo.svg" alt="Jadeon" width={94} height={39} className="h-auto w-[94px]" priority />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Criar conta</h1>
        <p className="text-sm text-muted-foreground">Comece a organizar seu caixa em um painel único.</p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(event) => {
              setValues((current) => ({ ...current, name: event.target.value }));
              setErrors((current) => ({ ...current, name: undefined }));
            }}
          />
          {errors.name ? <p className="text-xs text-danger">{errors.name}</p> : null}
        </div>

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
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input
            id="phone"
            inputMode="numeric"
            placeholder="(11) 99999-9999"
            value={values.phone}
            onChange={(event) => {
              setValues((current) => ({ ...current, phone: maskBrPhoneInput(event.target.value) }));
              setErrors((current) => ({ ...current, phone: undefined }));
            }}
          />
          {errors.phone ? <p className="text-xs text-danger">{errors.phone}</p> : null}
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

        <Button className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link className="font-semibold text-primary-neon hover:underline" href="/login">
          Fazer login
        </Link>
      </p>
    </section>
  );
}

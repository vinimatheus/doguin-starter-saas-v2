'use client';

import * as z from 'zod';
import { useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';

import { LoginSchema } from '@/schemas';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/auth/form-error';
import { FormSucess } from '@/components/auth/form-sucess';

import { login } from '@/actions/login';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import Social from './social';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [isReturningUser, setIsReturningUser] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsReturningUser(!!user);
  }, []);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email já está em uso com um provedor diferente!'
      : '';

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        if (data?.error) {
          form.reset();
          setError(data.error);
          return; // Para evitar múltiplas atualizações
        }

        if (data?.success) {
          form.reset();
          setSuccess(data.success);
          return; // Redirecionamento ou próximo passo
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      });
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isReturningUser ? 'Bem-vindo de volta' : 'Bem-vindo'}
          </CardTitle>
          <CardDescription>
            Faça login com sua conta Apple ou Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-10 flex flex-col gap-4">
            <Social />
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Ou continue com
            </span>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                {showTwoFactor && (
                  <>
                    {/* 2FA */}
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de Dois Fatores</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="123456"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {!showTwoFactor && (
                  <>
                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="joao.silva@exemplo.com"
                              type="email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Senha */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="******"
                              type="password"
                            />
                          </FormControl>
                          <Button
                            size="sm"
                            variant="link"
                            asChild
                            className="px-0 font-normal"
                          >
                            <Link href="/auth/reset">Esqueceu a senha?</Link>
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <FormError message={error || urlError} />
              <FormSucess message={success} />
              <Button disabled={isPending} type="submit" className="w-full">
                {showTwoFactor ? 'Confirmar' : 'Login'}
              </Button>
              <div className="mt-4 text-center">
                <Link href="/auth/register">
                  <Button variant="link" size={'sm'} className="w-full">
                    Não tem conta criada ? Registre-se aqui
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        Ao clicar em continuar, você concorda com nossos{' '}
        <a href="#">Termos de Serviço</a> e{' '}
        <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  );
}

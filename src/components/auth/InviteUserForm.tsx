'use client';

import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import { inviteUser } from '@/actions/invite-user';

const InviteSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório.'),
  email: z.string().email('Email inválido.'),
  role: z.enum(['USER', 'ADMIN'])
});

type InviteFormValues = z.infer<typeof InviteSchema>;

export default function InviteUserForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(InviteSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'USER'
    }
  });

  const onSubmit = (values: InviteFormValues) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      inviteUser(values).then((data) => {
        if (data?.error) {
          form.reset();
          setError(data.error);
        }

        if (data?.success) {
          form.reset();
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Convidar Usuário</CardTitle>
          <CardDescription>
            Preencha os dados do usuário para enviar o convite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                {/* Nome */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="João Silva"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                {/* Função */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          disabled={isPending}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        >
                          <option value="USER">Usuário</option>
                          <option value="ADMIN">Administrador</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSucess message={success} />
              <div className="mt-4">
                <Button disabled={isPending} type="submit" className="w-full">
                  {isPending ? 'Enviando convite...' : 'Enviar Convite'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

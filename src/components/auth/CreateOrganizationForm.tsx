'use client';

import * as z from 'zod';
import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import slugify from 'slugify';

import { cn } from '@/lib/utils';
import { CreateOrganizationSchema } from '@/schemas';

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

import { createOrganizationUser } from '@/actions/organizationCreateUser';
import { Dog } from 'lucide-react';
import { IconSelector } from '../IconSelector';

export function CreateOrganizationForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending] = useTransition();

  const form = useForm<z.infer<typeof CreateOrganizationSchema>>({
    resolver: zodResolver(CreateOrganizationSchema),
    defaultValues: {
      name: '',
      slug: ''
    }
  });

  // Atualizar o slug automaticamente ao alterar o nome, mas evitar loops
  useEffect(() => {
    const subscription = form.watch((values) => {
      const newSlug = slugify(values.name || '', { lower: true, strict: true });
      if (values.name && form.getValues('slug') !== newSlug) {
        form.setValue('slug', newSlug, { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof CreateOrganizationSchema>) => {
    setError('');
    setSuccess('');

    if (!values.name || !values.slug) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      const data = await createOrganizationUser(values);
      if (data?.error) {
        setError(data.error);
      } else {
        setSuccess('Organização criada com sucesso!');
      }
    } catch (error) {
      setError('Erro ao criar organização.');
    }
  };

  return (
    <>
      <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Dog className="mr-2" />
            Doguin
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This starter template has saved me countless hours of
                work and helped me deliver projects to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className="text-sm">Random Dude</footer>
            </blockquote>
          </div>
        </div>
        <div className="flex h-full items-center p-4 lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {/* github link  */}

            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Crie sua organização
              </h1>
              <p className="text-sm text-muted-foreground"></p>
            </div>
            <div className={cn('flex flex-col gap-6', className)} {...props}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid gap-6">
                        {/* Nome */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome da Organização</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={isPending}
                                  placeholder="Ex.: Minha Organização"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Slug</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={true} // Bloquear edição manual
                                  placeholder="exemplo-minha-organizacao"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="icon"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ícone da Organização</FormLabel>
                              <IconSelector
                                selectedIcon={field.value}
                                onChange={field.onChange}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Slug */}
                      </div>
                      <FormError message={error} />
                      <FormSucess message={success} />
                      <div className="mt-4">
                        <Button
                          size={'sm'}
                          disabled={isPending}
                          type="submit"
                          className="w-full"
                        >
                          Criar Organização
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

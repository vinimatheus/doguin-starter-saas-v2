'use client';

import { useForm, FormProvider } from 'react-hook-form'; // Importar FormProvider
import { zodResolver } from '@hookform/resolvers/zod';
import { SettingsSchema } from '@/schemas';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserRole } from '@prisma/client';
import ProfilePicture from './ProfilePicture';
import FormFieldWrapper from './FormFieldWrapper';
import TwoFactorAuth from './TwoFactorAuth';
import { settings } from '@/actions/settings';
import type { z } from 'zod';
import { useState } from 'react';
import RoleSelect from './RoleSelect';

const SettingsForm = () => {
  const { toast } = useToast();
  const { update } = useSession();
  const user = useCurrentUser();
  const [isPending, setIsPending] = useState(false);
  const [editingField, setEditingField] = useState<'name' | 'email' | null>(
    null
  );

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      image: user?.image || '',
      role: user?.role || UserRole.USER,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || false
    }
  });

  const handleSave = (field: 'name' | 'email') => {
    const value = form.getValues(field);
    const role = form.getValues('role');

    setIsPending(true);
    settings({ [field]: value, role })
      .then((data) => {
        if (data.error) {
          toast({
            title: 'Erro',
            description: data.error,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Sucesso',
            description: `${field === 'name' ? 'Nome' : 'Email'} atualizado com sucesso!`,
            variant: 'default'
          });
          update();
        }
      })
      .catch(() =>
        toast({
          title: 'Erro',
          description: 'Algo deu errado!',
          variant: 'destructive'
        })
      )
      .finally(() => {
        setIsPending(false);
        setEditingField(null);
      });
  };

  return (
    <FormProvider {...form}>
      <form className="space-y-6">
        <ProfilePicture user={user} update={update} />

        <FormFieldWrapper
          field={form.register('name')}
          label="Nome"
          placeholder="John Doe"
          isEditing={editingField === 'name'}
          onEdit={() => setEditingField('name')}
          onSave={() => handleSave('name')}
          onCancel={() => setEditingField(null)}
        />

        <FormFieldWrapper
          field={form.register('email')}
          label="Email"
          placeholder="john.doe@example.com"
          isEditing={editingField === 'email'}
          onEdit={() => setEditingField('email')}
          onSave={() => handleSave('email')}
          onCancel={() => setEditingField(null)}
        />
        <RoleSelect currentRole={form.getValues('role') ?? UserRole.USER} />
        <TwoFactorAuth
          value={form.getValues('isTwoFactorEnabled') ?? false}
          isPending={isPending}
          onChange={(checked) => {
            form.setValue('isTwoFactorEnabled', checked);
            setIsPending(true);
            settings({ isTwoFactorEnabled: checked })
              .then(() => {
                toast({
                  title: 'Sucesso',
                  description: checked
                    ? 'Autenticação de dois fatores ativada.'
                    : 'Autenticação de dois fatores desativada.',
                  variant: 'default'
                });
              })
              .catch(() =>
                toast({
                  title: 'Erro',
                  description: 'Algo deu errado!',
                  variant: 'destructive'
                })
              )
              .finally(() => setIsPending(false));
          }}
        />
      </form>
    </FormProvider>
  );
};

export default SettingsForm;

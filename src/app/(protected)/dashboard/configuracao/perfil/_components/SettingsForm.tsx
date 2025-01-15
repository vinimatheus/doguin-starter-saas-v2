'use client';

import { useForm, FormProvider } from 'react-hook-form';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from '@/components/ui/input-otp';
import type { z } from 'zod';
import { useState } from 'react';
import {
  startEmailUpdate,
  validateEmailCode
} from '@/actions/new-verification';
import { Button } from '@/components/ui/button';

const SettingsForm = () => {
  const { toast } = useToast();
  const { update } = useSession();
  const user = useCurrentUser();
  const [isPending, setIsPending] = useState(false);
  const [editingField, setEditingField] = useState<'name' | 'email' | null>(
    null
  );
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');

  const isOAuthUser = user?.isOAuth || false;

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

  const handleSave = async (field: 'name' | 'email') => {
    const value = form.getValues(field);

    setIsPending(true);
    try {
      if (field === 'email') {
        const response = await startEmailUpdate(
          user?.id as string,
          value ?? ''
        );
        if (response?.error) {
          toast({
            title: 'Erro',
            description: response.error,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Sucesso',
            description: 'Código de verificação enviado ao novo e-mail.',
            variant: 'default'
          });
          setUpdatedEmail(value ?? ''); // Garante que não seja `undefined`
          setShowOTP(true);
        }
      } else {
        const response = await settings({ [field]: value });
        if (response?.error) {
          toast({
            title: 'Erro',
            description: response.error,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Sucesso',
            description: `${field === 'name' ? 'Nome' : 'Campo'} atualizado com sucesso!`,
            variant: 'default'
          });
          update();
        }
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Algo deu errado!',
        variant: 'destructive'
      });
    } finally {
      setIsPending(false);
      setEditingField(null);
    }
  };

  const handleOTPSubmit = async () => {
    setIsPending(true);

    const response = await validateEmailCode(user?.id as string, otp);

    if (response.error) {
      toast({
        title: 'Erro',
        description: response.error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Sucesso',
        description: 'E-mail verificado e atualizado com sucesso!',
        variant: 'default'
      });
      update();
      setShowOTP(false);
    }

    setIsPending(false);
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

        {!isOAuthUser && (
          <FormFieldWrapper
            field={form.register('email')}
            label="Email"
            placeholder="john.doe@example.com"
            isEditing={editingField === 'email'}
            onEdit={() => setEditingField('email')}
            onSave={() => handleSave('email')}
            onCancel={() => setEditingField(null)}
          />
        )}
        {!isOAuthUser && (
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
        )}
      </form>
      {/* Dialog para OTP */}
      <Dialog open={showOTP} onOpenChange={setShowOTP}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirme seu e-mail</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Insira o código de verificação enviado para {updatedEmail}.
          </p>
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
            </InputOTPGroup>
          </InputOTP>
          <DialogFooter>
            <Button
              type="button"
              onClick={handleOTPSubmit}
              disabled={isPending}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};

export default SettingsForm;

'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

import { useCurrentUser } from '@/hooks/use-current-user';
import { SettingsSchema } from '@/schemas';
import { UserRole } from '@prisma/client';

import { settings } from '@/actions/settings';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Pencil, Check, X, Lock } from 'lucide-react';
import Link from 'next/link';
import { changePassword } from '@/actions/resetpassword';
import Image from 'next/image';
import { uploadImage } from '@/actions/saveImage';
import { removeImage } from '@/actions/removeImage';

const SettingsPage = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [uploading, setUploading] = useState(false);

  const user = useCurrentUser();

  const [editingField, setEditingField] = useState<
    'name' | 'email' | 'image' | null
  >(null);

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

  const handleChangePassword = () => {
    startTransition(() => {
      changePassword({ currentPassword, newPassword })
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
              description: 'Senha alterada com sucesso!',
              variant: 'default'
            });
            setCurrentPassword('');
            setNewPassword('');
          }
        })
        .catch(() =>
          toast({
            title: 'Erro',
            description: 'Algo deu errado ao trocar a senha!',
            variant: 'destructive'
          })
        );
    });
  };

  const handleSave = (field: 'name' | 'email' | 'image') => {
    startTransition(() => {
      const value = form.getValues(field);
      const role = form.getValues('role');

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
              description: `${field === 'name' ? 'Nome' : field === 'email' ? 'Email' : 'Imagem'} atualizado(a)!`,
              variant: 'default'
            });

            // Atualize a sessão após qualquer atualização bem-sucedida
            if (field === 'name' || field === 'email' || field === 'image') {
              update();
            }
          }
        })
        .catch(() =>
          toast({
            title: 'Erro',
            description: 'Algo deu errado!',
            variant: 'destructive'
          })
        );
    });

    setEditingField(null);
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadImage(formData);

    if (response.error) {
      toast({
        title: 'Erro',
        description: response.error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Sucesso',
        description: 'Imagem atualizada com sucesso!',
        variant: 'default'
      });
      update(); // Atualizar a sessão
    }

    setUploading(false);
  };

  const handleRemove = async () => {
    startTransition(() => {
      removeImage(user?.image || '')
        .then(() => {
          toast({
            title: 'Sucesso',
            description: 'Imagem removida com sucesso!',
            variant: 'default'
          });
          update(); // Atualizar a sessão
        })
        .catch(() =>
          toast({
            title: 'Erro',
            description: 'Erro ao remover a imagem!',
            variant: 'destructive'
          })
        );
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r p-6">
        <nav className="space-y-1">
          <Button variant="secondary" className="w-full justify-start">
            Perfil
          </Button>
          <div>
            <Link href="/dashboard/configuracao/usuarios">
              <Button variant="ghost" className="w-full justify-start">
                Usuários
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="mb-6 text-2xl font-semibold">Perfil</h1>

        <Form {...form}>
          <div className="space-y-6">
            <div className="space-y-4">
              <FormField
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>Foto de Perfil</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Preview da Imagem */}
                        {user?.image ? (
                          <div className="relative flex justify-center">
                            <Image
                              src={user.image}
                              alt="Profile Preview"
                              className="h-32 w-32 rounded-full border"
                              width={128}
                              height={128}
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute right-0 top-0"
                              onClick={handleRemove}
                              disabled={isPending || uploading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Nenhuma imagem de perfil disponível.
                          </p>
                        )}

                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file);
                          }}
                          disabled={uploading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          {...field}
                          placeholder="John Doe"
                          disabled={isPending || editingField !== 'name'}
                        />
                        {editingField === 'name' ? (
                          <>
                            <Check
                              className="cursor-pointer text-green-500"
                              onClick={() => handleSave('name')}
                            />
                            <X
                              className="cursor-pointer text-red-500"
                              onClick={() => setEditingField(null)}
                            />
                          </>
                        ) : (
                          <Pencil
                            className="cursor-pointer"
                            onClick={() => setEditingField('name')}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          disabled={isPending || editingField !== 'email'}
                        />
                        {editingField === 'email' ? (
                          <>
                            <Check
                              className="cursor-pointer text-green-500"
                              onClick={() => handleSave('email')}
                            />
                            <X
                              className="cursor-pointer text-red-500"
                              onClick={() => setEditingField(null)}
                            />
                          </>
                        ) : (
                          <Pencil
                            className="cursor-pointer"
                            onClick={() => setEditingField('email')}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={(value) => {
                        field.onChange(value);
                        startTransition(() => {
                          settings({ role: value as UserRole })
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
                                  description: 'Função atualizada com sucesso!',
                                  variant: 'default'
                                });
                                update();
                              }
                            })
                            .catch(() =>
                              toast({
                                title: 'Erro',
                                description:
                                  'Algo deu errado ao atualizar a função!',
                                variant: 'destructive'
                              })
                            );
                        });
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                        <SelectItem value={UserRole.USER}>Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Autenticação de Dois Fatores</FormLabel>
                      <FormDescription>
                        Ative a autenticação de dois fatores para sua conta
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          startTransition(() => {
                            settings({
                              isTwoFactorEnabled: checked,
                              role: form.getValues('role')
                            })
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
                                    description: checked
                                      ? 'Autenticação de dois fatores ativada.'
                                      : 'Autenticação de dois fatores desativada.',
                                    variant: 'default'
                                  });
                                }
                              })
                              .catch(() =>
                                toast({
                                  title: 'Erro',
                                  description:
                                    'Algo deu errado ao atualizar a autenticação de dois fatores!',
                                  variant: 'destructive'
                                })
                              );
                          });

                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Lock className="mr-2" />
                Trocar Senha
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Trocar Senha</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Senha Atual
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    disabled={isPending}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Nova Senha
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    disabled={isPending}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                  }}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleChangePassword}
                  disabled={isPending || !currentPassword || !newPassword}
                >
                  Alterar Senha
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

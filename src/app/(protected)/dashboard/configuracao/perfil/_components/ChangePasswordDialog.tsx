'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { changePassword } from '@/actions/resetpassword';

const ChangePasswordDialog = () => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    setIsPending(true);
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
      )
      .finally(() => setIsPending(false));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Trocar Senha</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trocar Senha</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Senha Atual</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Nova Senha</label>
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
  );
};

export default ChangePasswordDialog;

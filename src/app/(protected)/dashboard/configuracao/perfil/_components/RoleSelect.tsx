'use client';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@prisma/client';
import { updateRole } from '@/actions/role'; // Caminho para o action no servidor

const RoleSelect = ({ currentRole }: { currentRole: UserRole }) => {
  const { toast } = useToast();
  const [role, setRole] = useState<UserRole>(currentRole); // Estado local para o role
  const [isPending, setIsPending] = useState(false);

  const handleChangeRole = async (newRole: UserRole) => {
    setRole(newRole); // Atualiza o estado local imediatamente
    setIsPending(true); // Indica que a atualização está em progresso

    try {
      const result = await updateRole({ role: newRole }); // Chama o action do servidor
      if (result.error) {
        toast({
          title: 'Erro',
          description: result.error,
          variant: 'destructive'
        });
        setRole(currentRole); // Reverte o estado local em caso de erro
      } else {
        toast({
          title: 'Sucesso',
          description: result.success,
          variant: 'default'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Algo deu errado ao alterar a função.',
        variant: 'destructive'
      });
      setRole(currentRole); // Reverte o estado local em caso de erro
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Select
      value={role} // Valor atual do estado
      onValueChange={(value) => handleChangeRole(value as UserRole)} // Converte o valor para UserRole
      disabled={isPending} // Desabilita enquanto está carregando
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione uma função" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="USER">Usuário</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;

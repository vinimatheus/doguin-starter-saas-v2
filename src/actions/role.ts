'use server';

import * as z from 'zod';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { getUserById } from '@/data/user';

// Schema para validação do role
const RoleSchema = z.object({
  role: z.enum(['ADMIN', 'USER']) // Defina os valores possíveis do role
});

export const updateRole = async (values: z.infer<typeof RoleSchema>) => {
  // Recupera o usuário atual
  const user = await currentUser();

  if (!user) {
    return { error: 'Não autorizado!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Usuário não encontrado!' };
  }

  // Verifica se o usuário tem permissão para alterar o role (opcional)
  if (dbUser.role !== 'ADMIN') {
    return { error: 'Você não tem permissão para alterar funções!' };
  }

  // Atualiza o role no banco de dados
  await db.user.update({
    where: { id: dbUser.id },
    data: { role: values.role }
  });

  return { success: 'Função do usuário atualizada com sucesso!' };
};

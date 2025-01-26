'use server';

import * as z from 'zod';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { getUserById } from '@/data/user';

const RoleSchema = z.object({
  role: z.enum(['ADMIN', 'USER'])
});

export const updateRole = async (values: z.infer<typeof RoleSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Não autorizado!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Usuário não encontrado!' };
  }

  if (dbUser.role !== 'ADMIN') {
    return { error: 'Você não tem permissão para alterar funções!' };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: { role: values.role }
  });

  return { success: 'Função do usuário atualizada com sucesso!' };
};

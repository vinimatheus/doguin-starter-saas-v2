'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const deleteUser = async (id: string) => {
  try {
    await db.user.delete({
      where: { id }
    });
    revalidatePath('/dashboard/configuracao/usuarios');
    return { success: true, message: 'Usuário deletado com sucesso!' };
  } catch (error) {
    return { success: false, message: 'Erro ao deletar o usuário!' };
  }
};

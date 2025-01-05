'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export const changePassword = async ({
  currentPassword,
  newPassword
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  const dbUser = await db.user.findUnique({ where: { id: user.id } });

  if (!dbUser || !dbUser.password) {
    return { error: 'Usuário não encontrado ou senha não configurada.' };
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    dbUser.password
  );

  if (!isPasswordValid) {
    return { error: 'A senha atual está incorreta.' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  return { success: 'Senha alterada com sucesso!' };
};

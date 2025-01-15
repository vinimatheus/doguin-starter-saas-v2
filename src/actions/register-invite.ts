'use server';

import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export const registerInvite = async (
  token: string,
  name: string,
  password: string
) => {
  const invitation = await db.userInvitation.findUnique({ where: { token } });

  if (!invitation || new Date(invitation.expiresAt) < new Date()) {
    return { error: 'Convite inválido ou expirado!' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email: invitation.email,
      password: hashedPassword,
      role: invitation.role
    }
  });

  await db.userInvitation.delete({ where: { token } });

  return { success: 'Registro concluído!' };
};

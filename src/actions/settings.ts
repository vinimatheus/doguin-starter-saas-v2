'use server';

import * as z from 'zod';

import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: 'Não autorizado!' };
  }

  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: 'Não autorizado!' };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: 'Email já está em uso!' };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: 'Email de verificação enviado!' };
  }

  await db.user.update({
    where: { id: dbUser.id },
    data: {
      name: values.name || dbUser.name,
      email: values.email || dbUser.email,
      image: values.image || dbUser.image,
      isTwoFactorEnabled:
        values.isTwoFactorEnabled !== undefined
          ? values.isTwoFactorEnabled
          : dbUser.isTwoFactorEnabled
    }
  });

  return { success: 'Configurações atualizadas!' };
};

'use server';

import { db } from '@/lib/db';
import { InviteSchema } from '@/schemas';
import { sendInvitationEmail } from '@/lib/mail';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { z } from 'zod';

export const inviteUser = async (values: z.infer<typeof InviteSchema>) => {
  const validatedFields = InviteSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos!' };
  }

  const { email, role = 'USER', name } = validatedFields.data;

  // Gera uma senha aleatória
  const generatedPassword = crypto.randomBytes(8).toString('hex');
  const hashedPassword = await bcrypt.hash(generatedPassword, 10);

  try {
    // Cria o usuário no banco
    await db.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword
      }
    });

    // Envia e-mail com as credenciais
    await sendInvitationEmail(email, generatedPassword);

    return { success: 'Convite enviado com sucesso!' };
  } catch (error) {
    return { error: 'Erro ao enviar convite!' };
  }
};

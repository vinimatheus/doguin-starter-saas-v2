'use server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { sendVerificationEmailWithCode } from '@/lib/mail';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'Token não existe!' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token expirou!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email não existe' };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email
    }
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });

  return { success: 'Email verificado!' };
};

export const generateAndSendEmailCode = async (
  userId: string,
  email: string
) => {
  // Gera o código de 5 dígitos
  const code = Math.floor(10000 + Math.random() * 90000).toString();

  try {
    // Salva o código no banco de dados
    await db.verificationCode.create({
      data: {
        userId,
        email,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // Expira em 10 minutos
      }
    });
  } catch (error) {
    throw error; // Repropaga o erro
  }

  // Envia o e-mail com o código
  await sendVerificationEmailWithCode(email, code);
};

export const validateEmailCode = async (userId: string, code: string) => {
  const record = await db.verificationCode.findFirst({
    where: {
      userId,
      code,
      expiresAt: { gte: new Date() } // Verifica validade
    }
  });

  if (!record) {
    return { error: 'Código inválido ou expirado!' };
  }

  const user = await db.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return { error: 'Usuário não encontrado!' };
  }

  // Atualiza o e-mail do usuário no banco de dados
  await db.user.update({
    where: { id: userId },
    data: { email: record.email }
  });

  // Remove o código do banco
  await db.verificationCode.delete({ where: { id: record.id } });

  return { success: 'E-mail atualizado com sucesso!' };
};

export const resendEmailCode = async (userId: string, email: string) => {
  // Opcional: Remover códigos antigos associados ao mesmo usuário e e-mail
  await db.verificationCode.deleteMany({
    where: {
      userId,
      email
    }
  });

  // Gerar e enviar um novo código
  return generateAndSendEmailCode(userId, email);
};

export const startEmailUpdate = async (
  userId: string,
  newEmail: string
): Promise<{ error?: string } | void> => {
  const existingUser = await getUserByEmail(newEmail);

  if (existingUser) {
    return { error: 'Este e-mail já está em uso!' };
  }

  await generateAndSendEmailCode(userId, newEmail);

  return {}; // Retorna um objeto vazio para evitar `undefined`
};

export const cleanExpiredCodes = async () => {
  const result = await db.verificationCode.deleteMany({
    where: {
      expiresAt: { lt: new Date() } // Menor que o horário atual
    }
  });

  return { success: `${result.count} códigos expirados removidos!` };
};

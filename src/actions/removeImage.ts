'use server';

import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Configuração do Cloudinary

export const removeImage = async (imageUrl: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    // Extrair o public_id da URL
    const publicId = imageUrl.split('/').pop()?.split('.')[0];

    if (!publicId) {
      throw new Error('ID da imagem inválido.');
    }

    // Remover do Cloudinary
    await cloudinary.uploader.destroy(`user_profiles/${publicId}`);

    // Atualizar o banco de dados
    await db.user.update({
      where: { id: user.id },
      data: { image: null }
    });

    revalidatePath('/dashboard/configuracao/perfil');
    return { success: true };
  } catch (error) {
    throw new Error('Erro ao remover a imagem.');
  }
};

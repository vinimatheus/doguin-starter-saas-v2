'use server';

import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export const removeImage = async (imageUrl: string) => {
  const user = await currentUser();

  if (!user) {
    throw new Error('Usuário não autenticado.');
  }

  try {
    const publicId = imageUrl.split('/').pop()?.split('.')[0];

    if (!publicId) {
      throw new Error('ID da imagem inválido.');
    }

    await cloudinary.uploader.destroy(`user_profiles/${publicId}`);

    await db.user.update({
      where: { id: user.id },
      data: { image: null }
    });

    return { success: true };
  } catch (error) {
    throw new Error('Erro ao remover a imagem.');
  }
};

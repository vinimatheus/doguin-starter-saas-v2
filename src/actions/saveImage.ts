'use server';

import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (formData: FormData) => {
  const file = formData.get('file') as File | null;

  if (!file) {
    return { error: 'Nenhum arquivo fornecido.' };
  }

  const user = await currentUser();

  if (!user) {
    return { error: 'Usuário não autenticado.' };
  }

  try {
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const result = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64String}`,
      {
        folder: 'user_profiles'
      }
    );

    // Atualizar a URL da imagem no banco de dados
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { image: result.secure_url }
    });

    return {
      success: 'Imagem salva com sucesso!',
      url: result.secure_url,
      user: updatedUser
    };
  } catch (error) {
    return { error: 'Erro ao fazer upload da imagem.' };
  }
};

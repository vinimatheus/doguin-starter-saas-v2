'use server';

import * as z from 'zod';
import { CreateOrganizationSchema } from '@/schemas';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

const UpdateOrganizationSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  icon: z.string().optional()
});

export const createOrganization = async (
  values: z.infer<typeof CreateOrganizationSchema>
) => {
  const validatedFields = CreateOrganizationSchema.safeParse(values);

  const user = await currentUser();

  if (!user || !user.id) {
    return { error: 'Não autorizado!' };
  }

  const userId = user.id;

  if (!validatedFields.success) {
    return { error: 'Campos inválidos!' };
  }

  const { name, slug, icon } = validatedFields.data;

  const existingOrganization = await db.organization.findUnique({
    where: { slug }
  });

  if (existingOrganization) {
    return { error: 'O slug já está em uso!' };
  }

  const organization = await db.organization.create({
    data: {
      name,
      slug,
      icon,
      ownerId: userId
    }
  });

  await db.member.create({
    data: {
      userId,
      organizationId: organization.id,
      role: 'OWNER'
    }
  });

  // Inclua os dados da nova organização no retorno
  return {
    success: 'Organização criada com sucesso!',
    newTeam: { name, slug, icon }
  };
};

export async function updateOrganization(
  slug: string,
  values: z.infer<typeof UpdateOrganizationSchema>
) {
  const user = await currentUser();
  if (!user) return { error: 'Não autorizado!' };

  const org = await db.organization.findUnique({ where: { slug } });
  if (!org) return { error: 'Organização não encontrada!' };

  if (org.ownerId !== user.id)
    return { error: 'Apenas o dono pode editar a organização!' };

  const validatedFields = UpdateOrganizationSchema.safeParse(values);
  if (!validatedFields.success) return { error: 'Dados inválidos!' };

  await db.organization.update({
    where: { slug },
    data: validatedFields.data
  });

  return { success: 'Organização atualizada com sucesso!' };
}

export async function deleteOrganization(slug: string) {
  const user = await currentUser();
  if (!user) return { error: 'Não autorizado!' };

  const org = await db.organization.findUnique({ where: { slug } });
  if (!org) return { error: 'Organização não encontrada!' };

  if (org.ownerId !== user.id)
    return { error: 'Apenas o dono pode excluir a organização!' };

  await db.organization.delete({ where: { slug } });

  return { success: 'Organização deletada com sucesso!' };
}

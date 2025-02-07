'use server';

import * as z from 'zod';
import { CreateOrganizationSchema } from '@/schemas';
import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const createOrganizationUser = async (
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
  return redirect(`/dashboard/${slug}/overview`);
};

import { db } from '@/lib/db';
import { currentUser } from '@/lib/auth';

export const createOrganizationInvites = async (
  invites: {
    email: string;
    organizationId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }[]
) => {
  const user = await currentUser();
  if (!user || !user.id) {
    return { error: 'Não autorizado!' };
  }

  const organizationIds = Array.from(
    new Set(invites.map((invite) => invite.organizationId))
  );
  const organizations = await db.organization.findMany({
    where: { id: { in: organizationIds } }
  });

  const validOrganizationIds = organizations.map((org) => org.id);
  const invalidInvites = invites.filter(
    (invite) => !validOrganizationIds.includes(invite.organizationId)
  );

  if (invalidInvites.length > 0) {
    return invalidInvites.map((invite) => ({
      email: invite.email,
      error: 'Organização não encontrada!'
    }));
  }

  const uniqueInvites = invites.filter(
    (invite, index, self) =>
      self.findIndex(
        (i) =>
          i.email === invite.email && i.organizationId === invite.organizationId
      ) === index
  );

  const invitesWithTokens = uniqueInvites.map((invite) => ({
    ...invite,
    token: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  try {
    const createdInvites = await db.invite.createMany({
      data: invitesWithTokens,
      skipDuplicates: true
    });

    return {
      success: `${createdInvites.count} convites criados com sucesso!`
    };
  } catch (error) {
    return { error: 'Erro ao criar convites. Tente novamente mais tarde.' };
  }
};

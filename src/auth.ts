import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';

import { getUserById } from '@/data/user';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { db } from '@/lib/db';
import authConfig from '@/auth.config';
import { getAccountByUserId } from './data/account';
import Stripe from 'stripe';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      });
    }
  },

  callbacks: {
    async signIn({ user, account }) {
      if (!user?.id) {
        return false;
      }

      if (account?.provider !== 'credentials') return true;

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: '2024-12-18.acacia'
      });

      // Verifica se já existe um cliente no Stripe com o e-mail do usuário
      const existingCustomers = await stripe.customers.list({
        email: user.email!,
        limit: 1
      });

      let stripeCustomerId: string;

      if (existingCustomers.data.length > 0) {
        // Cliente encontrado, usa o ID existente
        stripeCustomerId = existingCustomers.data[0].id;
      } else {
        // Cria um novo cliente no Stripe
        const newCustomer = await stripe.customers.create({
          email: user.email!
        });
        stripeCustomerId = newCustomer.id;
      }

      // Atualiza o registro do usuário no banco com o Stripe Customer ID
      await db.user.update({
        where: { id: user.id },
        data: {
          stripeCustomerId
        }
      });

      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email ?? '';
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.picture = existingUser.image;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig
});

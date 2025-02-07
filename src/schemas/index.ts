import * as z from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'USER']);

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  icon: z.string().optional()
});

export const CreateOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres.')
    .max(50, 'O nome deve ter no máximo 50 caracteres.'),
  slug: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'O slug deve conter apenas letras minúsculas, números e hífens.'
    )
    .min(3, 'O slug deve ter pelo menos 3 caracteres.')
    .max(50, 'O slug deve ter no máximo 50 caracteres.'),
  icon: z.string().min(1, 'O ícone é obrigatório.')
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'A valid email is required!'
  }),
  password: z.string().min(1, {
    message: 'Password is required!'
  }),
  code: z.string().optional()
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'A valid email is required!'
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters!'
  }),
  name: z.string().min(1, {
    message: 'Name is required!'
  })
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'A valid email is required!'
  })
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters!'
  })
});

export const InviteSchema = z.object({
  email: z.string().email('Email inválido!'),
  role: z.enum(['ADMIN', 'USER']).optional(),
  name: z.string().min(1, 'Nome é obrigatório!')
});

export const SettingsSchema = z.object({
  name: z.string().optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  image: z.string().optional(),
  role: UserRoleSchema.optional(),
  email: z.string().email().optional()
});

import * as z from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'USER']);

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

export const SettingsSchema = z.object({
  name: z.string().optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  image: z.string().optional(),
  role: UserRoleSchema.optional(),
  email: z.string().email().optional()
});

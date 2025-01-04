import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

const emailTemplate = (title: string, description: string, actionText: string, link: string) => `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #1a202c; color: #ffffff; padding: 20px;">
        <h1 style="margin: 0; font-size: 24px;">${title}</h1>
      </div>
      <div style="padding: 20px; text-align: left;">
        <p style="margin: 0 0 15px; font-size: 16px; color: #333333;">${description}</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${link}" style="display: inline-block; background-color: #3182ce; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 16px;">
            ${actionText}
          </a>
        </div>
        <p style="margin: 0; font-size: 14px; color: #999999;">Se você não fez esta solicitação, ignore este e-mail.</p>
      </div>
      <div style="background-color: #f1f1f1; padding: 10px; font-size: 12px; color: #666666;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Profood Embalagens. Todos os direitos reservados.</p>
      </div>
    </div>
  </div>
`;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  const html = emailTemplate(
    "Redefinir sua senha",
    "Clique no botão abaixo para redefinir sua senha.",
    "Redefinir Senha",
    resetLink
  );

  await resend.emails.send({
    from: "test@next.profood.com.br",
    to: email,
    subject: "Redefina sua senha",
    html,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const html = emailTemplate(
    "Confirme seu e-mail",
    "Clique no botão abaixo para confirmar seu endereço de e-mail.",
    "Confirmar E-mail",
    confirmLink
  );

  await resend.emails.send({
    from: "test@next.profood.com.br",
    to: email,
    subject: "Confirme seu e-mail",
    html,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const html = emailTemplate(
    "Seu código de autenticação de dois fatores",
    `Use o código abaixo para completar sua autenticação.`,
    "Código: " + token,
    "#"
  );

  await resend.emails.send({
    from: "test@next.profood.com.br",
    to: email,
    subject: "Código de 2FA",
    html,
  });
};

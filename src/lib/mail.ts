import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const emailFrom = process.env.EMAIL_FROM || 'default@example.com';
const domain = process.env.NEXTAUTH_URL;

const emailTemplate = (
  title: string,
  description: string,
  actionText: string,
  link: string
) => `
  <div style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f3f4f6;
    padding: 30px 0;
    text-align: center;
  ">
    <table border="0" cellspacing="0" cellpadding="0" align="center" style="
      max-width: 600px;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    ">
      <tr>
        <td style="background-color: #1f2937; padding: 20px;">
          🐶
          <h1 style="
            margin: 0;
            font-size: 24px;
            color: #ffffff;
            font-weight: 600;
          ">
            ${title}
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px 20px; text-align: left;">
          <p style="
            margin: 0 0 20px;
            font-size: 16px;
            line-height: 1.5;
            color: #4b5563;
          ">
            ${description}
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="${link}" 
              style="
                background: #4338ca;
                color: #ffffff;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-size: 16px;
                font-weight: 600;
                display: inline-block;
              "
            >
              ${actionText}
            </a>
          </div>
          <p style="
            font-size: 14px;
            color: #9ca3af;
            margin-top: 10px;
          ">
            Se você não fez esta solicitação, ignore este e-mail.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f9fafb; padding: 15px; text-align: center;">
          <p style="
            margin: 0;
            font-size: 12px;
            color: #6b7280;
          ">
            &copy; ${new Date().getFullYear()} 
            <strong style="color: #4338ca;">Doguin Starter SaaS v2</strong>. 
            Todos os direitos reservados.
          </p>
        </td>
      </tr>
    </table>
  </div>
`;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  const html = emailTemplate(
    'Redefinir sua senha',
    'Clique no botão abaixo para redefinir sua senha no Doguin Starter SaaS v2.',
    'Redefinir Senha',
    resetLink
  );

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: 'Redefina sua senha - Doguin',
    html
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  const html = emailTemplate(
    'Confirme seu e-mail',
    'Clique no botão abaixo para confirmar seu endereço de e-mail no Doguin Starter SaaS v2.',
    'Confirmar E-mail',
    confirmLink
  );

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: 'Confirmação de E-mail - Doguin',
    html
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const html = emailTemplate(
    'Seu código de autenticação de dois fatores',
    `Use o código abaixo para completar sua autenticação no Doguin Starter SaaS v2.`,
    `Código de 2FA: ${token}`,
    '#'
  );

  await resend.emails.send({
    from: emailFrom,
    to: email,
    subject: 'Código de 2FA - Doguin',
    html
  });
};

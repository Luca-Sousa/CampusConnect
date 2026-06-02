/**
 * Templates HTML para e-mails transacionais do CampusConnect.
 * Funções puras — sem efeitos colaterais.
 */

// ——— E-mails com código OTP ———

export function buildOtpEmailHtml(otp: string): string {
  return buildOtpTemplate({
    title: "Verificação de e-mail",
    body: "Use o código abaixo para verificar seu endereço de e-mail no CampusConnect.",
    otp,
  });
}

export function buildResetPasswordOtpEmailHtml(otp: string): string {
  return buildOtpTemplate({
    title: "Redefinição de senha",
    body: "Use o código abaixo para redefinir sua senha no CampusConnect.",
    otp,
  });
}

export function buildSignInOtpEmailHtml(otp: string): string {
  return buildOtpTemplate({
    title: "Código de acesso",
    body: "Use o código abaixo para acessar sua conta no CampusConnect. Não compartilhe este código com ninguém.",
    otp,
  });
}

// ——— E-mails de confirmação / notificação ———

export function buildWelcomeEmailHtml(name: string): string {
  return buildNotificationTemplate({
    title: "Bem-vindo ao CampusConnect!",
    name,
    body: "Sua conta foi criada com sucesso. Acesse o CampusConnect para se conectar com a comunidade do IFCE, acompanhar eventos, notícias e muito mais.",
    footer: "Se você não criou esta conta, ignore este e-mail.",
  });
}

export function buildNewLoginEmailHtml(name: string): string {
  return buildNotificationTemplate({
    title: "Novo acesso à sua conta",
    name,
    body: "Detectamos um novo acesso à sua conta. Se foi você, pode ignorar este e-mail com segurança. Caso não reconheça este acesso, redefina sua senha imediatamente.",
    footer: "Por segurança, nunca compartilhe sua senha com ninguém.",
  });
}

export function buildPasswordChangedEmailHtml(name: string): string {
  return buildNotificationTemplate({
    title: "Senha alterada com sucesso",
    name,
    body: "Sua senha foi alterada com sucesso. Se você realizou esta alteração, pode ignorar este e-mail. Caso não tenha sido você, entre em contato com o suporte imediatamente.",
    footer: "Por segurança, nunca compartilhe sua senha com ninguém.",
  });
}

// ——— Builders privados ———

function buildOtpTemplate({
  title,
  body,
  otp,
}: {
  title: string;
  body: string;
  otp: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>${title} - CampusConnect</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="color: #16a34a; font-size: 24px; margin: 0 0 8px;">CampusConnect</h1>
    <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px;">${title}</h2>
    <p style="color: #6b7280; margin: 0 0 24px;">${body}</p>
    <div style="font-size: 42px; font-weight: 700; letter-spacing: 14px; text-align: center; padding: 24px; background: #f3f4f6; border-radius: 10px; margin: 0 0 24px; color: #111827; font-family: monospace;">
      ${otp}
    </div>
    <p style="color: #6b7280; margin: 0 0 4px;">
      Este código expira em <strong>5 minutos</strong>.
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      Se você não solicitou este código, ignore este e-mail.
    </p>
  </div>
</body>
</html>`;
}

function buildNotificationTemplate({
  title,
  name,
  body,
  footer,
}: {
  title: string;
  name: string;
  body: string;
  footer: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>${title} - CampusConnect</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="color: #16a34a; font-size: 24px; margin: 0 0 8px;">CampusConnect</h1>
    <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px;">${title}</h2>
    <p style="color: #374151; margin: 0 0 12px;">Olá, <strong>${name}</strong>!</p>
    <p style="color: #6b7280; margin: 0 0 24px; line-height: 1.6;">${body}</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">${footer}</p>
  </div>
</body>
</html>`;
}

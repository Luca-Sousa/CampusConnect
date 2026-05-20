/**
 * Templates HTML para e-mails transacionais do CampusConnect.
 */

export function buildOtpEmailHtml(otp: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Código de verificação - CampusConnect</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="color: #16a34a; font-size: 24px; margin: 0 0 8px;">CampusConnect</h1>
    <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px;">Verificação de e-mail</h2>
    <p style="color: #6b7280; margin: 0 0 24px;">
      Use o código abaixo para verificar seu endereço de e-mail no CampusConnect.
    </p>
    <div style="font-size: 42px; font-weight: 700; letter-spacing: 14px; text-align: center; padding: 24px; background: #f3f4f6; border-radius: 10px; margin: 0 0 24px; color: #111827; font-family: monospace;">
      ${otp}
    </div>
    <p style="color: #6b7280; margin: 0 0 4px;">
      Este código expira em <strong>5 minutos</strong>.
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      Se você não criou uma conta no CampusConnect, ignore este e-mail.
    </p>
  </div>
</body>
</html>`;
}

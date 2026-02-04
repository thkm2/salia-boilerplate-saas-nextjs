export const APP_NAME = "Salia";

export function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:40px">
        ${content}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const emailComponents = {
  header: (title: string = APP_NAME) =>
    `<tr><td style="font-size:20px;font-weight:700;color:#111;padding-bottom:8px">${title}</td></tr>`,

  text: (content: string) =>
    `<tr><td style="font-size:15px;color:#374151;line-height:1.6;padding-bottom:24px">${content}</td></tr>`,

  button: (label: string, url: string) =>
    `<tr><td style="padding-bottom:32px">
      <a href="${url}" style="display:inline-block;padding:12px 32px;background:#111;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px">
        ${label}
      </a>
    </td></tr>`,

  footer: (content: string) =>
    `<tr><td style="border-top:1px solid #f3f4f6;padding-top:20px;font-size:12px;color:#9ca3af;line-height:1.5">${content}</td></tr>`,
};

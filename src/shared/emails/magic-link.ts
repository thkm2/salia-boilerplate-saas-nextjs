import { emailLayout, emailComponents, APP_NAME } from "./base";

export function magicLinkEmail(url: string): string {
  const safeUrl = encodeURI(url);

  return emailLayout(`
    ${emailComponents.header()}
    ${emailComponents.text(`Tap the button below to sign in to your account. This link expires in 10 minutes.`)}
    ${emailComponents.button(`Sign in to ${APP_NAME}`, safeUrl)}
    ${emailComponents.footer(`If you didn't request this email, you can safely ignore it. Your account won't be affected.`)}
  `);
}

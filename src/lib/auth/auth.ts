import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const safeUrl = encodeURI(url);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
          to: email,
          subject: "Sign in to Salia",
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:460px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:40px">
        <tr><td style="font-size:20px;font-weight:700;color:#111;padding-bottom:8px">Salia</td></tr>
        <tr><td style="font-size:15px;color:#374151;line-height:1.6;padding-bottom:24px">
          Tap the button below to sign in to your account. This link expires in 10 minutes.
        </td></tr>
        <tr><td style="padding-bottom:32px">
          <a href="${safeUrl}" style="display:inline-block;padding:12px 32px;background:#111;color:#fff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px">
            Sign in to Salia
          </a>
        </td></tr>
        <tr><td style="border-top:1px solid #f3f4f6;padding-top:20px;font-size:12px;color:#9ca3af;line-height:1.5">
          If you didn&rsquo;t request this email, you can safely ignore it. Your account won&rsquo;t be affected.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        });
      },
    }),
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
      plan: {
        type: "string",
        required: true,
        defaultValue: "free",
      },
      credits: {
        type: "number",
        required: true,
        defaultValue: 0,
      },
      firstLoginAt: {
        type: "date",
        required: false,
      },
      lastLoginAt: {
        type: "date",
        required: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!user.name) {
            return { data: { ...user, name: user.email.split("@")[0] } };
          }
          return { data: user };
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          try {
            // Update lastLoginAt on every new session
            const user = await db.query.user.findFirst({
              where: (users, { eq: eqOp }) => eqOp(users.id, session.userId),
            });

            if (user) {
              const updates: { lastLoginAt: Date; firstLoginAt?: Date } = {
                lastLoginAt: new Date(),
              };

              // Set firstLoginAt if it's the first time
              if (!user.firstLoginAt) {
                updates.firstLoginAt = new Date();
              }

              await db
                .update(schema.user)
                .set(updates)
                .where(eq(schema.user.id, session.userId));
            }
          } catch (error) {
            // Log error but don't fail session creation
            console.error("Failed to update login timestamps:", error);
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

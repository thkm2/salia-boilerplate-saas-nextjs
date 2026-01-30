import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
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

  // Magic Link configuration (to be enabled later with Resend)
  // plugins: [
  //   magicLink({
  //     sendMagicLink: async ({ email, url, token }) => {
  //       // TODO: Implement with Resend
  //       // await resend.emails.send({
  //       //   from: "noreply@yourdomain.com",
  //       //   to: email,
  //       //   subject: "Sign in to your account",
  //       //   html: `<a href="${url}">Click here to sign in</a>`,
  //       // });
  //     },
  //   }),
  // ],

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

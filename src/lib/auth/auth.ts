import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/email";
import { magicLinkEmail } from "@/shared/emails/magic-link";
import { APP_NAME } from "@/shared/emails/base";

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
        await sendEmail({
          to: email,
          subject: `Sign in to ${APP_NAME}`,
          html: magicLinkEmail(url),
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
      stripeCustomerId: {
        type: "string",
        required: false,
      },
      stripeSubscriptionId: {
        type: "string",
        required: false,
      },
      creditsResetAt: {
        type: "date",
        required: false,
      },
      paymentFailed: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const data = { ...user };
          if (!data.name) {
            data.name = data.email.split("@")[0];
          }
          // Initialize free plan credits and reset timestamp
          data.credits = 10;
          data.creditsResetAt = new Date();
          return { data };
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          try {
            const user = await db.query.user.findFirst({
              where: (users, { eq: eqOp }) => eqOp(users.id, session.userId),
            });

            if (user) {
              const updates: { lastLoginAt: Date; firstLoginAt?: Date } = {
                lastLoginAt: new Date(),
              };

              if (!user.firstLoginAt) {
                updates.firstLoginAt = new Date();
              }

              await db
                .update(schema.user)
                .set(updates)
                .where(eq(schema.user.id, session.userId));
            }
          } catch (error) {
            console.error("Failed to update login timestamps:", error);
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

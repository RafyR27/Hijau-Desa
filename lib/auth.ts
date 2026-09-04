import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { admin } from "better-auth/plugins";
import environment from "@/config/environment";
import { Resend } from "resend";
import ResetPasswordEmail from "@/components/commons/Emails/ResetPassword";

const resend = new Resend(environment.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: environment.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: environment.GOOGLE_CLIENT_ID as string,
      clientSecret: environment.GOOGLE_CLIENT_SECRET as string,
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },

  session: {
    expiresIn: 1296000,
    updateAge: 86400,
  },

  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },

    additionalFields: {
      role: {
        type: "string",
        defaultValue: "warga",
      },
      statusVerifikasi: {
        type: "boolean",
        defaultValue: false,
      },
      newAccount: {
        type: "boolean",
        defaultValue: true,
      },
      noHP: {
        type: "string",
        defaultValue: "",
      },
      noRumah: {
        type: "string",
        defaultValue: "",
      },
    },
  },

  emailAndPassword: {
    enabled: true,

    resetPasswordTokenExpiresIn: 600,

    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "Hijau Desa <noreply@contact.hijaudesa.site>",
        to: user.email,
        subject: "Atur Ulang Password - Hijau Desa",
        react: ResetPasswordEmail({
          userName: user.name,
          resetUrl: url,
        }),
      });
    },
  },

  plugins: [
    admin({
      defaultRole: "warga",
    }),
  ],
});

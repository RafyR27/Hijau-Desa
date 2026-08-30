import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

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
  },

  plugins: [admin({
    defaultRole: "warga"
  })],
});

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { verifyOtp } from "@/lib/auth/otp";
import { OtpPurpose } from "@prisma/client";
import { logLogin } from "@/lib/auth/audit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: "otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
        purpose: { label: "Purpose", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const code = credentials?.code as string;
        const purpose =
          credentials?.purpose === "RECOVERY"
            ? OtpPurpose.RECOVERY
            : OtpPurpose.LOGIN;

        if (!email || !code) return null;

        const admin = await prisma.admin.findFirst({
          where: {
            isActive: true,
            OR: [{ primaryEmail: email }, { backupEmail: email }],
          },
        });

        if (!admin) {
          await logLogin({ email, success: false });
          return null;
        }

        const result = await verifyOtp(email, code, purpose);
        if (!result.success) {
          await logLogin({ email, success: false, adminId: admin.id });
          return null;
        }

        await logLogin({
          email,
          success: true,
          adminId: admin.id,
        });

        return {
          id: admin.id,
          email: admin.primaryEmail,
          name: "Super Admin",
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  trustHost: true,
});

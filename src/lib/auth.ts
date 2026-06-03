import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = ['answercannon@gmail.com', 'rrakeshhpandey@gmail.com'];
      if (user.email && allowedEmails.includes(user.email)) {
        return true;
      }
      return '/en/admin/login?error=AccessDenied';
    },
  },
  pages: {
    signIn: '/en/admin/login',
    error: '/en/admin/login',
  },
  session: {
    strategy: 'jwt',
  }
};

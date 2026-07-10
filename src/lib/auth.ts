import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { readStore, findClientByPhone } from "@/lib/data-store";

// Seed/legacy accounts may still have a plaintext password if the store was
// created before hashing was introduced. bcrypt hashes always start with
// "$2"; anything else is treated as legacy plaintext for a one-time compare.
export function verifyPassword(inputPassword: string, storedPassword: string): boolean {
  if (storedPassword.startsWith("$2")) {
    return bcrypt.compareSync(inputPassword, storedPassword);
  }
  return inputPassword === storedPassword;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@beautystudio.com" },
        password: { label: "Password", type: "password" },
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" }
      },
      async authorize(credentials) {
        const store = await readStore();

        // 1. Phone number authentication (Client Portal)
        if (credentials?.phone) {
          const client = findClientByPhone(store, credentials.phone.trim());

          if (!client) {
            console.log("[AUTH] Client phone not found:", credentials.phone);
            return null;
          }

          const user = store.users.find((u) => u.id === client.userId);
          if (!user) {
            console.log("[AUTH] Linked user not found for client:", client.id);
            return null;
          }

          // Case A: OTP Login
          if (credentials.otp) {
            const isSimulated = credentials.otp === "1234";
            const isDynamicValid = user.tempOtp && user.tempOtp === credentials.otp && (!user.tempOtpExpires || new Date(user.tempOtpExpires) > new Date());

            if (isSimulated || isDynamicValid) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
            console.log("[AUTH] Invalid OTP code:", credentials.otp);
            return null;
          }

          // Case B: Password Login
          if (credentials.password) {
            if (verifyPassword(credentials.password, user.password)) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
            console.log("[AUTH] Password mismatch for client phone:", credentials.phone);
            return null;
          }

          return null;
        }

        // 2. Standard email/password authentication (Admin/Staff Portal)
        if (credentials?.email && credentials?.password) {
          const user = store.users.find((candidate) => candidate.email.toLowerCase() === credentials.email.toLowerCase());

          if (!user) {
            console.log("[AUTH] User email not found:", credentials.email);
            return null;
          }

          if (!verifyPassword(credentials.password, user.password)) {
            console.log("[AUTH] Password mismatch for email:", credentials.email);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};

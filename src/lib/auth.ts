import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { readStore } from "@/lib/data-store";

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
          const phoneInput = credentials.phone.trim();
          
          // Find the client with this phone number (ignoring spacing or formatting variations)
          const client = store.clients.find((c) => {
            if (!c.phone) return false;
            const cleanC = c.phone.replace(/[\s\-\+\(\)]/g, "");
            const cleanInput = phoneInput.replace(/[\s\-\+\(\)]/g, "");
            return cleanC.endsWith(cleanInput) || cleanInput.endsWith(cleanC);
          });

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
            if (credentials.otp === "1234") {
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
            if (user.password === credentials.password) {
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

          if (user.password !== credentials.password) {
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

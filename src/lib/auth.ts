// src/lib/auth.ts
import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/crypto"
import { env } from "@/config/env"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }
}

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      })

      if (!user || !user.password) return null

      const isValid = await comparePassword(credentials.password, user.password)

      if (!isValid) return null

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Explicit rather than relying on NextAuth's own process.env.NEXTAUTH_SECRET
  // fallback: src/config/env.ts validates and fails fast (in production)
  // with a clear, actionable error instead of NextAuth's generic
  // MissingSecretError 500 on every auth-touching route.
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        // On récupère le rôle si présent dans le token ou via une requête prisma si nécessaire
        // Pour l'instant on garde la compatibilité avec ce qui semblait être attendu
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
}

export default NextAuth(authOptions)

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/crypto"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Email & Mot de passe",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.hashedPassword) return null
        const isValid = await comparePassword(
          credentials.password as string,
          user.hashedPassword
        )
        return isValid ? user : null
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      session.user.role = user.role
      return session
    },
  },
  pages: {
    signIn: "/auth/connexion",
    error: "/auth/erreur",
    newUser: "/onboarding",
  },
})

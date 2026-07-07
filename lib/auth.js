const CredentialsProvider = require("next-auth/providers/credentials").default;
const bcrypt = require("bcryptjs");

// There is intentionally no sign-up flow and no user database table.
// The only account that can ever exist is defined by these two env vars,
// so you are the only person who can ever authenticate as host.
const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/", // we use an in-page modal instead of a dedicated route
  },
  providers: [
    CredentialsProvider({
      name: "Host Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error(
            "Server is missing ADMIN_EMAIL / ADMIN_PASSWORD_HASH env vars."
          );
        }

        const emailMatches =
          credentials.email.trim().toLowerCase() === adminEmail.toLowerCase();
        if (!emailMatches) return null;

        const passwordMatches = await bcrypt.compare(
          credentials.password,
          adminPasswordHash
        );
        if (!passwordMatches) return null;

        return { id: "host", email: adminEmail, name: "Host" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.isHost = true;
      return token;
    },
    async session({ session, token }) {
      session.isHost = Boolean(token.isHost);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

module.exports = { authOptions };

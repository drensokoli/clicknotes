import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

const db = process.env.NEXT_PUBLIC_MONGODB_DB_NAME;

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: db,
    collections: {
      sessions: "sessions",
      users: "users",
      verificationRequests: "verificationRequests",
    },
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async signIn(user, account, profile) {
      if (account.provider === 'google') {
        return true;
      }
      return false;
    },
    async redirect(url, baseUrl) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});

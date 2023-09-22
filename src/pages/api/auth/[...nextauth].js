import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../mongodb"

const db = process.env.MONGODB_DB_NAME;

export const authOptions = {
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
  secret: process.env.JWT_SECRET
};

export default (req, res) => NextAuth(req, res, authOptions);
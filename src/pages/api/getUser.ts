import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userEmail } = req.body;

    const dbName = process.env.NEXT_PUBLIC_MONGODB_DB_NAME;

    const client = await clientPromise;
    const collection = client.db(dbName).collection('users');
    const user = await collection.findOne({ email: userEmail });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

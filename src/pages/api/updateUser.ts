import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from './mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body;

    const dbName = process.env.MONGODB_DB_NAME;
    const dbCollection = process.env.MONGODB_COLLECTION;

    if (!dbName || !dbCollection) {
      throw new Error('Database name or collection not defined');
    }

    const client = await clientPromise;
    const collection = client.db(dbName)?.collection(dbCollection);
    const result = await collection.updateOne({ email: data.userEmail }, { $set: data });

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'User data updated successfully' });
    } else {
      res.status(400).json({ message: 'Failed to update user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

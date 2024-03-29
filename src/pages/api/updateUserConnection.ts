import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from './mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userEmail, data, templateId, type } = req.body;

    const dbName = process.env.MONGODB_DB_NAME;
    const dbCollection = 'connections';

    if (!dbName || !dbCollection) {
      throw new Error('Database name or collection not defined');
    }

    const client = await clientPromise;
    const collection = client.db(dbName)?.collection(dbCollection);
    let result;

    result = await collection.updateOne(
      { email: userEmail, connection_type: type },
      { $set: data === null ? { template_id: templateId } : { ...data, template_id: templateId } },
      { upsert: true }
    );

    if (result.upsertedCount > 0 || result.modifiedCount > 0) {
      const successMessage = result.upsertedCount > 0 ? 'created' : 'updated';
      res.status(200).json({ message: `User data ${successMessage} successfully` });
    } else {
      res.status(400).json({ message: 'Failed to update user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
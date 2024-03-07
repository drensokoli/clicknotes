import type { NextApiRequest, NextApiResponse } from 'next';
import { clientPromise } from './mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userEmail, connectionType } = req.body;

    const dbName = process.env.MONGODB_DB_NAME;
    const dbCollection = 'connections';

    if (!dbName || !dbCollection) {
      throw new Error('Database name or collection not defined');
    }

    const client = await clientPromise;
    const collection = client.db(dbName)?.collection(dbCollection);
    const connection = await collection?.findOne({ email: userEmail, connection_type: connectionType });
    
    if (connection) {
      res.status(200).json(connection);
    } else {
      res.status(404).json({ message: 'Connection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

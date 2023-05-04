import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from "mongodb";
import clientPromise from '../../lib/mongodb';

async function updateProfile(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, updatedProfile } = req.body;

    try {
      const client = await clientPromise;
      const usersCollection = client
        .db(process.env.NEXT_PUBLIC_MONGODB_DB_NAME)
        .collection('users');

      await usersCollection.updateOne(
        { email: email },
        { $set: updatedProfile }
      );

      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export default updateProfile;

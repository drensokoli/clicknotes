import { NextApiRequest, NextApiResponse } from 'next';
import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL");
}

const redis = new Redis(process.env.REDIS_URL);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const data = await redis.get('bestsellers');
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { bestsellers } = req.body;
    await redis.set('bestsellers', JSON.stringify(bestsellers), 'EX', 7 * 24 * 60 * 60);
    res.status(200).json({ message: 'Data stored successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

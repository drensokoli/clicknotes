import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from 'redis';

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT as any;
const redisPassword = process.env.REDIS_PASSWORD;

const client = createClient({
    password: redisPassword,
    socket: {
        host: redisHost,
        port: redisPort
    }
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const data = await client.get('bestsellers');
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { bestsellers } = req.body;
    await client.set('bestsellers', JSON.stringify(bestsellers), { EX: 7 * 24 * 60 * 60 });
    res.status(200).json({ message: 'Data stored successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

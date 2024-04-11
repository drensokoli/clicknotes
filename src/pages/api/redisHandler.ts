import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@redis/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {

  const redisHost = process.env.REDIS_HOST;
  const redisPassword = process.env.REDIS_PASSWORD;

  const client = createClient({
    password: redisPassword,
    username: "default",
    socket: {
      host: redisHost,
      port: 13669
    }
  });

  client.connect().catch(console.error);

  if (req.method === 'GET') {
    const data = await client.get('bestsellers');
    res.status(200).json(data);
  } else if (req.method === 'POST') {
    const { bestsellers } = req.body;
    await client.set('bestsellers', JSON.stringify(bestsellers));
    res.status(200).json({ message: 'Data stored successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

// pages/api/redisHandler.js
import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL");
}

const redis = new Redis(process.env.REDIS_URL);

export default async (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { data: string | null; }): void; new(): any; }; }; }) => {
    const cacheData = await redis.get('bestsellers');
    res.status(200).json({ data: cacheData });
};

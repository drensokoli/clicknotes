import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri: string = process.env.MONGODB_URI!;
const options = {};

declare global {
    var mongoClientPromise: Promise<MongoClient>;
}

// Use a global variable to store the connection promise
// This ensures that only one connection is created and reused
if (!global.mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global.mongoClientPromise = client.connect();
}

export default global.mongoClientPromise;

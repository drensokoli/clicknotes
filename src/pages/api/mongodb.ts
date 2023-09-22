import { MongoClient } from "mongodb";
import { getServerSideProps } from "../profile";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri:string = process.env.MONGODB_URI!;
const options = {};

let client;
export let clientPromise: Promise<MongoClient>;

client = new MongoClient(uri, options);
clientPromise = client.connect();

export default client;
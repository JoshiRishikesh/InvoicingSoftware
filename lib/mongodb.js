// lib/mongodb.js

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Database connection error");
  }
}

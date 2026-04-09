const { MongoClient } = require('mongodb');

let db;

async function connectDB() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    db = client.db(process.env.DB_NAME);
    console.log(`Connected to MongoDB database: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }

  return db;
}

module.exports = { connectDB, getDB };

import redis from 'redis';
import dotenv from "dotenv";

dotenv.config();

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

client.on('error', err => console.log('❌ Redis Client Error:', err));

// Connect and log success
async function connectRedis() {
  try {
    await client.connect();
    console.log("✅ Redis connected successfully!");
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
}

connectRedis();

export default client;

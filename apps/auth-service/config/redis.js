import Redis from "ioredis";
import dotenv from "dotenv";

const client =  new Redis(process.env.REDIS_URL);

client.on('connect', () => {
  console.log('Connected to Redis...');
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});


// Call the test function
export default client;
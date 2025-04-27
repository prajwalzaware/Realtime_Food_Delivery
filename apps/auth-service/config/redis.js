import redis from 'redis';

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379' // Explicitly use IPv4
});

client.on('connect', () => {
  console.log('Connected to Redis...');
});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});


// Call the test function
export default client;
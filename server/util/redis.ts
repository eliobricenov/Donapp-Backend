import * as redis from 'redis';
import { createHandyClient } from 'handy-redis';

const host = process.env.redisHost || '127.0.0.1';
const port = process.env.redisPort || '6379';

export const redisClient = redis.createClient();

export const redisClientAsync = createHandyClient(redisClient);


redisClient.on('connect', () => console.log('redis connected'));

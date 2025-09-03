import { Redis } from "ioredis";
import crypto from "crypto";

const redis = new Redis(process.env.REDIS_HOST || "redis://localhost:6379", {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    connectTimeout: 1000
});

let isRedisConnected = false;
let connectionWarningShown = false;

// Handle Redis connection events
redis.on('error', (error) => {
    isRedisConnected = false;
    if (!connectionWarningShown) {
        console.warn('⚠️  Redis connection failed - Private message functionality disabled');
        console.warn('   To enable Redis: Install Docker and run "docker run -d -p 6379:6379 redis"');
        connectionWarningShown = true;
    }
});

redis.on('connect', () => { 
    isRedisConnected = true;
    console.log('✅ Redis connected successfully');
});

redis.on('ready', () => {
    isRedisConnected = true;
});

const EXPIRATION_TIME = 60 * 60 * 24; // 1 day

interface PrivateMessage {
    from: number;
    to: number;
    message: string;
}

export const storePrivateMessage = async (from: number, to: number, message: string): Promise<string> => {
    const hash = crypto.createHash("sha256")
        .update(`${from}_${to}_${message}_${Date.now()}`)
        .digest("hex")
        .slice(0, 12);

    if (!isRedisConnected) {
        console.warn('Redis not available, cannot store private message');
        return hash; // Return hash anyway so the flow continues
    }

    try {
        const data: PrivateMessage = { from, to, message };
        await redis.setex(`private:${hash}`, EXPIRATION_TIME, JSON.stringify(data));
        return hash;
    } catch (error) {
        console.error('Failed to store private message:', error);
        return hash; // Return hash anyway
    }
}

export const getPrivateMessage = async (hash: string): Promise<PrivateMessage | null> => {
    if (!isRedisConnected) {
        console.warn('Redis not available, cannot retrieve private message');
        return null;
    }

    try {
        const data = await redis.get(`private:${hash}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to get private message:', error);
        return null;
    }
}

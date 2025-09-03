import { Redis } from "ioredis";
import crypto from "crypto";

const redis = new Redis(process.env.REDIS_HOST || "redis://localhost:6379");

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

    const data: PrivateMessage = { from, to, message };
    await redis.setex(`private:${hash}`, EXPIRATION_TIME, JSON.stringify(data));
    return hash;
}

export const getPrivateMessage = async (hash: string): Promise<PrivateMessage | null> => {
    const data = await redis.get(`private:${hash}`);
    return data ? JSON.parse(data) : null;
}

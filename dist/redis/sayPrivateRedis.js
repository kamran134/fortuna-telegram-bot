"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateMessage = exports.storePrivateMessage = void 0;
const tslib_1 = require("tslib");
const ioredis_1 = require("ioredis");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const redis = new ioredis_1.Redis(process.env.REDIS_HOST || "redis://localhost:6379");
const EXPIRATION_TIME = 60 * 60 * 24; // 1 day
const storePrivateMessage = async (from, to, message) => {
    const hash = crypto_1.default.createHash("sha256")
        .update(`${from}_${to}_${message}_${Date.now()}`)
        .digest("hex")
        .slice(0, 12);
    const data = { from, to, message };
    await redis.setex(`private:${hash}`, EXPIRATION_TIME, JSON.stringify(data));
    return hash;
};
exports.storePrivateMessage = storePrivateMessage;
const getPrivateMessage = async (hash) => {
    const data = await redis.get(`private:${hash}`);
    return data ? JSON.parse(data) : null;
};
exports.getPrivateMessage = getPrivateMessage;
//# sourceMappingURL=sayPrivateRedis.js.map
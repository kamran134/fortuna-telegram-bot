interface PrivateMessage {
    from: number;
    to: number;
    message: string;
}
export declare const storePrivateMessage: (from: number, to: number, message: string) => Promise<string>;
export declare const getPrivateMessage: (hash: string) => Promise<PrivateMessage | null>;
export {};
//# sourceMappingURL=sayPrivateRedis.d.ts.map
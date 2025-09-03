import pkg from 'pg';
export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}
export declare const pool: pkg.Pool;
//# sourceMappingURL=config.d.ts.map
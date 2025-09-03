"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const tslib_1 = require("tslib");
const pg_1 = tslib_1.__importDefault(require("pg"));
const { Pool } = pg_1.default;
exports.pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'fortuna',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
});
//# sourceMappingURL=config.js.map
import pg from 'pg';
const { Pool } = pg;

const createDbPool = async () => {
    try {
        const poolConfig = {
            host: process.env.DB_HOST, // secrets.host,
            database: process.env.DB_DATABASE, //secrets.dbClusterIdentifier,
            user: process.env.DB_USER, //secrets.username,
            password: process.env.DB_PASSWORD, // secrets.password,
            port: process.env.DB_PORT, // secrets.port,
            ssl: { rejectUnauthorized: false },
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000
        };
        const dbPool = new Pool(poolConfig);
        return dbPool;
    } catch (error) {
        console.error('Error while setting up database connection:', error);
        throw error;
    }
}
let pool = null;
export const getDBPool = async () => {
    if (!pool) {
        pool = await createDbPool();
    }
    return pool;
}

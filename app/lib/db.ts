
import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: 5432,
    ssl: {
        rejectUnauthorized: false, // Required for Koyeb/most cloud PGs if cert isn't pre-configured
    },
});

export default pool;

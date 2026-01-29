
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            // Create table if not exists
            // We'll store a single record for the user's portfolio for simplicity in this demo
            // or key it by a fixed user_id if we wanted multi-user (but auth isn't in scope).
            // Let's use a fixed ID = 1 for this simulation.
            await client.query(`
        CREATE TABLE IF NOT EXISTS portfolio (
          id SERIAL PRIMARY KEY,
          usdt_balance DECIMAL(20, 8) DEFAULT 10000.00,
          btc_balance DECIMAL(20, 8) DEFAULT 0.00,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

            // Insert default row if empty
            const checkDetails = await client.query('SELECT * FROM portfolio WHERE id = 1');
            if (checkDetails.rowCount === 0) {
                await client.query(`
          INSERT INTO portfolio (id, usdt_balance, btc_balance)
          VALUES (1, 10000.00, 0.00)
        `);
            }

            return NextResponse.json({ message: 'Database initialized successfully' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Database setup error:', error);
        return NextResponse.json({ error: 'Failed to setup database', details: String(error) }, { status: 500 });
    }
}

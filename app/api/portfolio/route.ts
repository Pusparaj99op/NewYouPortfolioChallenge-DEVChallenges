
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        try {
            const res = await client.query('SELECT * FROM portfolio WHERE id = 1');
            if (res.rowCount === 0) {
                // Fallback if not init
                return NextResponse.json({ usdt_balance: 10000, btc_balance: 0 });
            }
            return NextResponse.json(res.rows[0]);
        } finally {
            client.release();
        }
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, price, quantity } = body;
        // action: 'BUY' | 'SELL'
        // price: number (BTC price at execution)
        if (!action || !price) { // quantity implies BTC amount
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const res = await client.query('SELECT * FROM portfolio WHERE id = 1 FOR UPDATE');
            const portfolio = res.rows[0];

            let newUsdt = parseFloat(portfolio.usdt_balance);
            let newBtc = parseFloat(portfolio.btc_balance);
            const tradeValue = price * quantity;

            if (action === 'BUY') {
                // Buy BTC with USDT (amount specified in USDT usually, but let's assume quantity is BTC amount for simplicity in calculation above?
                // Let's assume quantity is passed as BTC amount to buy/sell
                if (newUsdt < tradeValue) {
                    await client.query('ROLLBACK');
                    return NextResponse.json({ error: 'Insufficient USDT balance' }, { status: 400 });
                }
                newUsdt -= tradeValue;
                newBtc += quantity;
            } else if (action === 'SELL') {
                if (newBtc < quantity) {
                    await client.query('ROLLBACK');
                    return NextResponse.json({ error: 'Insufficient BTC balance' }, { status: 400 });
                }
                newUsdt += tradeValue;
                newBtc -= quantity;
            } else {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
            }

            await client.query(
                'UPDATE portfolio SET usdt_balance = $1, btc_balance = $2, updated_at = NOW() WHERE id = 1',
                [newUsdt, newBtc]
            );

            await client.query('COMMIT');

            return NextResponse.json({
                success: true,
                usdt_balance: newUsdt,
                btc_balance: newBtc
            });

        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Trade error:', error);
        return NextResponse.json({ error: 'Trade execution failed', details: String(error) }, { status: 500 });
    }
}


import { NextResponse } from 'next/server';

export async function GET() {
    const apiKey = process.env.BINANCE_API_KEY;
    const baseUrl = 'https://api.binance.com';

    if (!apiKey) {
        return NextResponse.json({ error: 'Binance API Key not configured' }, { status: 500 });
    }

    try {
        // Fetch Ticker Price
        const response = await fetch(`${baseUrl}/api/v3/ticker/price?symbol=BTCUSDT`, {
            headers: {
                'X-MBX-APIKEY': apiKey,
            },
            next: { revalidate: 1 }, // Cache for 1 second max
        });

        if (!response.ok) {
            throw new Error(`Binance API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Also try to get 24h ticker for change stats if possible, or just return price
        // Let's stick to price for speed, maybe 24h stats separately if needed.
        // Actually, ticker/24hr gives price change too.

        return NextResponse.json(data);
    } catch (error) {
        console.error('Market data fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
    }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Portfolio context for the AI
const PORTFOLIO_CONTEXT = `
You are an AI assistant for Pranay Gajbhiye's portfolio website. Pranay is the Founder of BlackObsidian AMC (Asset Management Company) based in UAE.

Key Information about Pranay:
- Full Name: Pranay Gajbhiye
- Role: Founder & Quantitative Trader at BlackObsidian AMC
- Location: UAE / India
- Email: pranaykgajbhiye@gmail.com
- Born: September 6, 2005

Background:
- Tech Enthusiast, Coder, and Web Developer
- Passionate about Finance, Quantitative Analysis, and Technology
- Specializes in systematic trading, order flow analytics, and market microstructure research
- Constantly learning and exploring new technologies

Technical Skills:
- Languages: Python, JavaScript/TypeScript, R, SQL
- Frontend: React, Next.js, Tailwind CSS
- Data Science: pandas, NumPy, Machine Learning
- Finance: Algorithmic Trading, Order Flow Analysis, Risk Management

Interests: Finance, Quant Analysis, Technology, Reading Books, Economy, Mathematics, Traveling, Investing

Social Links:
- GitHub: github.com/Pusparaj99op
- LinkedIn: linkedin.com/in/pranaygajbhiye
- Twitter/X: twitter.com/pranaygajbhiye7
- DEV.to: dev.to/pusparaj99op

Projects include:
1. Order Flow Analysis Dashboard - Real-time order flow visualization
2. Algorithmic Trading Bot - Automated trading with backtesting
3. Market Data Pipeline - High-performance data processing
4. Portfolio Risk Analytics - VaR calculations and stress testing
5. Smart City Dashboard - AI-driven city management

Instructions:
- Be helpful, professional, and friendly
- Answer questions about Pranay's experience, skills, and projects
- For non-portfolio questions, politely redirect to relevant topics
- Keep responses concise but informative
- If asked about hiring or collaboration, encourage contacting via email
`;

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Check for API key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback response if no API key
            return NextResponse.json({
                reply: getFallbackResponse(message),
                timestamp: new Date().toISOString(),
            });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Generate response
        const prompt = `${PORTFOLIO_CONTEXT}\n\nUser Question: ${message}\n\nProvide a helpful, concise response:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            reply: text,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Gemini API Error:', error);

        return NextResponse.json({
            reply: "I'm having trouble processing your request right now. Please try again or contact Pranay directly at pranaykgajbhiye@gmail.com.",
            timestamp: new Date().toISOString(),
        });
    }
}

// Fallback responses when API key is not configured
function getFallbackResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('trading') || lowerMessage.includes('quant')) {
        return "Pranay specializes in quantitative trading and order flow analysis at BlackObsidian AMC. He builds systematic trading strategies using Python, pandas, and various financial libraries. His approach combines market microstructure research with algorithmic execution.";
    }

    if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
        return "Pranay has worked on several projects including an Order Flow Analysis Dashboard, Algorithmic Trading Bot, Market Data Pipeline, and Portfolio Risk Analytics tools. You can check out his GitHub at github.com/Pusparaj99op for more details!";
    }

    if (lowerMessage.includes('skill') || lowerMessage.includes('tech')) {
        return "Pranay's tech stack includes Python, JavaScript/TypeScript, React, Next.js, and various data science libraries like pandas and NumPy. He also has expertise in algorithmic trading, risk management, and market analysis.";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email')) {
        return "You can reach Pranay at pranaykgajbhiye@gmail.com or connect with him on LinkedIn at linkedin.com/in/pranaygajbhiye. He's always open to discussing interesting projects and opportunities!";
    }

    if (lowerMessage.includes('blackobsidian') || lowerMessage.includes('company')) {
        return "BlackObsidian AMC is an asset management company founded by Pranay, based in the UAE. It focuses on quantitative trading strategies, order flow analytics, and systematic investment approaches.";
    }

    return "Thanks for your message! I'm Pranay's AI assistant. You can ask me about his trading experience, technical skills, projects, or how to get in touch. What would you like to know?";
}

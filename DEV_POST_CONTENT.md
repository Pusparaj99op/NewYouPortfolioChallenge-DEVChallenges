# Black Obsidian - Interactive 3D Portfolio with AI Assistant

*This is a submission for the [New Year, New You Portfolio Challenge Presented by Google AI](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31)*

---

## 🌟 Introduction

Hey everyone! I'm Pusparaj, and I've built **Black Obsidian** - an immersive 3D portfolio experience that combines cutting-edge web technologies with AI-powered interactions. This isn't your typical static portfolio; it's a journey through interactive 3D scenes, real-time data visualizations, and intelligent conversations powered by Google's Gemini AI.

---

## 🚀 Live Demo

{% cloudrun YOUR_CLOUD_RUN_URL_HERE %}

**Try these features:**
- 🎮 Explore the interactive 3D crystal scene (drag to rotate!)
- 💬 Chat with the AI assistant about my projects (powered by Gemini)
- 📊 View live Bitcoin market data and quantitative trading dashboard
- 🎨 Experience smooth animations and modern UI transitions

---

## ✨ Key Features

### 1. **Interactive 3D Scene**
Built with React Three Fiber and Three.js, featuring:
- Floating obsidian crystal with realistic shaders
- Dynamic particle systems
- Wireframe sphere animations
- Responsive WebGL rendering

![3D Scene Screenshot - Add your screenshot here]

### 2. **AI-Powered Chat Assistant**
Integrated Google Gemini AI for intelligent conversations:
- Answers questions about my projects and skills
- Provides context-aware responses
- Natural language understanding
- Real-time streaming responses

![AI Chat Screenshot - Add your screenshot here]

### 3. **Quantitative Trading Dashboard**
Live cryptocurrency data visualization:
- Real-time Bitcoin price via Binance API
- Interactive D3.js performance charts
- Live order book visualization
- Portfolio tracking with PostgreSQL database

![Trading Dashboard Screenshot - Add your screenshot here]

### 4. **Modern Web Animations**
- Smooth scroll animations with GSAP
- Magnetic button effects
- Scramble text animations
- Page transitions
- Custom cursor effects

---

## 🤖 How I Used Google Gemini AI

The heart of this portfolio's interactivity is the **AI Chat Assistant** powered by Google's Gemini API. I integrated it to create a conversational interface where visitors can learn about my work naturally.

### Implementation Highlights

**API Route** (`app/api/gemini/chat/route.ts`):

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  const { message, conversationHistory } = await req.json();
  
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-pro',
    systemInstruction: `You are an AI assistant for Pusparaj's portfolio...`
  });

  const chat = model.startChat({
    history: conversationHistory,
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  
  return NextResponse.json({ 
    reply: response.text(),
    timestamp: new Date().toISOString()
  });
}
```

**Frontend Component** (`components/AIChatAssistant.tsx`):

```typescript
const sendMessage = async () => {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: input,
      conversationHistory: messages
    }),
  });

  const data = await response.json();
  setMessages([...messages, 
    { role: 'user', content: input },
    { role: 'assistant', content: data.reply }
  ]);
};
```

### Why Gemini?

I chose Gemini for several reasons:
1. **Context Understanding**: Maintains conversation history for coherent multi-turn dialogues
2. **Fast Response Times**: Streaming responses for better UX
3. **Flexible Configuration**: Easy to customize temperature and output length
4. **Free Tier**: Generous API limits for portfolio projects

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **3D Graphics** | Three.js, React Three Fiber, @react-three/drei |
| **AI** | Google Gemini API |
| **Database** | PostgreSQL (Neon) |
| **Data Viz** | D3.js, Recharts |
| **Animations** | GSAP, Framer Motion |
| **Styling** | Tailwind CSS |
| **Deployment** | Google Cloud Run, Docker |
| **APIs** | Binance Market Data API |

---

## 💡 Development Journey

### Challenges Faced

1. **3D Performance Optimization**
   - Initial load times were slow with large 3D assets
   - **Solution**: Implemented lazy loading for Three.js components and optimized geometries

2. **Database Cold Starts**
   - PostgreSQL connections timing out on Cloud Run
   - **Solution**: Added connection pooling and SSL configuration for serverless environments

3. **Gemini API Rate Limits**
   - Needed to handle rate limiting gracefully
   - **Solution**: Implemented fallback responses and request queuing

### What I Learned

- **Serverless Architecture**: Optimizing Next.js standalone builds for containerized deployments
- **AI Integration**: Working with streaming responses and conversation context management
- **3D on the Web**: Balancing visual quality with performance across devices
- **Cloud Deployment**: Docker multi-stage builds and Cloud Run configuration

---

## 📊 Project Statistics

- **Lines of Code**: ~5,000+
- **Development Time**: 3 weeks
- **Components**: 35+ React components
- **API Routes**: 4 backend endpoints
- **3D Assets**: Custom shaders and geometries

---

## 🔗 Links

- 🌐 **Live Demo**: [Your Cloud Run URL]
- 💻 **GitHub Repository**: [https://github.com/Pusparaj99op/NewYouPortfolioChallenge-DEVChallenges](https://github.com/Pusparaj99op/NewYouPortfolioChallenge-DEVChallenges)
- 📖 **Deployment Guide**: [See DEPLOYMENT.md in repo]

---

## 🎯 What Makes This Different?

Unlike traditional portfolios, Black Obsidian focuses on:
- **Immersion**: 3D environments that draw you in
- **Intelligence**: AI that knows my work and can guide visitors
- **Interactivity**: Every element responds to user input
- **Real-time Data**: Live market feeds and trading analytics
- **Performance**: Optimized for production deployment

---

## 🚀 Future Enhancements

- [ ] Add VR/AR mode with WebXR
- [ ] Voice interaction with Gemini AI
- [ ] More trading indicators and backtesting features
- [ ] Multi-language support
- [ ] Dark/Light theme toggle with persistent preferences

---

## 🙏 Acknowledgments

- **Google AI** for the amazing Gemini API
- **DEV Community** for hosting this challenge
- **Vercel** for Next.js and deployment inspiration
- **Three.js Community** for incredible 3D tools

---

## 📝 License

This project is open source under the MIT License. Feel free to fork, learn from, and build upon it!

---

## 💬 Let's Connect!

I'd love to hear your feedback! Try the live demo, explore the code, and let me know what you think in the comments below. 

**What feature impressed you most? What would you add?** 👇

---

**Tags**: #devchallenge #googleaichallenge #portfolio #gemini #nextjs #threejs #cloudrun #ai

---

**Note to self before publishing**:
1. Replace `YOUR_CLOUD_RUN_URL_HERE` with actual URL
2. Add screenshots/GIFs for each feature section
3. Update the GitHub repo link if different
4. Test the cloudrun embed loads correctly
5. Verify all tags are included
6. Make sure post is set to "published" not "draft"

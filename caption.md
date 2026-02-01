> **🖼️ Cover Image**: *Drag and drop your cover image here*

# Black Obsidian: Immersive 3D Portfolio x Gemini AI

*This is a submission for the [New Year, New You Portfolio Challenge Presented by Google AI](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31)*

## About Me

Hey everyone! I'm Pusparaj, and I've built **Black Obsidian** - an immersive 3D portfolio experience that combines cutting-edge web technologies with AI-powered interactions.

I didn't want to build just another static portfolio; I wanted to create a journey. Black Obsidian invites you to explore interactive 3D scenes, play with real-time data visualizations, and have intelligent conversations with an AI assistant powered by Google's Gemini AI. It's a reflection of my passion for pushing the boundaries of what web experiences can be.

## Portfolio

{% cloudrun https://portfolio-209535685481.us-central1.run.app %}

**Try these features:**
- 🎮 **Innovation**: Explore the interactive 3D crystal scene (drag to rotate!)
- 💬 **AI Integration**: Chat with the AI assistant about my projects (powered by **Gemini Pro**)
- 📊 **Real-time Data**: View live Bitcoin market data and quantitative order books
- 🎨 **UX**: Experience smooth GSAP animations and responsive design

<div align="center">

## [🚀 Live Demo](https://portfolio-209535685481.us-central1.run.app) &nbsp;&nbsp;|&nbsp;&nbsp; [💻 GitHub Repo](https://github.com/Pusparaj99op/NewYouPortfolioChallenge-DEVChallenges)

</div>


## How I Built It

The core of my submission is the fusion of **3D WebGL graphics** with **Generative AI**. I built this project with a focus on performance, scalability, and modern best practices.

**Tech Stack:**
- **Frontend**: Next.js 15, React 19, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, @react-three/drei
- **AI**: Google Gemini API (`gemini-pro`)
- **Data & Backend**: PostgreSQL (Neon), Binance API, D3.js, Recharts
- **Styling & Animation**: Tailwind CSS, GSAP, Framer Motion
- **Deployment**: Google Cloud Run, Docker

### Gemini AI Integration
> **📸 Screenshot**: *Drag and drop your AI Chat screenshot here*

The **AI Chat Assistant** isn't just a chatbot; it's an integrated guide. By using **Google's Gemini API** with custom system instructions, I created a persona that understands my specific skills, project history, and professional background.

I used the `gemini-pro` model for its superior context handling. Here’s the core API route that manages multi-turn conversations:

```typescript
// app/api/gemini/chat/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  const { message, conversationHistory } = await req.json();

  // Initialize the model with specific system instructions
  const model = genAI.getGenerativeModel({
    model: 'gemini-pro',
    systemInstruction: `You are an AI assistant for Pusparaj's portfolio. You are helpful, professional, and knowledgeable about his projects...`
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

### 3D & Data Visualization
> **📸 Screenshot**: *Drag and drop your 3D Dashboard screenshot here*

The **Quantitative Trading Dashboard** demonstrates real-time data handling. I connect to the Binance WebSocket API to fetch live price updates and visualize the order book using **D3.js**. This required careful state management to ensure the UI remains responsive (60fps) while processing high-frequency data updates.

### Challenges & Learnings
1.  **3D Performance**: Loading complex 3D models can kill TTI (Time to Interactive). I solved this by using `GLTFLoader` with Draco compression and lazy-loading the canvas.
2.  **Serverless Cold Starts**: Connecting to PostgreSQL from Cloud Run can be slow initially. Connection pooling was essential to fix this.
3.  **Gemini Rate Limits**: To ensure reliability, I implemented robust error handling on the frontend to gracefully manage API limits.

## What I'm Most Proud Of

I'm incredibly proud of the **integration between the 3D environment and the AI**. Having a floating, interactive obsidian crystal that you can explore while chatting with a smart assistant feels really unique.

I also prioritized a premium ("Black Obsidian") aesthetic with **Smooth Scrollytelling** using GSAP and keeping **Accessibility** in mind.

This challenge pushed me to combine three distinct disciplines: 3D Graphics, Full-stack Engineering, and AI. I'm proud of the result—a portfolio that feels alive.

If you enjoyed this demo or found the code helpful, please **leave a reaction ❤️ and a comment!** I'd love to hear your feedback or answer any questions about the implementation.

---
*Open source under the MIT License. [Check out the code on GitHub!](https://github.com/Pusparaj99op/NewYouPortfolioChallenge-DEVChallenges)*

Tags : #devchallenge #googleaichallenge #portfolio #gemini

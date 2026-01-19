# BlackObsidian AMC Portfolio

A premium portfolio website for **Pranay Gajbhiye**, Founder of BlackObsidian AMC UAE. Features a trading terminal aesthetic with GSAP animations and Google Gemini AI integration.

🌐 **Live:** [pranaygajbhiye.me](https://pranaygajbhiye.me)

## ✨ Features

- **Trading Terminal Design** - Dark mode with financial color schemes
- **GSAP Animations** - Smooth scroll animations and transitions
- **AI Chat Assistant** - Gemini-powered conversational bot
- **Theme Toggle** - Dark/Light mode switch
- **Responsive** - Mobile-first design
- **SEO Optimized** - Meta tags and structured data

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animations:** GSAP
- **AI:** Google Gemini API
- **Deployment:** Google Cloud Run

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_key_here

# Run development server
npm run dev

# Open http://localhost:1189
```

## 🐳 Docker

```bash
# Build image
docker build -t blackobsidian-portfolio .

# Run container
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key blackobsidian-portfolio
```

## 📁 Project Structure

```
├── app/
│   ├── api/gemini/chat/    # AI chat endpoint
│   ├── globals.css         # Theme variables
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── sections/           # Page sections
│   ├── Header.tsx          # Navigation
│   ├── Footer.tsx          # Footer
│   └── AIChatAssistant.tsx # AI chat
└── Dockerfile              # Cloud Run deployment
```

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `NEXT_PUBLIC_SITE_URL` | Site URL |
| `CONTACT_EMAIL` | Contact email |

## 📦 Deployment

1. **Set GitHub Secrets:**
   - `GCP_PROJECT_ID` - Your GCP project ID
   - `GCP_SA_KEY` - Service account JSON key
   - `GEMINI_API_KEY` - Gemini API key

2. **Push to main branch** - CI/CD will deploy automatically

## 📝 Challenge

Built for the **DEV Challenge - Google AI 2025/2026** (New Year New You Portfolio Challenge)

- **Deadline:** February 1, 2026
- **Tags:** `devchallenge`, `googleaichallenge`, `portfolio`, `gemini`

## 👤 Author

**Pranay Gajbhiye**
- GitHub: [@Pusparaj99op](https://github.com/Pusparaj99op)
- LinkedIn: [pranaygajbhiye](https://linkedin.com/in/pranaygajbhiye)
- Twitter: [@pranaygajbhiye7](https://twitter.com/pranaygajbhiye7)

## 📄 License

MIT © 2026 BlackObsidian AMC

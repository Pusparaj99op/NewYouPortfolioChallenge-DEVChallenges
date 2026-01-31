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

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- API keys (Gemini, Binance - optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/Pusparaj99op/NewYouPortfolioChallenge-DEVChallenges.git
cd NewYouPortfolioChallenge-DEVChallenges

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables in .env.local
# Required:
#   GEMINI_API_KEY=your_gemini_api_key
#   BINANCE_API_KEY=your_binance_api_key (optional - for live market data)
#   POSTGRES_HOST=localhost
#   POSTGRES_USER=your_db_user
#   POSTGRES_PASSWORD=your_db_password
#   POSTGRES_DATABASE=portfolio_db

# Run development server
npm run dev

# Open http://localhost:1189
```

### Database Setup

After starting the dev server, initialize the database:

```bash
# Visit this URL in your browser or use curl
curl http://localhost:1189/api/setup-db

# This creates the portfolio table and seeds initial data
# Default: 10,000 USDT balance, 0 BTC
```

### Getting API Keys

1. **Gemini API Key** (for AI chat):
   - Visit https://aistudio.google.com/app/apikey
   - Create a new API key
   - Add to `.env.local` as `GEMINI_API_KEY`

2. **Binance API Key** (optional - for live market data):
   - Visit https://www.binance.com/en/my/settings/api-management
   - Create a read-only API key
   - Add to `.env.local` as `BINANCE_API_KEY`
   - If not set, market data endpoint will return error

3. **PostgreSQL Database**:
   - Local: Install PostgreSQL and create a database
   - Cloud: Use services like Supabase, Neon, or Google Cloud SQL
   - Update connection details in `.env.local`

## 🐳 Docker

### Local Docker Build

```bash
# Build image
docker build -t blackobsidian-portfolio .

# Run container
docker run -p 8080:8080 \
  -e GEMINI_API_KEY=your_gemini_key \
  -e BINANCE_API_KEY=your_binance_key \
  -e POSTGRES_HOST=your_db_host \
  -e POSTGRES_USER=your_db_user \
  -e POSTGRES_PASSWORD=your_db_password \
  -e POSTGRES_DATABASE=portfolio_db \
  blackobsidian-portfolio

# Open http://localhost:8080
```

### Google Cloud Run Deployment

```bash
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio

# Deploy to Cloud Run
gcloud run deploy blackobsidian-portfolio \
  --image gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=your_key,BINANCE_API_KEY=your_key \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:portfolio-db \
  --update-env-vars POSTGRES_HOST=/cloudsql/YOUR_PROJECT_ID:us-central1:portfolio-db

# Or use GitHub Actions (see .github/workflows/deploy.yml)
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

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for AI chat (has fallback) |
| `BINANCE_API_KEY` | Optional | Binance API key for live BTC price data |
| `POSTGRES_HOST` | Yes | PostgreSQL database host |
| `POSTGRES_USER` | Yes | PostgreSQL database username |
| `POSTGRES_PASSWORD` | Yes | PostgreSQL database password |
| `POSTGRES_DATABASE` | Yes | PostgreSQL database name |
| `NEXT_PUBLIC_SITE_URL` | Optional | Site URL (default: http://localhost:1189) |
| `CONTACT_EMAIL` | Optional | Contact email address |

See `.env.example` for detailed setup instructions.

## 📦 Deployment

### GitHub Actions CI/CD (Automated)

This project includes automated deployment to Google Cloud Run via GitHub Actions.

**Setup:**

1. **Create Google Cloud Project** and enable APIs:
   - Cloud Run API
   - Container Registry API
   - Cloud SQL Admin API (if using Cloud SQL)

2. **Create Service Account**:
   ```bash
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions Deployer"

   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"

   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"

   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

3. **Set GitHub Repository Secrets**:
   - `GCP_PROJECT_ID` - Your GCP project ID
   - `GCP_SA_KEY` - Service account JSON key (contents of key.json)
   - `GEMINI_API_KEY` - Gemini API key
   - `BINANCE_API_KEY` - Binance API key (optional)
   - `POSTGRES_HOST` - Database host
   - `POSTGRES_USER` - Database username
   - `POSTGRES_PASSWORD` - Database password
   - `POSTGRES_DATABASE` - Database name

4. **Push to main branch** - GitHub Actions will automatically:
   - Build Docker image
   - Push to Google Container Registry
   - Deploy to Cloud Run
   - Set environment variables

### Manual Deployment

See Docker section above for manual deployment commands.

### Database Migration

After deploying, initialize the database by visiting:
```
https://your-app-url.run.app/api/setup-db
```

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

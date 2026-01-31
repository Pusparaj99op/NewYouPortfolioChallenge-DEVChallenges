# 🚀 Deployment Guide - Black Obsidian Portfolio

> **DEV Challenge Submission**: New Year, New You Portfolio Challenge Presented by Google AI

Complete guide to deploy this Next.js portfolio to **Google Cloud Run** for the DEV Challenge.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Local Development](#local-development)
4. [Database Setup](#database-setup)
5. [Google Cloud Run Deployment](#google-cloud-run-deployment)
6. [DEV Challenge Submission](#dev-challenge-submission)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Tools

| Tool | Version | Installation |
|------|---------|--------------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| Docker | Latest | [docker.com](https://www.docker.com/get-started) |
| Google Cloud SDK | Latest | [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install) |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Required Accounts & API Keys

1. **Google Cloud Platform Account** - [console.cloud.google.com](https://console.cloud.google.com/)
2. **Google AI Studio (Gemini API)** - [aistudio.google.com](https://aistudio.google.com/)
3. **Binance Account** (for market data API) - [binance.com](https://www.binance.com/)
4. **PostgreSQL Database** - Options:
   - [Neon](https://neon.tech/) (Free tier, recommended)
   - [Supabase](https://supabase.com/) (Free tier)
   - [Google Cloud SQL](https://cloud.google.com/sql)

---

## 🔑 Environment Variables

Create a `.env.local` file for local development:

```bash
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Binance API (for market data)
BINANCE_API_KEY=your_binance_api_key_here

# PostgreSQL Database
DATABASE_HOST=your_database_host
DATABASE_USER=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=your_database_name
```

### How to Get API Keys

#### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click **Get API Key** → **Create API Key**
3. Copy the key and save it securely

#### Binance API Key
1. Log into [Binance](https://www.binance.com/)
2. Go to **Account** → **API Management**
3. Create a new API key (read-only permissions are sufficient)
4. Copy both API Key and Secret

#### PostgreSQL Database (Neon - Recommended)
1. Sign up at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection details:
   - Host: `ep-xxx.us-east-2.aws.neon.tech`
   - User: `your_username`
   - Password: `your_password`
   - Database: `neondb` (or your chosen name)

---

## 💻 Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/Pusparaj99op/NewYouPortfolioChallenge-DEVChallenges.git
cd NewYouPortfolioChallenge-DEVChallenges
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Build for Production (Test)

```bash
npm run build
npm start
```

---

## 🗄️ Database Setup

### Initialize Database Schema

After deployment (or locally), visit the setup endpoint to create tables:

```
GET /api/setup-db
```

This creates the `portfolio` table with:
- `id` (Primary Key)
- `usdt_balance` (Decimal)
- `btc_balance` (Decimal)
- `updated_at` (Timestamp)

---

## ☁️ Google Cloud Run Deployment

### Step 1: Set Up Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create YOUR_PROJECT_ID --name="Portfolio Challenge"

# Set the project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 2: Build Docker Image

```bash
# Build the image
docker build -t gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio .

# Test locally (optional)
docker run -p 8080:8080 \
  -e GEMINI_API_KEY=your_key \
  -e BINANCE_API_KEY=your_key \
  -e DATABASE_HOST=your_host \
  -e DATABASE_USER=your_user \
  -e DATABASE_PASSWORD=your_password \
  -e DATABASE_NAME=your_db \
  gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio
```

### Step 3: Push to Google Container Registry

```bash
# Configure Docker for GCR
gcloud auth configure-docker

# Push the image
docker push gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio
```

### Step 4: Deploy to Cloud Run

```bash
gcloud run deploy blackobsidian-portfolio \
  --image gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio \
  --platform managed \
  --region us-central1 \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80 \
  --set-env-vars "GEMINI_API_KEY=YOUR_GEMINI_KEY" \
  --set-env-vars "BINANCE_API_KEY=YOUR_BINANCE_KEY" \
  --set-env-vars "DATABASE_HOST=YOUR_DB_HOST" \
  --set-env-vars "DATABASE_USER=YOUR_DB_USER" \
  --set-env-vars "DATABASE_PASSWORD=YOUR_DB_PASSWORD" \
  --set-env-vars "DATABASE_NAME=YOUR_DB_NAME" \
  --labels dev-tutorial=devnewyear2026 \
  --allow-unauthenticated
```

> ⚠️ **IMPORTANT**: The `--labels dev-tutorial=devnewyear2026` flag is **REQUIRED** for DEV Challenge submission!

### Step 5: Initialize Database

After deployment, visit:
```
https://YOUR_CLOUD_RUN_URL/api/setup-db
```

### Step 6: Verify Deployment

Test these endpoints:
- Homepage: `https://YOUR_CLOUD_RUN_URL/`
- Market Data: `https://YOUR_CLOUD_RUN_URL/api/market-data`
- Portfolio: `https://YOUR_CLOUD_RUN_URL/api/portfolio`

---

## 📝 DEV Challenge Submission

### Submission Checklist

- [ ] Cloud Run deployment is live and functional
- [ ] Used `--labels dev-tutorial=devnewyear2026` in deployment
- [ ] DEV post uses the [submission template](https://dev.to/new?prefill=---%0Atitle%3A%20%0Apublished%3A%20%0Atags%3A%20devchallenge%2C%20googleaichallenge%2C%20portfolio%2C%20gemini%0A---%0A%0A*This%20is%20a%20submission%20for%20the%20%5BNew%20Year%2C%20New%20You%20Portfolio%20Challenge%20Presented%20by%20Google%20AI%5D(https%3A%2F%2Fdev.to%2Fchallenges%2Fnew-year-new-you-google-ai-2025-12-31)*)
- [ ] Cloud Run embed added to DEV post
- [ ] GitHub repo is public with MIT/Apache/BSD license
- [ ] README includes setup instructions
- [ ] "How AI was used" section in DEV post
- [ ] Screenshots/GIFs of key features
- [ ] Post written in English

### Embed Cloud Run in DEV Post

Use this syntax in your DEV post:

```markdown
{% cloudrun YOUR_CLOUD_RUN_URL %}
```

Example:
```markdown
{% cloudrun https://blackobsidian-portfolio-xxxxx-uc.a.run.app %}
```

### Required Tags

Include these tags in your DEV post:
- `devchallenge`
- `googleaichallenge`
- `portfolio`
- `gemini`

---

## 🔍 Troubleshooting

### Common Issues

#### 1. "Container failed to start"
- Check port is set to `8080`
- Verify `HOSTNAME=0.0.0.0` is in Dockerfile
- Check memory allocation (try 1Gi or 2Gi)

#### 2. Database Connection Failed
- Ensure SSL is enabled in connection string
- Verify DATABASE_* environment variables are set
- For Cloud SQL: Add `--add-cloudsql-instances` flag

#### 3. Gemini API Not Working
- Verify GEMINI_API_KEY is correct
- Check API quota in Google Cloud Console
- The app falls back to static responses if key is missing

#### 4. Slow Cold Starts
- Set `--min-instances 1` to keep one instance warm
- This increases cost but improves response time

#### 5. Build Fails
```bash
# Clear Docker cache and rebuild
docker system prune -a
docker build --no-cache -t gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio .
```

### View Logs

```bash
# Stream logs
gcloud run logs tail blackobsidian-portfolio --region us-central1

# View recent logs
gcloud run logs read blackobsidian-portfolio --region us-central1 --limit 50
```

### Update Deployment

```bash
# Rebuild and push
docker build -t gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio .
docker push gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio

# Redeploy (uses same command as initial deploy)
gcloud run deploy blackobsidian-portfolio \
  --image gcr.io/YOUR_PROJECT_ID/blackobsidian-portfolio \
  --platform managed \
  --region us-central1 \
  --labels dev-tutorial=devnewyear2026
```

---

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Embed Guide](https://dev.to/devteam/you-can-now-embed-cloud-run-deployments-directly-in-your-dev-posts-1jk8)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [DEV Challenge Rules](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Deadline**: February 1, 2026, 11:59 PM PT

Good luck with your submission! 🎉

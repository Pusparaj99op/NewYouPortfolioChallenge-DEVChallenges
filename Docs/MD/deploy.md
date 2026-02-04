# 🎯 Complete Deployment Guide from Scratch
## New Year, New You Portfolio Challenge - DEV.to

> **Deadline**: February 1, 2026, 11:59 PM PT (That's TODAY!)

This guide assumes **ZERO prior experience**. Follow every step carefully.

---

## 📱 Table of Contents

1. [Part 1: Get All Your API Keys](#part-1-get-all-your-api-keys)
2. [Part 2: Set Up Google Cloud](#part-2-set-up-google-cloud)
3. [Part 3: Set Up Database](#part-3-set-up-database)
4. [Part 4: Configure Your Project](#part-4-configure-your-project)
5. [Part 5: Deploy to Cloud Run](#part-5-deploy-to-cloud-run)
6. [Part 6: Create DEV.to Post](#part-6-create-devto-post)
7. [Part 7: Submit](#part-7-submit)

---

## Part 1: Get All Your API Keys

### 1.1 Google Gemini API Key

**What it's for**: AI chat assistant in your portfolio

1. Go to [https://aistudio.google.com/](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click **"Get API Key"** (top right)
4. Click **"Create API key in new project"**
5. Copy the key that appears
6. Save it in a notepad - label it "GEMINI_API_KEY"

**Example**: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxx`

### 1.2 Binance API Key

**What it's for**: Live Bitcoin price data

1. Go to [https://www.binance.com/](https://www.binance.com/)
2. Create account / Sign in
3. Go to **Profile Icon** → **API Management**
4. Click **"Create API"**
5. Choose **"System Generated"**
6. Complete security verification (2FA)
7. Copy both:
   - API Key
   - Secret Key
8. Save them in notepad - label "BINANCE_API_KEY" and "BINANCE_SECRET"

**Example**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxX`

⚠️ **Security**: Enable **"Read Only"** permissions (don't need trading access)

---

## Part 2: Set Up Google Cloud

### 2.1 Install Google Cloud SDK

**Windows**:
1. Download from [https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
2. Run the installer
3. Check "Run gcloud init" at the end

**Mac**:
```bash
brew install --cask google-cloud-sdk
```

**Linux**:
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

### 2.2 Initialize Google Cloud

Open your terminal and run:

```bash
gcloud init
```

Follow the prompts:
1. Login to your Google account (browser will open)
2. Choose **"Create a new configuration"**
3. Name it: `portfolio`
4. Choose **"Create a new project"**
5. Project ID: `blackobsidian-portfolio` (must be unique globally)
   - If taken, try: `your-name-portfolio-2026`
6. Choose region: `us-central1`

### 2.3 Enable Required APIs

Copy and paste these commands one by one:

```bash
# Set your project (replace with YOUR project ID from step 2.2)
gcloud config set project blackobsidian-portfolio

# Enable Cloud Run
gcloud services enable run.googleapis.com

# Enable Container Registry
gcloud services enable containerregistry.googleapis.com

# Enable Cloud Build
gcloud services enable cloudbuild.googleapis.com
```

Wait for each command to finish (takes 10-30 seconds each).

### 2.4 Install Docker

**Windows/Mac**: Download Docker Desktop from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

**Linux**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

Restart your computer after installation.

### 2.5 Configure Docker for Google Cloud

```bash
gcloud auth configure-docker
```

Type `Y` when prompted.

---

## Part 3: Set Up Database

### Option A: Neon (Recommended - FREE & Easy)

1. Go to [https://neon.tech/](https://neon.tech/)
2. Sign up with GitHub/Google
3. Click **"Create a project"**
4. Name: `portfolio-db`
5. Region: Choose closest to you (e.g., US East)
6. Click **"Create project"**

After creation, you'll see **Connection Details**:

```
postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Save these separately:
- **DATABASE_HOST**: `ep-xxx.us-east-2.aws.neon.tech`
- **DATABASE_USER**: `username` (before the `:`)
- **DATABASE_PASSWORD**: `password` (between `:` and `@`)
- **DATABASE_NAME**: `neondb`

### Option B: Supabase (Also FREE)

1. Go to [https://supabase.com/](https://supabase.com/)
2. Sign up → **"New project"**
3. Choose organization, name: `portfolio`
4. Choose region, set password
5. Go to **Settings** → **Database**
6. Find **"Connection string"** → **"URI"**
7. Copy and extract the parts like Option A

---

## Part 4: Configure Your Project

### 4.1 Open Your Project

```bash
cd /home/pranay/Documents/GitHub/NewYouPortfolioChallenge-DEVChallenges
```

### 4.2 Create Environment File

Create a file called `.env.local`:

```bash
nano .env.local
```

Paste this (replace with YOUR actual values):

```env
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxx
BINANCE_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxX
DATABASE_HOST=ep-xxx.us-east-2.aws.neon.tech
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=neondb
```

Save and exit:
- Press `Ctrl + O` (save)
- Press `Enter`
- Press `Ctrl + X` (exit)

### 4.3 Test Locally (Optional but Recommended)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

If it works, press `Ctrl + C` to stop.

---

## Part 5: Deploy to Cloud Run

### 5.1 Build Docker Image

Replace `blackobsidian-portfolio` with YOUR project ID:

```bash
docker build -t gcr.io/blackobsidian-portfolio/portfolio-app .
```

This takes 5-10 minutes. You'll see lots of output.

### 5.2 Push to Google Container Registry

```bash
docker push gcr.io/blackobsidian-portfolio/portfolio-app
```

This takes 3-5 minutes to upload.

### 5.3 Deploy to Cloud Run

**⚠️ CRITICAL**: The `--labels dev-tutorial=devnewyear2026` flag is REQUIRED for the challenge!

```bash
gcloud run deploy portfolio \
  --image gcr.io/blackobsidian-portfolio/portfolio-app \
  --platform managed \
  --region us-central1 \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars "GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE" \
  --set-env-vars "BINANCE_API_KEY=YOUR_BINANCE_KEY_HERE" \
  --set-env-vars "DATABASE_HOST=YOUR_DATABASE_HOST" \
  --set-env-vars "DATABASE_USER=YOUR_DATABASE_USER" \
  --set-env-vars "DATABASE_PASSWORD=YOUR_DATABASE_PASSWORD" \
  --set-env-vars "DATABASE_NAME=YOUR_DATABASE_NAME" \
  --labels dev-tutorial=devnewyear2026 \
  --allow-unauthenticated
```

**Replace the environment variable values** with your actual keys from Part 1 and Part 3.

When prompted:
- Allow unauthenticated invocations? → Type `y` and press Enter

### 5.4 Get Your Deployment URL

After deployment completes, you'll see:

```
Service [portfolio] revision [portfolio-00001-xxx] has been deployed and is serving 100 percent of traffic.
Service URL: https://portfolio-xxxxx-uc.a.run.app
```

**Copy this URL** - you'll need it for the DEV post!

### 5.5 Initialize Database

Visit this URL in your browser (replace with YOUR URL):

```
https://portfolio-xxxxx-uc.a.run.app/api/setup-db
```

You should see:
```json
{
  "success": true,
  "message": "Database setup complete"
}
```

### 5.6 Test Your Deployment

Visit these URLs:

1. **Homepage**: `https://portfolio-xxxxx-uc.a.run.app/`
2. **Market Data**: `https://portfolio-xxxxx-uc.a.run.app/api/market-data`
3. **AI Chat**: Click the chat button on your site

If everything works, you're ready to submit! 🎉

---

## Part 6: Create DEV.to Post

### 6.1 Use the Template

Click this link to auto-fill the template:

[https://dev.to/new?prefill=---%0Atitle%3A%20%0Apublished%3A%20%0Atags%3A%20devchallenge%2C%20googleaichallenge%2C%20portfolio%2C%20gemini%0A---%0A%0A*This%20is%20a%20submission%20for%20the%20%5BNew%20Year%2C%20New%20You%20Portfolio%20Challenge%20Presented%20by%20Google%20AI%5D(https%3A%2F%2Fdev.to%2Fchallenges%2Fnew-year-new-you-google-ai-2025-12-31)*](https://dev.to/new?prefill=---%0Atitle%3A%20%0Apublished%3A%20%0Atags%3A%20devchallenge%2C%20googleaichallenge%2C%20portfolio%2C%20gemini%0A---%0A%0A*This%20is%20a%20submission%20for%20the%20%5BNew%20Year%2C%20New%20You%20Portfolio%20Challenge%20Presented%20by%20Google%20AI%5D(https%3A%2F%2Fdev.to%2Fchallenges%2Fnew-year-new-you-google-ai-2025-12-31)*)

### 6.2 Fill in Your Title

Example: `"Black Obsidian - An Interactive 3D Portfolio with AI"`

### 6.3 Embed Your Cloud Run Deployment

Add this anywhere in your post (replace with YOUR URL):

```markdown
{% cloudrun https://portfolio-xxxxx-uc.a.run.app %}
```

### 6.4 Write Your Post Content

Include these sections (judges look for these):

#### 1. Introduction
- What you built in 1-2 sentences
- Who you are

#### 2. Demo (After the embed)
```markdown
Try it yourself:
- Explore the 3D interactive scene
- Chat with the AI assistant (powered by Gemini)
- Check out the quantitative trading dashboard
```

#### 3. Features
- List 3-5 key features with screenshots

#### 4. How AI Was Used (REQUIRED)
```markdown
## How I Used Google Gemini AI

I integrated Google's Gemini API for an intelligent chat assistant that helps visitors learn about my projects.

Code snippet from `app/api/gemini/chat/route.ts`:

[Paste a small code snippet showing Gemini integration]
```

#### 5. Tech Stack
- Next.js 15
- React Three Fiber (3D graphics)
- Google Gemini AI
- PostgreSQL
- Deployed on Google Cloud Run

#### 6. Challenges & Learnings
- 2-3 sentences about what you learned

#### 7. Links
```markdown
- 🔗 [Live Demo](https://your-url.run.app)
- 💻 [GitHub Repo](https://github.com/Pusparaj99op/NewYouPortfolioChallenge-DEVChallenges)
```

### 6.5 Add Screenshots

Take screenshots of:
1. Your homepage
2. The 3D scene
3. AI chat in action
4. Any unique features

Upload them in the DEV editor (drag and drop images).

### 6.6 Verify Tags

Make sure these tags are in your post:
- `devchallenge`
- `googleaichallenge`
- `portfolio`
- `gemini`

---

## Part 7: Submit

### 7.1 Final Checklist

Before publishing, verify:

- [ ] Cloud Run URL is live and working
- [ ] Used `{% cloudrun URL %}` embed syntax
- [ ] Post has all required tags
- [ ] "How AI was used" section included
- [ ] GitHub repo is public
- [ ] LICENSE file exists (MIT)
- [ ] Screenshots/GIFs included
- [ ] Post is in English

### 7.2 Publish

1. Click **"Publish"** in DEV editor
2. Share your post on social media
3. Share in the challenge discussion

### 7.3 Verify Submission

1. Go to your published post
2. Check that the Cloud Run embed loads
3. Make sure it's tagged with the challenge

---

## 🆘 Troubleshooting

### "Command not found: gcloud"

**Fix**: Restart your terminal after installing Google Cloud SDK, or run:
```bash
source ~/.bashrc  # Linux/Mac
```

### "Permission denied" errors

**Fix**: Add `sudo` before the command (Linux) or run terminal as Administrator (Windows).

### Docker build fails

**Fix**: Make sure Docker Desktop is running. Restart it if needed.

### Cloud Run deployment fails

**Fix**: Check these:
```bash
# Verify project is set
gcloud config get-value project

# Verify APIs are enabled
gcloud services list --enabled
```

### Database connection fails

**Fix**: 
1. Double-check your DATABASE_* environment variables
2. Make sure the database allows connections from anywhere (0.0.0.0/0)
3. For Neon: Connection string should have `?sslmode=require` at the end

### Can't find Cloud Run URL

**Fix**:
```bash
gcloud run services list --platform managed --region us-central1
```

### Embed not working in DEV post

**Fix**:
1. Use `{% cloudrun URL %}` not just the URL
2. Make sure Cloud Run service is `--allow-unauthenticated`
3. Wait 1-2 minutes after publishing for embed to load

---

## 🎯 Quick Reference Commands

### View your deployment
```bash
gcloud run services describe portfolio --region us-central1
```

### View logs
```bash
gcloud run logs tail portfolio --region us-central1
```

### Update deployment (after code changes)
```bash
# Rebuild
docker build -t gcr.io/blackobsidian-portfolio/portfolio-app .

# Push
docker push gcr.io/blackobsidian-portfolio/portfolio-app

# Redeploy (Cloud Run auto-updates)
gcloud run deploy portfolio \
  --image gcr.io/blackobsidian-portfolio/portfolio-app \
  --platform managed \
  --region us-central1 \
  --labels dev-tutorial=devnewyear2026
```

### Delete deployment (if you need to start over)
```bash
gcloud run services delete portfolio --region us-central1
```

---

## 📞 Need Help?

- **Google Cloud Docs**: [https://cloud.google.com/run/docs](https://cloud.google.com/run/docs)
- **DEV Challenge**: [https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31](https://dev.to/challenges/new-year-new-you-google-ai-2025-12-31)
- **Gemini API**: [https://ai.google.dev/docs](https://ai.google.dev/docs)

---

**Good luck! The deadline is TODAY (Feb 1, 2026)!** ⏰

Remember: The judges look for **Innovation**, **Technical Implementation**, and **User Experience**. Make your post clear, visual, and professional! 🚀

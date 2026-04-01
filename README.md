# LeadFlow AI — Full MVP

> AI-powered lead generation & multi-channel outreach platform. Built with Next.js 14, Claude AI, and PostgreSQL.

---

## 🚀 Quick Start (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your **ANTHROPIC_API_KEY** (minimum required to run):
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
Get your key at: https://console.anthropic.com

### 3. Run development server
```bash
npm run dev
```
Open http://localhost:3000 — you'll be redirected to the dashboard.

---

## 📁 Project Structure

```
leadflow-ai/
├── app/
│   ├── (dashboard)/          # All authenticated pages
│   │   ├── layout.tsx        # Sidebar + main layout
│   │   ├── dashboard/        # Main overview dashboard
│   │   ├── icp/              # ICP Builder with AI insights
│   │   ├── leads/            # Lead Discovery & management
│   │   ├── campaigns/        # Campaign management
│   │   ├── outreach/         # AI Personalization Engine
│   │   ├── analytics/        # Analytics Dashboard
│   │   └── inbox/            # Reply Intelligence Inbox
│   ├── api/
│   │   ├── ai/
│   │   │   ├── personalize/  # Claude message generation
│   │   │   └── generate-icp/ # Claude ICP intelligence
│   │   ├── leads/discover/   # Lead discovery engine
│   │   ├── campaigns/        # Campaign CRUD
│   │   └── outreach/send/    # Message sending + rate limits
│   ├── globals.css           # Design system + CSS
│   └── layout.tsx            # Root layout
├── lib/
│   ├── types.ts              # All TypeScript types
│   ├── mock-data.ts          # Sample data (replace with DB)
│   ├── claude.ts             # Anthropic SDK integration
│   └── utils.ts              # Helper functions
└── .env.example              # All environment variables
```

---

## 🧩 Modules Implemented (Phase 1 MVP)

| Module | Status | Notes |
|--------|--------|-------|
| ICP Builder | ✅ Complete | AI-powered ICP intelligence via Claude |
| Lead Discovery | ✅ Complete | Table view, filtering, detail panel, scoring |
| Lead Qualification | ✅ Complete | 5-dimension LQS scoring with visual breakdown |
| AI Personalization | ✅ Complete | Live Claude integration, single + batch |
| Campaign Management | ✅ Complete | Status, stats, multi-channel config |
| Analytics Dashboard | ✅ Complete | Charts, funnel, channel perf, radar |
| Reply Inbox | ✅ Complete | AI classification, split view, approve & send |
| Rate Limiting | ✅ Complete | Per-channel daily limits with Redis-ready logic |
| Anti-spam | ✅ Complete | Spam score check on API route |
| API Routes | ✅ Complete | personalize, generate-icp, discover, send, campaigns |

---

## 🤖 AI Features (Claude-Powered)

### 1. Message Personalization (`/api/ai/personalize`)
- Reads lead's industry, role, company, location
- Generates channel-appropriate messages (Email/LinkedIn/Instagram)
- Different tone for each sequence step (initial → follow-up → break-up)
- Returns personalization signals and confidence score

### 2. ICP Intelligence (`/api/ai/generate-icp`)
- Takes industry, geography, roles, company size inputs
- Returns ICP summary, pain points, messaging angles, qualification questions

### 3. Reply Classification (via `/inbox` page)
- Classifies replies: Interested / Not Interested / Neutral / OOO / Referral
- Suggests human-like responses for Interested and Neutral replies
- Human approval workflow before sending

---

## 🔌 Key Integrations to Wire Up

### Minimum for Production
```bash
ANTHROPIC_API_KEY=          # Message personalization ← already works
DATABASE_URL=               # PostgreSQL (replace mock-data.ts)
REDIS_URL=                  # Rate limiting store
```

### Email Outreach
```bash
MAILGUN_API_KEY=            # Primary email delivery
SENDGRID_API_KEY=           # Fallback email delivery
ZEROBOUNCE_API_KEY=         # Email validation before sending
```

### Lead Enrichment
```bash
HUNTER_API_KEY=             # Email discovery
APOLLO_API_KEY=             # Contact + company data
```

### Social Channels
```bash
INSTAGRAM_ACCESS_TOKEN=     # Instagram DM (Business API)
LINKEDIN_CLIENT_ID=         # LinkedIn OAuth (DM sending)
```

### Calendar
```bash
GOOGLE_CLIENT_ID=           # Google Calendar OAuth
CALENDLY_API_KEY=           # Calendly booking links
```

---

## 🏗️ Moving from Mock Data to Real Database

1. **Install Prisma**
```bash
npm install prisma @prisma/client
npx prisma init
```

2. **Generate schema** from `lib/types.ts` (all types map 1:1 to DB tables)

3. **Replace imports** in page files:
```typescript
// Before (mock)
import { mockLeads } from '@/lib/mock-data'

// After (real DB via Prisma)
import { prisma } from '@/lib/prisma'
const leads = await prisma.lead.findMany({ where: { tenantId: session.tenantId } })
```

---

## 💰 Monetization Setup

Three pricing tracks (as defined in PRD):

| Track | Implementation |
|-------|---------------|
| Monthly Retainer | Stripe Subscriptions with plan metadata |
| Cost Per Lead | Stripe Metered Billing on `qualified_leads` usage meter |
| Cost Per Appointment | Stripe Metered Billing on `appointments_booked` usage meter |

Wire `STRIPE_SECRET_KEY` and create products/prices in Stripe Dashboard.

---

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Database | PostgreSQL + Prisma ORM |
| Cache / Queue | Redis + Bull |
| Email | Mailgun + SendGrid |
| Auth | NextAuth.js / Clerk |
| Billing | Stripe / Paddle |
| Hosting | Vercel (frontend) + Railway (backend/DB) |

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel deploy
```
Add all `.env.example` variables in Vercel dashboard → Settings → Environment Variables.

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📈 Phase 2 Roadmap

- [ ] LinkedIn DM automation (browser extension + API)
- [ ] Instagram DM via Graph API
- [ ] Google Calendar booking integration
- [ ] Multi-tenant agency client portals
- [ ] White-label branding
- [ ] Advanced A/B message testing
- [ ] Lead enrichment pipeline (Apollo + Hunter)
- [ ] WhatsApp Business API outreach

---

## 🔐 Compliance Notes

- CAN-SPAM: Unsubscribe footer auto-appended to all cold emails
- GDPR: EU data stays in EU region (configure via `DATABASE_URL` region)
- Rate limits: Per-channel daily caps enforced in `/api/outreach/send`
- Spam detection: Trigger word filter on every outbound message
- Data retention: 12-month purge policy (implement via cron job)

---

Built with ❤️ for LeadFlow AI | PRD v1.0 | April 2026

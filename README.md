# BeyondChats Content Intelligence Platform

A full-stack web application that scrapes, enhances, and manages blog articles using AI-powered content optimization.

## Project Overview

This project implements a 3-phase content intelligence system:

1. **Phase 1**: Scrapes the 5 oldest articles from [BeyondChats Blog](https://beyondchats.com/blogs/) and stores them in a database
2. **Phase 2**: Enhances articles using Google Search + LLM cross-referencing to improve SEO and content quality
3. **Phase 3**: Provides a responsive React frontend to view, compare, and interact with articles

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js React)                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │  Lab Dashboard  │  │   Compare View  │  │       Chat Interface        │  │
│  │  /lab           │  │  Side-by-side   │  │  AI-powered Q&A on docs     │  │
│  └────────┬────────┘  └────────┬────────┘  └─────────────┬───────────────┘  │
└───────────┼────────────────────┼─────────────────────────┼──────────────────┘
            │                    │                         │
            ▼                    ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            API ROUTES (Next.js)                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  /api/articles                                                       │    │
│  │    GET    - List all articles                                       │    │
│  │    POST   - Create article OR trigger scrape (action: 'scrape')     │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  /api/articles/[id]                                                 │    │
│  │    GET    - Get single article                                      │    │
│  │    PATCH  - Update article                                          │    │
│  │    DELETE - Delete article                                          │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  /api/articles/[id]/enhance                                         │    │
│  │    POST   - Enhance article with Google + LLM                       │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  /api/chat                                                          │    │
│  │    POST   - Chat with article context                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
            │                    │                         │
            ▼                    ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICES (src/lib/)                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   scraper.ts    │  │    search.ts    │  │          llm.ts             │  │
│  │ Cheerio-based   │  │ Google Search   │  │  Groq/OpenRouter LLM        │  │
│  │ blog scraping   │  │ + URL scraping  │  │  Article enhancement        │  │
│  └────────┬────────┘  └────────┬────────┘  └─────────────┬───────────────┘  │
└───────────┼────────────────────┼─────────────────────────┼──────────────────┘
            │                    │                         │
            ▼                    ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL SERVICES                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │    Supabase     │  │  Google Search  │  │     Groq / OpenRouter       │  │
│  │   PostgreSQL    │  │   (scraping)    │  │      LLM API                │  │
│  │   Database      │  │                 │  │                             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. SCRAPE FLOW
   BeyondChats Blog → scraper.ts → Supabase DB (is_updated: false)

2. ENHANCE FLOW
   Original Article
        ↓
   generateSearchQueries(title) → LLM generates search queries
        ↓
   searchGoogle(query) → Get top 5 Google results
        ↓
   scrapeExternalArticle(url) → Extract content from ranking articles
        ↓
   enhanceArticle(original, references) → LLM rewrites with citations
        ↓
   Supabase DB (is_updated: true, original_id: linked, reference_links: [])

3. VIEW FLOW
   Supabase → API → React Frontend (View/Compare/Chat modes)
```

## Live Demo

**[View Live Application](https://beyond-chat-assignment.vercel.app/lab)**

## Local Setup Instructions

### Prerequisites

- Node.js 18+ or Bun
- A Supabase account (free tier works)
- An LLM API key (Groq or OpenRouter)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BeyondChat-assignment
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# LLM API (choose one)
GROQ_API_KEY=your_groq_api_key
# OR
OPENROUTER_API_KEY=your_openrouter_api_key


```

### 4. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor to create the articles table:

```sql
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  is_updated BOOLEAN DEFAULT FALSE,
  original_id UUID REFERENCES articles(id),
  reference_links JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create a policy for public access (for demo purposes)
CREATE POLICY "Allow public access" ON articles FOR ALL USING (true);
```

### 5. Run the Development Server

```bash
npm run dev
# or
bun dev
```
Open [http://localhost:3000/lab](http://localhost:3000/lab) to access the Lab Dashboard.


## Project Structure

```
BeyondChat-assignment/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── articles/
│   │   │   │   ├── route.ts        # GET all, POST scrape/create
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts    # GET, PATCH, DELETE by ID
│   │   │   │       └── enhance/
│   │   │   │           └── route.ts # POST enhance with AI
│   │   │   └── chat/
│   │   │       └── route.ts        # POST chat with context
│   │   ├── lab/
│   │   │   └── page.tsx            # Main Lab Dashboard (View/Compare/Chat)
│   │   └── page.tsx                # Landing page
│   ├── lib/
│   │   ├── scraper.ts              # BeyondChats blog scraper
│   │   ├── search.ts               # Google search + URL scraper
│   │   ├── llm.ts                  # Groq/OpenRouter integration
│   │   └── supabase.ts             # Database client
│   └── components/                  # UI components
├── .env                             # Environment variables
├── package.json
└── README.md
```

## API Reference

### Articles API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get all articles |
| GET | `/api/articles?is_updated=true` | Get only enhanced articles |
| POST | `/api/articles` | Create article (body: `{title, content, source_url}`) |
| POST | `/api/articles` | Scrape blogs (body: `{action: 'scrape'}`) |
| GET | `/api/articles/[id]` | Get single article |
| PATCH | `/api/articles/[id]` | Update article |
| DELETE | `/api/articles/[id]` | Delete article |
| POST | `/api/articles/[id]/enhance` | Enhance article with AI |

### Chat API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Chat with article context (body: `{message, history, context}`) |

## Features

- **Smart Scraping**: Automatically fetches the 5 oldest articles from BeyondChats blog
- **AI Enhancement**: Cross-references with top Google results and rewrites for SEO
- **Compare View**: Side-by-side comparison of original vs enhanced content
- **AI Chat**: Ask questions about any article with context-aware responses
- **Responsive UI**: Dark-themed, professional interface with smooth animations
- **Citations**: All enhanced articles include reference links to source material

## Tech Stack

- **Frontend**: Next.js 15, React 19, Framer Motion, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI/LLM**: Groq (Llama 3.3) / OpenRouter (Gemini 2.0 Flash)
- **Scraping**: Cheerio, Axios
## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

